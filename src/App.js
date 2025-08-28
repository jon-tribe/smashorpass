import React, { useState } from 'react';
import './App.css';

// Import the existing SmashOrPass component
import SmashOrPass from './components/SmashOrPass';
import GuessTheCard from './components/GuessTheCard';

function App() {
  const [currentGame, setCurrentGame] = useState('home'); // 'home', 'smash-or-pass', 'guess-the-card'

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8 drop-shadow-lg">
          Clash Royale Games
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Choose your game mode and have fun with your favorite Clash Royale characters!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Smash or Pass Game */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
               onClick={() => setCurrentGame('smash-or-pass')}>
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-3xl font-bold text-white mb-4">Smash or Pass</h2>
            <p className="text-gray-300 mb-6">
              Rate your favorite Clash Royale characters! Swipe right for smash, left for pass.
            </p>
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold">
              Start Playing
            </div>
          </div>

          {/* Guess the Card Game */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
               onClick={() => setCurrentGame('guess-the-card')}>
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-4">Guess the Card</h2>
            <p className="text-gray-300 mb-6">
              Test your knowledge! Cards are revealed piece by piece - can you guess them?
            </p>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold">
              Start Playing
            </div>
          </div>
        </div>


      </div>
    </div>
  );

  const renderBackButton = () => (
    <button 
      onClick={() => setCurrentGame('home')}
      className="fixed top-6 left-6 z-50 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
    >
      <span>←</span>
      <span>Home</span>
    </button>
  );

  // Render the appropriate component based on current game
  switch (currentGame) {
    case 'smash-or-pass':
      return (
        <div>
          {renderBackButton()}
          <SmashOrPass />
        </div>
      );
    case 'guess-the-card':
      return (
        <div>
          {renderBackButton()}
          <GuessTheCard />
        </div>
      );
    default:
      return renderHomePage();
  }
}

export default App; 