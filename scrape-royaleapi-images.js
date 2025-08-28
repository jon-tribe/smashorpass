const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function scrapeRoyaleAPI() {
  console.log('🚀 Starting RoyaleAPI image scraping...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('📄 Loading RoyaleAPI cards page...');
    await page.goto('https://royaleapi.com/cards/popular?time=7d&mode=grid&cat=Ranked&sort=rating', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a bit for the page to load
    await page.waitForTimeout(5000);
    
    console.log('🔍 Extracting card information...');
    
    // Extract all card data from the page with a more flexible approach
    const cards = await page.evaluate(() => {
      // Try multiple selectors to find card elements
      const selectors = [
        'a[href*="/cards/"]',
        '.card',
        '[data-card]',
        'img[src*="cards"]',
        'div[class*="card"]'
      ];
      
      let cardElements = [];
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          cardElements = Array.from(elements);
          break;
        }
      }
      
      const cardData = [];
      
      cardElements.forEach((element, index) => {
        try {
          let name = null;
          let imageUrl = null;
          
          // Try to find the card name
          const nameSelectors = [
            '.card-name',
            'h3',
            'h4',
            'span',
            'div[class*="name"]'
          ];
          
          for (const nameSelector of nameSelectors) {
            const nameElement = element.querySelector(nameSelector);
            if (nameElement && nameElement.textContent.trim()) {
              name = nameElement.textContent.trim();
              break;
            }
          }
          
          // If no name found, try to get it from the element itself
          if (!name && element.textContent.trim()) {
            name = element.textContent.trim().split('\n')[0].trim();
          }
          
          // Try to find the image
          const imgElement = element.querySelector('img');
          if (imgElement && imgElement.src) {
            imageUrl = imgElement.src;
          }
          
          // If this element is an img, use it directly
          if (!imageUrl && element.tagName === 'IMG' && element.src) {
            imageUrl = element.src;
          }
          
          if (name && imageUrl && imageUrl.includes('cards')) {
            // Convert name to ID format (lowercase, hyphenated)
            const id = name.toLowerCase()
              .replace(/[^a-z0-9\s]/g, '') // Remove special characters
              .replace(/\s+/g, '-') // Replace spaces with hyphens
              .replace(/\./g, '') // Remove dots
              .replace(/p\.e\.k\.k\.a/g, 'pekka') // Special case for P.E.K.K.A
              .replace(/the-log/g, 'the-log'); // Special case for The Log
            
            cardData.push({
              id,
              name,
              imageUrl,
              index
            });
          }
        } catch (error) {
          console.log(`Error processing element ${index}:`, error);
        }
      });
      
      return cardData;
    });
    
    console.log(`📊 Found ${cards.length} cards`);
    
    if (cards.length === 0) {
      console.log('❌ No cards found. Let me try a different approach...');
      
      // Try to get all images from the page
      const allImages = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).map(img => ({
          src: img.src,
          alt: img.alt,
          title: img.title
        })).filter(img => img.src.includes('cards'));
      });
      
      console.log(`Found ${allImages.length} card images`);
      console.log('Sample images:', allImages.slice(0, 5));
    }
    
    // Download images
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const card of cards) {
      try {
        const filename = `${card.id}.png`;
        const filepath = path.join(imagesDir, filename);
        
        // Check if file already exists
        if (fs.existsSync(filepath)) {
          console.log(`✅ ${filename} already exists, skipping...`);
          skipped++;
          continue;
        }
        
        console.log(`⬇️  Downloading: ${card.name} (${filename})`);
        
        await downloadImage(card.imageUrl, filename);
        downloaded++;
        
        // Add a small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`❌ Failed to download ${card.name}: ${error.message}`);
        failed++;
      }
    }
    
    console.log('\n🎉 Scraping complete!');
    console.log(`📈 Summary:`);
    console.log(`   Downloaded: ${downloaded}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total: ${cards.length}`);
    
  } catch (error) {
    console.error('❌ Error during scraping:', error);
  } finally {
    // Keep browser open for debugging
    console.log('Browser will stay open for 30 seconds for debugging...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    await browser.close();
  }
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imagesDir, filename);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete the file if there was an error
          console.log(`❌ Error downloading ${filename}: ${err.message}`);
          reject(err);
        });
      } else {
        console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
}

// Run the scraper
scrapeRoyaleAPI().catch(console.error);
