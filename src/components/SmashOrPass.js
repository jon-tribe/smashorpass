import React, { useState, useEffect, useCallback } from 'react';
import characters from '../data/characters.json';

function SmashOrPass({ showAgeVerification = false }) {
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState(showAgeVerification ? 'age-verification' : 'game'); // 'age-verification', 'landing', 'game', 'results'
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingResponse, setPendingResponse] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null); // 'smash' or 'pass' or null
  const [deckCards, setDeckCards] = useState([]);
  const [deckReplacements, setDeckReplacements] = useState({});
  const [shuffledCharacters, setShuffledCharacters] = useState([]);
  
  // Simple card stack state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jynxziButtonPosition, setJynxziButtonPosition] = useState({ x: 0, y: 0 });
  const [jynxziButtonClicks, setJynxziButtonClicks] = useState(0);
  const [jynxziRequiredClicks, setJynxziRequiredClicks] = useState(0);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "suggestion",
    message: ""
  });
  
  // Card animation states
  const [cardAnimationState, setCardAnimationState] = useState('idle'); // 'idle', 'sliding-left', 'sliding-right', 'revealing'
  const [cardStack, setCardStack] = useState([]);
  

  const [slideDirection, setSlideDirection] = useState(null);
  const [slideProgress, setSlideProgress] = useState(0);
  const [cardRotation, setCardRotation] = useState(0);
  const [cardScale, setCardScale] = useState(1);

  const [particles, setParticles] = useState([]);
  // Preload images for smooth transitions and start game
  useEffect(() => {
    const loadImages = async () => {
      // Only preload images that exist locally (have /images/ path)
      const localImagePromises = characters
        .filter(character => character.imageUrl.startsWith('/images/'))
        .map(character => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ id: character.id, img });
            img.onerror = () => resolve({ id: character.id, img: null });
            img.src = character.imageUrl;
          });
        });

      await Promise.all(localImagePromises);
      setIsLoading(false);
      
      // Automatically start the game
      shuffleCharacters();
    };

    loadImages();
  }, []);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx * 0.016, // 60fps animation
        y: particle.y + particle.vy * 0.016,
        life: particle.life - 0.016,
        vy: particle.vy + 50 * 0.016, // Gravity effect
      })).filter(particle => particle.life > 0));
    };

    // Mobile-optimized animation frame rate
    const frameRate = window.innerWidth < 640 ? 32 : 16; // 30fps on mobile, 60fps on desktop
    const interval = setInterval(animateParticles, frameRate);
    return () => clearInterval(interval);
  }, [particles]);

  const handleResponse = useCallback((response) => {
    // Get current character info from card stack
    const currentCharacter = cardStack.length > 0 ? cardStack[0].character : null;
    
    // Special handling for jynxzi card smash button
    if (currentCharacter && currentCharacter.id === 'jynxzi' && response === 'smash') {
      // Set required clicks on first attempt if not already set
      if (jynxziButtonClicks === 0) {
        const requiredClicks = Math.floor(Math.random() * 11) + 5; // Random between 5-15
        setJynxziRequiredClicks(requiredClicks);
        // Move button on first click and return - Mobile responsive sizing
        const isMobile = window.innerWidth < 640;
        const buttonWidth = isMobile ? 160 : 200;
        const buttonHeight = isMobile ? 48 : 60;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Ensure we have valid viewport dimensions
        if (viewportWidth <= 0 || viewportHeight <= 0) {
          console.error('Invalid viewport dimensions:', { viewportWidth, viewportHeight });
          setJynxziButtonPosition({ x: 100, y: 100 }); // Safe fallback
          setJynxziButtonClicks(1);
          return;
        }
        
        // Calculate safe bounds ensuring button is always visible
        // Use smaller padding to avoid negative bounds
        const padding = Math.min(50, Math.min(viewportWidth, viewportHeight) / 8);
        const minX = padding;
        const minY = padding;
        const maxX = viewportWidth - buttonWidth - padding;
        const maxY = viewportHeight - buttonHeight - padding;
        
        // Validate bounds and ensure they're reasonable
        if (maxX <= minX || maxY <= minY || maxX < 0 || maxY < 0) {
          console.error('Invalid bounds calculated:', { maxX, maxY, minX, minY, viewportWidth, viewportHeight, padding });
          // Use safe center position
          const safeX = Math.max(0, Math.min(viewportWidth - buttonWidth, viewportWidth / 2 - buttonWidth / 2));
          const safeY = Math.max(0, Math.min(viewportHeight - buttonHeight, viewportHeight / 2 - buttonHeight / 2));
          setJynxziButtonPosition({ x: safeX, y: safeY });
          setJynxziButtonClicks(1);
          return;
        }
        
        // Generate random position within safe bounds
        const newX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const newY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        
        // Final safety check - ensure position is within bounds
        const finalX = Math.max(minX, Math.min(maxX, newX));
        const finalY = Math.max(minY, Math.min(maxY, newY));
        
        
        setJynxziButtonPosition({ x: finalX, y: finalY });
        setJynxziButtonClicks(1);
        return; // Don't process the response yet
      }
      
      const newClickCount = jynxziButtonClicks + 1;
      setJynxziButtonClicks(newClickCount);
      
      if (newClickCount < jynxziRequiredClicks) {
        // Move button to random position within viewport bounds - Mobile responsive sizing
        const isMobile = window.innerWidth < 640;
        const buttonWidth = isMobile ? 160 : 200;
        const buttonHeight = isMobile ? 48 : 60;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Ensure we have valid viewport dimensions
        if (viewportWidth <= 0 || viewportHeight <= 0) {
          console.error('Invalid viewport dimensions on subsequent click:', { viewportWidth, viewportHeight });
          setJynxziButtonPosition({ x: 100, y: 100 }); // Safe fallback
          return;
        }
        
        // Calculate safe bounds ensuring button is always visible
        // Use smaller padding to avoid negative bounds
        const padding = Math.min(50, Math.min(viewportWidth, viewportHeight) / 8);
        const minX = padding;
        const minY = padding;
        const maxX = viewportWidth - buttonWidth - padding;
        const maxY = viewportHeight - buttonHeight - padding;
        
        // Validate bounds and ensure they're reasonable
        if (maxX <= minX || maxY <= minY || maxX < 0 || maxY < 0) {
          console.error('Invalid bounds calculated on subsequent click:', { maxX, maxY, minX, minY, viewportWidth, viewportHeight, padding });
          // Use safe center position
          const safeX = Math.max(0, Math.min(viewportWidth - buttonWidth, viewportWidth / 2 - buttonWidth / 2));
          const safeY = Math.max(0, Math.min(viewportHeight - buttonHeight, viewportHeight / 2 - buttonHeight / 2));
          setJynxziButtonPosition({ x: safeX, y: safeY });
          return;
        }
        
        // Generate random position within safe bounds
        const newX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const newY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        
        // Final safety check - ensure position is within bounds
        const finalX = Math.max(minX, Math.min(maxX, newX));
        const finalY = Math.max(minY, Math.min(maxY, newY));
        
        
        setJynxziButtonPosition({ x: finalX, y: finalY });
        return; // Don't process the response yet
      } else {
        // Show confirmation dialog for final jynxzi smash
        setPendingResponse('smash');
        setShowConfirmation(true);
        return; // Don't process the response yet
      }
    }
    
    // Start card animation
    setSlideDirection(response);
    setCardAnimationState(response === 'smash' ? 'sliding-right' : 'sliding-left');
    
    // Animate card sliding
    const animateSlide = () => {
      const duration = 600; // 600ms for smooth animation
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setSlideProgress(easeOut);
        setCardRotation(response === 'smash' ? easeOut * 15 : easeOut * -15);
        setCardScale(1 - easeOut * 0.1);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete, process the response
          processResponse(response, currentCharacter);
        }
      };
      
      requestAnimationFrame(animate);
    };
    
    animateSlide();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffledCharacters, currentIndex, jynxziButtonClicks, cardStack, jynxziRequiredClicks]);

  const createParticles = (response) => {
    // Disable particles on very low-end mobile devices for better performance
    if (window.innerWidth < 480) {
      return;
    }
    
    // Mobile-optimized particle count
    const particleCount = window.innerWidth < 640 ? 4 : 8;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 320 - 160, // Random position around card center
        y: Math.random() * 384 - 192,
        vx: (Math.random() - 0.5) * 200, // Random velocity
        vy: (Math.random() - 0.5) * 200,
        color: response === 'smash' ? '#10b981' : '#ef4444', // Green for smash, red for pass
        size: Math.random() * 4 + 2,
        life: 1.0
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const processResponse = (response, currentCharacter) => {
    // Create particle effects
    createParticles(response);
    
    // Play sound effect
    if (response === 'smash') {
      const smashAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      smashAudio.volume = 0.3;
      smashAudio.play().catch(() => {});
    } else {
      const passAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSunEiBC13yO/eizEIHWq+8+OWT');
      passAudio.volume = 0.2;
      passAudio.play().catch(() => {});
    }
    
    setResponses(prev => ({
      ...prev,
      [currentCharacter.id]: response
    }));

    // Prepare next card
    const gameCharacters = shuffledCharacters.length > 0 ? shuffledCharacters : characters;
    if (currentIndex < gameCharacters.length - 1) {
      // Update card stack
      const newStack = cardStack.slice(1); // Remove top card
      if (currentIndex + 5 < gameCharacters.length) {
        // Add new card to bottom of stack
        const newCard = gameCharacters[currentIndex + 5];
        newStack.push({
          character: newCard,
          zIndex: 95,
          scale: 0.8,
          translateY: 8,
          opacity: 0.5
        });
      }
      
      // Animate stack update
      setTimeout(() => {
        setCardStack(newStack.map((card, index) => ({
          ...card,
          zIndex: 100 - index,
          scale: 1 - (index * 0.05),
          translateY: index * 2,
          opacity: 1 - (index * 0.1)
        })));
        setCurrentIndex(prev => prev + 1);
        setCardAnimationState('idle');
        setSlideProgress(0);
        setCardRotation(0);
        setCardScale(1);
        setSlideDirection(null);
      }, 200);
    } else {
      setShowResults(true);
      setGameState('results');
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameState === 'game' && shuffledCharacters.length > 0 && currentIndex < shuffledCharacters.length) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            handleResponse('pass');
            break;
          case 'ArrowRight':
            event.preventDefault();
            handleResponse('smash');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, shuffledCharacters, currentIndex, handleResponse]);





  const confirmResponse = () => {
    setShowConfirmation(false);
    
    // Reset jynxzi state if this was a jynxzi confirmation
    const currentCharacter = cardStack.length > 0 ? cardStack[0].character : null;
    if (currentCharacter && currentCharacter.id === 'jynxzi') {
      setJynxziButtonClicks(0);
      setJynxziRequiredClicks(0);
      setJynxziButtonPosition({ x: 0, y: 0 });
    }
    
    // Start card animation like normal response
    const response = pendingResponse;
    setSlideDirection(response);
    setCardAnimationState(response === 'smash' ? 'sliding-right' : 'sliding-left');
    
    // Animate card sliding
    const animateSlide = () => {
      const duration = 600; // 600ms for smooth animation
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setSlideProgress(easeOut);
        setCardRotation(response === 'smash' ? easeOut * 15 : easeOut * -15);
        setCardScale(1 - easeOut * 0.1);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete, process the response
          processResponse(response, currentCharacter);
        }
      };
      
      requestAnimationFrame(animate);
    };
    
    animateSlide();
    setPendingResponse(null);
  };

  const cancelResponse = () => {
    setShowConfirmation(false);
    
    // Reset jynxzi state if this was a jynxzi confirmation
    const currentCharacter = cardStack.length > 0 ? cardStack[0].character : null;
    if (currentCharacter && currentCharacter.id === 'jynxzi') {
      setJynxziButtonClicks(0);
      setJynxziRequiredClicks(0);
      setJynxziButtonPosition({ x: 0, y: 0 });
    }
    
    setPendingResponse(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Create mailto link with form data
    const subject = encodeURIComponent(`${formData.type === "suggestion" ? "Card Suggestion" : "Collaboration Inquiry"} - Smash or Pass Game`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Type: ${formData.type}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\nSent from Smash or Pass Game`
    );
    
    window.open(`mailto:social@tribegaming.gg?subject=${subject}&body=${body}`, "_blank");
    
    // Reset form and close modal
    setFormData({ name: "", email: "", type: "suggestion", message: "" });
    setShowSuggestionsModal(false);
  };
  const exitToResults = () => {
    setShowResults(true);
    setGameState('results');
  };

  const createDeck = (type) => {
    const availableCards = type === 'smash' 
      ? characters.filter(char => responses[char.id] === 'smash')
      : characters.filter(char => responses[char.id] === 'pass');
    
    if (availableCards.length === 0) {
      alert(`No ${type} cards available!`);
      return;
    }
    
    // Randomly select 8 cards (or all if less than 8)
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(8, availableCards.length));
    
    // Generate replacement suggestions for creator cards
    const replacements = {};
    selected.forEach(character => {
      if (character.id === 'jynxzi' || character.id === 'juicyj' || character.id === 'thebigyazz' || 
          character.id === 'ken' || character.id === 'oj' || character.id === 'xqc' || 
          character.id === 'reckers' || character.id === 'bobby' || character.id === 'jynxzi') {
        
        // Get all available cards that aren't already in the deck
        const availableReplacements = characters.filter(char => 
          char.id !== character.id && 
          !selected.some(deckChar => deckChar.id === char.id) &&
          char.id !== 'jynxzi' && char.id !== 'juicyj' && char.id !== 'thebigyazz' && 
          char.id !== 'ken' && char.id !== 'oj' && char.id !== 'xqc' && 
          char.id !== 'reckers' && char.id !== 'bobby'
        );
        
        if (availableReplacements.length > 0) {
          // Randomly select a replacement
          const randomReplacement = availableReplacements[Math.floor(Math.random() * availableReplacements.length)];
          replacements[character.id] = randomReplacement;
        }
      }
    });
    
    setDeckCards(selected);
    setSelectedDeck(type);
    setDeckReplacements(replacements);
  };

  const closeDeck = () => {
    setSelectedDeck(null);
    setDeckCards([]);
    setDeckReplacements({});
  };

  const shuffleCharacters = () => {
    // Find jynxzi card
    const jynxziCard = characters.find(char => char.id === 'jynxzi');
    const otherCards = characters.filter(char => char.id !== 'jynxzi');
    
    // Shuffle other cards
    const shuffledOthers = otherCards.sort(() => Math.random() - 0.5);
    
    // Insert jynxzi in first 25 positions (random position between 0-24)
    const jynxziPosition = Math.floor(Math.random() * 25);
    const shuffled = [
      ...shuffledOthers.slice(0, jynxziPosition),
      jynxziCard,
      ...shuffledOthers.slice(jynxziPosition)
    ];
    
    // Reset jynxzi button state and set default position
    setJynxziButtonClicks(0);
    setJynxziRequiredClicks(0);
    setJynxziButtonPosition({ x: 100, y: 100 }); // Default safe position
    
    setShuffledCharacters(shuffled);
    
    // Initialize card stack with first 5 cards
    const initialStack = shuffled.slice(0, 5).map((char, index) => ({
      character: char,
      zIndex: 100 - index,
      scale: 1 - (index * 0.05),
      translateY: index * 2,
      opacity: 1 - (index * 0.1)
    }));
    setCardStack(initialStack);
    setCardAnimationState('revealing');
    setSlideProgress(0);
    setCardRotation(0);
    setCardScale(1);
    
    // Trigger card reveal animation
    setTimeout(() => {
      setCardAnimationState('idle');
    }, 500);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setResponses({});
    setShowResults(false);
    setGameState('game');
    setSelectedDeck(null);
    setDeckCards([]);
    setDeckReplacements({});
    shuffleCharacters();
  };

  const resumeGame = () => {
    setShowResults(false);
    setGameState('game');
    // Don't reset responses or currentIndex - just continue where they left off
  };

  const verifyAge = () => {
    setGameState('game');
    shuffleCharacters();
  };

  const declineAge = () => {
    // Rick Roll the user
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-orange-400';
      case 'champion': return 'text-yellow-400';
      case 'creator': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getElixirColor = (elixir) => {
    if (elixir <= 2) return 'bg-green-500';
    if (elixir <= 4) return 'bg-yellow-500';
    if (elixir <= 6) return 'bg-orange-500';
    return 'bg-red-500';
  };



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: `
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
        `
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold">Loading Clash Royale Characters...</h2>
        </div>
      </div>
    );
  }

  // Prepare main game view
  let mainGameView = null;
  if (gameState === 'game') {
    const gameCharacters = shuffledCharacters.length > 0 ? shuffledCharacters : characters;
    const currentCharacter = gameCharacters[currentIndex];
    const progress = ((currentIndex + 1) / gameCharacters.length) * 100;
    
    // Get swiped cards for visual history
    const swipedCards = Object.entries(responses).map(([id, response]) => {
      const character = characters.find(c => c.id === id);
      return { character, response };
    });
    
    const smashedCards = swipedCards.filter(card => card.response === 'smash');
    const passedCards = swipedCards.filter(card => card.response === 'pass');
    
    mainGameView = (
      <div className="h-screen w-screen bg-black relative overflow-hidden" style={{
        background: `
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.08) 0%, transparent 50%)
        `,
        backgroundSize: '100% 100%, 60% 60%, 60% 60%',
        backgroundPosition: 'center center, 20% 80%, 80% 20%',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Header - Mobile Responsive */}
        <div className="bg-black border-b border-gray-800 px-4 py-3">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center space-x-2 sm:space-x-6">
              <img 
                src="/images/SmashPass.png" 
                alt="Smash Pass" 
                className="h-8 sm:h-10"
              />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={exitToResults}
                className="bg-logo-orange hover:bg-orange-600 text-white px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200"
              >
                Results
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 h-full w-full p-3 sm:p-4 flex flex-col lg:flex-row lg:justify-between overflow-hidden lg:max-w-6xl lg:mx-auto">
          {/* Mobile: Simple text counters */}
          <div className="lg:hidden flex justify-between items-center mb-3 px-4 text-xs text-gray-300">
            <span>❌ Passed: {passedCards.length}</span>
            <span>⚡ Smashed: {smashedCards.length}</span>
          </div>

          {/* Desktop: Left Side - Passed Cards */}
          <div className="hidden lg:flex w-32 flex-col items-center justify-start pt-16">
            <div className="text-red-500 text-sm font-bold mb-2">PASSED ({passedCards.length})</div>
            <div className="grid grid-cols-2 gap-1 max-h-96 overflow-y-auto scrollbar-hide border-2 border-gray-700 rounded-lg p-2 bg-gray-900 min-h-96 w-full place-items-center">
              {Array.from({ length: 20 }, (_, index) => {
                const card = passedCards.slice(-20).reverse()[index];
                return (
                  <div 
                    key={index}
                    className="w-12 h-12 rounded-lg overflow-hidden border-2 border-red-500 bg-gray-800 transition-transform duration-200"
                    style={{ zIndex: 100 - index }}
                  >
                    {card ? (
                      <img
                        src={card.character.imageUrl}
                        alt={card.character.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-600 rounded-full opacity-50"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center - Main Game Area */}
          <div className="flex-1 flex flex-col max-w-4xl px-2 lg:px-8 min-h-0">
            {/* Progress Bar */}
            <div className="text-center mb-2">
              <div className="bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-logo-orange to-orange-600 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Card Counter - Moved to logical location below progress bar */}
            <div className="text-center mb-4">
              <div className="text-gray-300 text-sm font-medium">
                Card {currentIndex + 1} of {gameCharacters.length}
              </div>
            </div>

            {/* Animated Card Stack Display */}
            <div className="flex-1 flex items-start justify-center min-h-0 relative pt-3 pb-24">
              {/* Card Stack Container - Mobile Responsive */}
              <div className="relative w-72 h-96 sm:w-80 sm:h-[30rem]">
                {/* Action Buttons - Mobile Responsive */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-3 sm:gap-4 w-72 sm:w-80 z-50" style={{ bottom: '-72px' }}>
                  <button
                    onClick={() => handleResponse('pass')}
                    disabled={cardAnimationState !== 'idle'}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg transition-all duration-200 transform active:scale-95 hover:scale-105 shadow-lg border-0 uppercase tracking-wide disabled:transform-none whitespace-nowrap touch-manipulation"
                    style={{
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      minHeight: '48px' // Ensures touch-friendly size
                    }}
                  >
                    🤮 PASS
                  </button>
                  
                  {/* Normal Smash Button - only show when NOT Jynxzi or before first click */}
                  {!(cardStack.length > 0 && cardStack[0].character.id === 'jynxzi' && jynxziButtonClicks > 0 && jynxziButtonClicks < jynxziRequiredClicks) && (
                    <button
                      onClick={() => handleResponse('smash')}
                      disabled={cardAnimationState !== 'idle'}
                      className="flex-1 bg-gradient-to-r from-logo-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg transition-all duration-200 transform active:scale-95 hover:scale-105 shadow-lg border-0 uppercase tracking-wide disabled:transform-none whitespace-nowrap touch-manipulation"
                      style={{
                        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        minHeight: '48px' // Ensures touch-friendly size
                      }}
                    >
                      🍆 SMASH
                    </button>
                  )}
                  
                  {/* Empty placeholder to maintain flex layout when Jynxzi is active */}
                  {cardStack.length > 0 && cardStack[0].character.id === 'jynxzi' && jynxziButtonClicks > 0 && jynxziButtonClicks < jynxziRequiredClicks && (
                    <div className="flex-1"></div>
                  )}
                </div>
                
                {/* Moving Jynxzi Smash Button - rendered separately outside flex container */}
                {cardStack.length > 0 && cardStack[0].character.id === 'jynxzi' && jynxziButtonClicks > 0 && jynxziButtonClicks < jynxziRequiredClicks && (() => {
                  // Mobile-responsive button sizing
                  const isMobile = window.innerWidth < 640;
                  const buttonWidth = isMobile ? 160 : 200;
                  const buttonHeight = isMobile ? 48 : 60;
                  
                  const buttonX = Math.max(0, Math.min(window.innerWidth - buttonWidth, jynxziButtonPosition.x || 100));
                  const buttonY = Math.max(0, Math.min(window.innerHeight - buttonHeight, jynxziButtonPosition.y || 100));
                  
                  return (
                    <button
                      onClick={() => handleResponse('smash')}
                      disabled={cardAnimationState !== 'idle'}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg transition-all duration-200 transform active:scale-95 hover:scale-105 shadow-lg border-0 uppercase tracking-wide disabled:transform-none whitespace-nowrap touch-manipulation"
                      style={{
                        position: 'fixed',
                        left: `${buttonX}px`,
                        top: `${buttonY}px`,
                        zIndex: 9999,
                        width: `${buttonWidth}px`,
                        height: `${buttonHeight}px`,
                        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        backgroundColor: '#f97316', // Fallback color
                        display: 'block', // Ensure it's displayed
                        minHeight: '48px' // Ensures touch-friendly size
                      }}
                    >
                      🍆 SMASH
                    </button>
                  );
                })()}

                {/* Swipe Direction Indicators */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Pass indicator (left) */}
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 text-6xl transition-all duration-300 ${
                    slideDirection === 'pass' ? 'opacity-60 scale-110' : 'opacity-20'
                  }`}>
                    ←
                  </div>
                  {/* Smash indicator (right) */}
                  <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 text-6xl transition-all duration-300 ${
                    slideDirection === 'smash' ? 'opacity-60 scale-110' : 'opacity-20'
                  }`}>
                    →
                  </div>
                </div>
                {/* Background cards in stack */}
                {cardStack.slice(1).map((card, index) => (
                  <div
                    key={`stack-${card.character.id}-${index}`}
                    className="absolute inset-0 transition-all duration-500 ease-out card-stack-depth"
                    style={{
                      zIndex: card.zIndex,
                      transform: `scale(${card.scale}) translateY(${card.translateY}px)`,
                      opacity: card.opacity,
                    }}
                  >
                    <div className="w-full h-full bg-gray-800 rounded-2xl border-2 border-gray-600 shadow-xl">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full opacity-30"></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Main card with animation */}
                {cardStack.length > 0 && (
                  <div
                    className={`absolute inset-0 transition-all duration-200 ease-out card-hover ${
                      cardAnimationState === 'idle' ? 'card-reveal' : ''
                    }`}
                    style={{
                      zIndex: cardStack[0].zIndex,
                      transform: `
                        translateX(${slideDirection === 'smash' ? slideProgress * (window.innerWidth < 640 ? 250 : 300) : slideDirection === 'pass' ? -slideProgress * (window.innerWidth < 640 ? 250 : 300) : 0}px)
                        translateY(${slideProgress * (window.innerWidth < 640 ? 20 : 30)}px)
                        rotate(${cardRotation}deg)
                        scale(${cardScale})
                      `,
                      opacity: 1 - slideProgress * 0.5,
                    }}
                  >
                    <div className="w-full h-full bg-gray-900 rounded-2xl border-2 border-gray-600 shadow-2xl overflow-hidden card-stack-depth">
                      <div className="relative w-full h-full flex flex-col">
                        {/* Character Name */}
                        <div className="p-3 text-center">
                          <h2 className="text-xl font-black text-white drop-shadow-lg">
                            {cardStack[0].character.name}
                          </h2>
                        </div>
                        
                        {/* Character Image - Increased size to fill extra space */}
                        <div className="w-full h-60 sm:h-64 flex items-center justify-center p-3">
                          <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-xl overflow-hidden shadow-lg">
                            <img
                              src={cardStack[0].character.imageUrl}
                              alt={cardStack[0].character.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        
                        {/* Identifiers - Rarity and Elixir */}
                        <div className="p-3 text-center">
                          <div className="flex justify-center items-center space-x-3">
                            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-black text-white bg-black bg-opacity-80 backdrop-blur-sm border ${getRarityColor(cardStack[0].character.rarity)}`}>
                              {cardStack[0].character.rarity.toUpperCase()}
                            </div>
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg ${getElixirColor(cardStack[0].character.elixir)}`}>
                              {cardStack[0].character.elixir}
                            </div>
                          </div>
                        </div>
                        
                        {/* Description - Pushed to very bottom of card */}
                        <div className="mt-auto p-3 text-center bg-gray-800 bg-opacity-50 rounded-b-2xl">
                          <p className="text-gray-200 text-xs sm:text-sm leading-tight">
                            {cardStack[0].character.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Particle Effects */}
                {particles.map(particle => (
                  <div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full particle"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(${particle.x}px, ${particle.y}px)`,
                      backgroundColor: particle.color,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      opacity: particle.life,
                    }}
                  />
                )                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mt-4 flex-shrink-0">
              <p className="text-white text-xs opacity-50 font-medium px-4">
                <span className="sm:inline">Tap <span className="text-red-400 font-bold">PASS</span> or <span className="text-orange-400 font-bold">SMASH</span></span>
                <span className="hidden sm:inline text-gray-300 text-xs"> • Use ← → arrows</span>
              </p>
            </div>
          </div>

          {/* Desktop: Right Side - Smashed Cards */}
          <div className="hidden lg:flex w-32 flex-col items-center justify-start pt-16">
            <div className="text-orange-500 text-sm font-bold mb-2">SMASHED ({smashedCards.length})</div>
            <div className="grid grid-cols-2 gap-1 max-h-96 overflow-y-auto scrollbar-hide border-2 border-gray-700 rounded-lg p-2 bg-gray-900 min-h-96 w-full place-items-center">
              {Array.from({ length: 20 }, (_, index) => {
                const card = smashedCards[smashedCards.length - 1 - index];
                return (
                  <div 
                    key={index}
                    className="w-12 h-12 rounded-lg overflow-hidden border-2 border-orange-500 bg-gray-800 transition-transform duration-200"
                    style={{ zIndex: 100 - index }}
                  >
                    {card ? (
                      <img
                        src={card.character.imageUrl}
                        alt={card.character.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-600 rounded-full opacity-50"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-black border-2 border-gray-700 rounded-3xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-6">🤔</div>
                <h3 className="text-2xl font-black text-white mb-4">
                  Are you sure?
                </h3>
                                  <p className="text-gray-300 text-lg mb-8">
                    You're about to <span className={`font-bold ${pendingResponse === 'smash' ? 'text-orange-400' : 'text-red-400'}`}>
                      {pendingResponse === 'smash' ? 'SMASH' : 'PASS'}
                    </span> on <span className="text-yellow-400 font-bold">{currentCharacter.name}</span>!
                  </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={cancelResponse}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmResponse}
                    className={`font-bold py-3 px-6 rounded-xl transition-all duration-200 ${
                      pendingResponse === 'smash' 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    Yes, {pendingResponse === 'smash' ? 'SMASH' : 'PASS'}!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Footer - Better Separated */}
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-2">
            <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-white text-xs opacity-70">
              <span>by: <a href="https://x.com/tribegaming" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:text-orange-300 underline">@trb</a></span>
              <span>•</span>
              <span><a href="https://www.stjude.org/give.html" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">support</a></span>
              <span>•</span>
              <button onClick={() => setShowSuggestionsModal(true)} className="text-orange-400 hover:text-orange-300 underline bg-transparent border-none cursor-pointer">contact</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Age Verification Modal */}
      {gameState === 'age-verification' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-black border-2 border-gray-700 rounded-lg shadow-2xl max-w-md mx-4 p-8">
            <div className="text-center">
              {/* Logo */}
              <div className="mb-8">
                <img 
                  src="/images/SmashPass.png" 
                  alt="Smash Pass" 
                  className="h-16 mx-auto"
                />
              </div>
              
              {/* Age Verification Content */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Age Verification
                </h2>
                <div className="text-white text-base mb-8 space-y-2">
                  <p>Smash or Pass does actually not contain any adult content, this is just a joke.</p>
                  <p>And you don't have to be above 18 to play it.</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button
                  onClick={verifyAge}
                  className="flex-1 bg-logo-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded transition-all duration-300"
                >
                  I am 18 or older - Enter
                </button>
                <button
                  onClick={declineAge}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-all duration-300"
                >
                  I am under 18 - Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content (visible behind modal when age-verification is active) */}
      <div className={`${gameState === 'age-verification' ? 'blur-sm' : ''}`}>
        {/* Landing Page */}
        {gameState === 'landing' && (
          <div className="h-screen w-screen relative overflow-hidden" style={{
            background: `
              linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
            `
          }}>

            
            <div className="relative z-10 h-full w-full p-4 flex items-center justify-center">
              <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-16 animate-fade-in">
                  <div className="mb-8">
                    <div className="text-8xl mb-4 animate-bounce">⚡</div>
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4">
                      SMASH OR PASS
                    </h1>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg">
                      CLASH ROYALE EDITION
                    </h2>
                  </div>
                  <p className="text-white text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                    Rate your favorite Clash Royale characters with style! 
                    <span className="block text-yellow-300 font-bold">Tap SMASH if you like them, PASS if you don't!</span>
                  </p>
                </div>

                <div className="grid md:grid-cols-1 gap-8 max-w-5xl mx-auto">
                  {/* Start Game Button */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <div className="relative bg-black rounded-3xl p-8 border border-gray-800">
                      <div className="text-center">
                        <div className="text-7xl mb-6 animate-pulse">🎮</div>
                        <h3 className="text-3xl font-black text-white mb-4">START GAME</h3>
                        <p className="text-gray-300 mb-8 text-lg">
                          Begin your epic Clash Royale character rating adventure!
                        </p>
                        <button
                          onClick={() => {
                            shuffleCharacters();
                            setGameState('game');
                          }}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-black py-6 px-12 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-lg"
                        >
                          🚀 START PLAYING
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {showResults && (() => {
          const smashList = characters.filter(char => responses[char.id] === 'smash');
          const passList = characters.filter(char => responses[char.id] === 'pass');
          const totalRated = smashList.length + passList.length;
          const smashPercentage = totalRated > 0 ? Math.round((smashList.length / totalRated) * 100) : 0;

          return (
            <div className="min-h-screen w-full p-3 sm:p-4 flex items-start sm:items-center justify-center overflow-y-auto" style={{
              background: `
                linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
              `
            }}>
              <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                <div className="text-center mb-6 sm:mb-8 animate-fade-in">
                  <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4">
                    Your Results! 🏆
                  </h1>
                  
                  {/* Progress Info - Show if game is incomplete */}
                  {totalRated < characters.length ? (
                    <div className="text-center mb-4">
                      <p className="text-blue-300 text-sm sm:text-base">
                        You've rated {totalRated} out of {characters.length} characters
                      </p>
                      <div className="w-full max-w-xs mx-auto mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${(totalRated / characters.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <p className="text-green-300 text-sm sm:text-base font-semibold">
                        🎉 Congratulations! You've rated all {characters.length} characters!
                      </p>
                    </div>
                  )}
                  
                  {/* Stats Section */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-gray-900 border-2 border-gray-700 rounded-xl sm:rounded-2xl p-2 sm:p-4">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">{totalRated}</div>
                      <div className="text-xs sm:text-sm text-gray-300">Total Rated</div>
                    </div>
                    <div className="bg-gray-900 border-2 border-orange-500 rounded-xl sm:rounded-2xl p-2 sm:p-4">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-orange-400">{smashList.length}</div>
                      <div className="text-xs sm:text-sm text-orange-300">Smash</div>
                    </div>
                    <div className="bg-gray-900 border-2 border-red-500 rounded-xl sm:rounded-2xl p-2 sm:p-4">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-red-400">{passList.length}</div>
                      <div className="text-xs sm:text-sm text-red-300">Pass</div>
                    </div>
                    <div className="bg-gray-900 border-2 border-orange-500 rounded-xl sm:rounded-2xl p-2 sm:p-4">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-orange-400">{smashPercentage}%</div>
                      <div className="text-xs sm:text-sm text-orange-300">Smash Rate</div>
                    </div>
                  </div>
                
                  <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                    {/* Resume Button - Only show if there are cards left to rate */}
                    {totalRated < characters.length && (
                      <button
                        onClick={resumeGame}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        🔄 Resume Game ({totalRated}/{characters.length})
                      </button>
                    )}
                    
                    {/* Play Again Button - Different text based on completion */}
                    <button
                      onClick={resetGame}
                      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {totalRated < characters.length ? '🎮 Play Again' : '🔄 Start New Game'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Smash List */}
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl animate-slide-in">
                    <h2 className="text-xl sm:text-2xl font-bold text-orange-400 mb-3 sm:mb-4 flex items-center">
                      <span className="text-2xl sm:text-3xl mr-2">🍆</span>
                      Smash ({smashList.length})
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                      {smashList.map(character => (
                        <div key={character.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-800 border border-gray-600 rounded-lg">
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{character.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">{character.description}</p>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0 ${getElixirColor(character.elixir)}`}>
                            {character.elixir}
                          </div>
                        </div>
                      ))}
                      {smashList.length === 0 && (
                        <p className="text-gray-400 text-center py-8">No characters smashed 😢</p>
                      )}
                    </div>
                    {smashList.length > 0 && (
                      <button
                        onClick={() => createDeck('smash')}
                        className="w-full mt-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        🃏 Create Smash Deck
                      </button>
                    )}
                  </div>

                  {/* Pass List */}
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl animate-slide-in">
                    <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-3 sm:mb-4 flex items-center">
                      <span className="text-2xl sm:text-3xl mr-2">💔</span>
                      Pass ({passList.length})
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                      {passList.map(character => (
                        <div key={character.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-800 border border-gray-600 rounded-lg">
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{character.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">{character.description}</p>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0 ${getElixirColor(character.elixir)}`}>
                            {character.elixir}
                          </div>
                        </div>
                      ))}
                      {passList.length === 0 && (
                        <p className="text-gray-400 text-center py-8">No characters passed 😍</p>
                      )}
                    </div>
                    {passList.length > 0 && (
                      <button
                        onClick={() => createDeck('pass')}
                        className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        🃏 Create Pass Deck
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Main Game View */}
        {mainGameView}
      </div>

      {/* Deck Display Modal */}
      {selectedDeck && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-black border-2 border-gray-700 rounded-3xl p-8 max-w-6xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-white mb-2">
                {selectedDeck === 'smash' ? '💚 Smash Deck' : '💔 Pass Deck'}
              </h2>
              <p className="text-gray-300 text-lg">
                {deckCards.length} randomly selected cards
              </p>
              <button
                onClick={closeDeck}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {deckCards.map((character, index) => (
                <div key={character.id} className="group relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`absolute -inset-1 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse ${
                    selectedDeck === 'smash' 
                      ? 'bg-gradient-to-r from-green-600 to-blue-600' 
                      : 'bg-gradient-to-r from-red-600 to-pink-600'
                  }`}></div>
                  <div className="relative bg-black rounded-2xl p-4 border border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="text-center">
                      <div className="relative mb-3">
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-gray-700 bg-gray-800">
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-300 text-xs font-semibold"
                            style={{ display: 'none' }}
                          >
                            {character.name}
                          </div>
                        </div>
                        
                        {/* Rarity Badge */}
                        <div className={`absolute top-1 right-1 px-2 py-1 rounded-full text-xs font-black text-white bg-black bg-opacity-80 backdrop-blur-sm border ${getRarityColor(character.rarity)}`}>
                          {character.rarity.toUpperCase()}
                        </div>
                        
                        {/* Elixir Cost */}
                        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg ${getElixirColor(character.elixir)}`}>
                          {character.elixir}
                        </div>
                      </div>
                      
                      <h3 className="font-black text-white text-sm mb-1">{character.name}</h3>
                      <p className="text-gray-300 text-xs mb-2 leading-tight">{character.description}</p>
                      
                      {/* Replacement Suggestion for Creator Cards */}
                      {deckReplacements[character.id] && (
                        <div className="mb-2 p-2 bg-gray-800 rounded-lg border border-orange-500">
                          <div className="text-xs text-orange-400 font-semibold mb-1">💡 Suggested Replacement:</div>
                          <div className="text-xs text-gray-300">
                            {deckReplacements[character.id].name} • {deckReplacements[character.id].rarity} • {deckReplacements[character.id].elixir} elixir
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400 font-medium">
                        {character.rarity} • {character.elixir} elixir
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggestions/Collaboration Modal */}
      {showSuggestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-black border-2 border-gray-700 rounded-lg shadow-2xl max-w-md mx-4 p-8 w-full">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">💡 Suggestions & Collaboration</h2>
              <p className="text-gray-300 mb-6">
                Got ideas for new cards? Want to collaborate? Let's connect!
              </p>
              
              <form onSubmit={handleFormSubmit} className="text-left space-y-4">
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="suggestion">Card Suggestion</option>
                    <option value="collaboration">Collaboration/Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows="4"
                    required
                    placeholder="Share your ideas, collaboration proposals, or feedback..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSuggestionsModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded transition-all duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </form>
              
              <div className="mt-6 pt-4 border-t border-gray-600">
                <p className="text-gray-400 text-xs">
                  This will open your email client with a pre-filled message.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SmashOrPass;
