# Smash or Pass: Clash Royale Edition 🏰

A fun, interactive web app where you can rate your favorite Clash Royale characters! Presenting each character one at a time with beautiful animations and a sleek, mobile-responsive design.

## Features ✨

- **Interactive Rating System**: Rate each Clash Royale character as "Smash" or "Pass"
- **Progress Tracking**: Visual progress bar showing your journey through all characters
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Character Details**: Each character shows name, description, rarity, and elixir cost
- **Results Summary**: Complete breakdown of your Smash/Pass choices
- **Mobile Optimized**: Perfect experience on all devices
- **Image Preloading**: Smooth transitions with preloaded character images

## Tech Stack 🛠️

- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Custom Animations** - Smooth transitions and effects
- **Responsive Design** - Mobile-first approach

## Getting Started 🚀

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smashorpass
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to Play 🎮

1. **Start the Game**: The app will load all Clash Royale characters
2. **Rate Characters**: For each character, tap:
   - 💚 **SMASH** - if you like the character
   - 💔 **PASS** - if you don't
3. **Track Progress**: Watch the progress bar fill as you go through all characters
4. **View Results**: See your complete Smash/Pass list at the end
5. **Play Again**: Start over with the "Play Again" button

## Character Data 📊

The app includes **60+ Clash Royale characters** across all rarities:
- **Common** (gray) - Basic characters
- **Rare** (blue) - Uncommon characters  
- **Epic** (purple) - Powerful characters
- **Legendary** (orange) - Elite characters
- **Champion** (gold) - Ultimate characters

Each character includes:
- High-quality image
- Name and description
- Rarity badge
- Elixir cost indicator

## Project Structure 📁

```
smashorpass/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   └── characters.json    # Character data
│   ├── App.js                 # Main app component
│   ├── App.css               # Custom styles
│   ├── index.js              # App entry point
│   └── index.css             # Global styles
├── package.json
├── tailwind.config.js
└── README.md
```

## Customization 🎨

### Adding Characters
Edit `src/data/characters.json` to add or modify characters:

```json
{
  "id": "character-id",
  "name": "Character Name",
  "imageUrl": "https://example.com/image.png",
  "description": "Character description",
  "rarity": "common|rare|epic|legendary|champion",
  "elixir": 1-10
}
```

### Styling
- Modify `tailwind.config.js` for theme customization
- Edit `src/index.css` for global styles
- Update `src/App.css` for component-specific styles

## Deployment 🌐

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **Firebase Hosting**: Use Firebase CLI

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments 🙏

- **Clash Royale** - Character data and images
- **Supercell** - For creating the amazing Clash Royale game
- **TailwindCSS** - For the beautiful styling framework
- **React Team** - For the amazing React framework

---

**Enjoy rating your favorite Clash Royale characters!** 🏆 