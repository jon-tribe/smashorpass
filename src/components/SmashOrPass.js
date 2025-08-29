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
  const [shuffledCharacters, setShuffledCharacters] = useState([]);
  
  // Simple card stack state
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleResponse = useCallback((response) => {
    // 5% chance to show confirmation dialog
    const shouldConfirm = Math.random() < 0.05;
    
    if (shouldConfirm) {
      setPendingResponse(response);
      setShowConfirmation(true);
      return;
    }
    
    // Inline the executeResponse logic to avoid dependency issues
    const gameCharacters = shuffledCharacters.length > 0 ? shuffledCharacters : characters;
    const currentCharacter = gameCharacters[currentIndex];
    
    // Play sound effect
    if (response === 'smash') {
      const smashAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      smashAudio.volume = 0.3;
      smashAudio.play().catch(() => {});
    } else {
      const passAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      passAudio.volume = 0.2;
      passAudio.play().catch(() => {});
    }
    
    setResponses(prev => ({
      ...prev,
      [currentCharacter.id]: response
    }));

    // Add a delay for animation
    setTimeout(() => {
      if (currentIndex < gameCharacters.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowResults(true);
        setGameState('results');
      }
    }, 300);
  }, [shuffledCharacters, currentIndex]);

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



  const executeResponse = (response) => {
    const gameCharacters = shuffledCharacters.length > 0 ? shuffledCharacters : characters;
    const currentCharacter = gameCharacters[currentIndex];
    

    
    // Play sound effect
    if (response === 'smash') {
      // Smash sound effect
      const smashAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      smashAudio.volume = 0.3;
      smashAudio.play().catch(() => {}); // Ignore errors if audio fails
    } else {
      // Pass sound effect (whoosh)
      const passAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      passAudio.volume = 0.2;
      passAudio.play().catch(() => {}); // Ignore errors if audio fails
    }
    
    setResponses(prev => ({
      ...prev,
      [currentCharacter.id]: response
    }));

    // Add a delay for animation
    setTimeout(() => {
      if (currentIndex < gameCharacters.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowResults(true);
        setGameState('results');
      }
    }, 300);
  };

  const confirmResponse = () => {
    setShowConfirmation(false);
    executeResponse(pendingResponse);
    setPendingResponse(null);
  };

  const cancelResponse = () => {
    setShowConfirmation(false);
    setPendingResponse(null);
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
    
    setDeckCards(selected);
    setSelectedDeck(type);
  };

  const closeDeck = () => {
    setSelectedDeck(null);
    setDeckCards([]);
  };

  const shuffleCharacters = () => {
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    setShuffledCharacters(shuffled);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setResponses({});
    setShowResults(false);
    setGameState('game');
    setSelectedDeck(null);
    setDeckCards([]);
    shuffleCharacters();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
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
      <div className="h-screen w-screen bg-black relative overflow-hidden">
        {/* Pornhub-style header */}
        <div className="bg-black border-b border-gray-800 px-4 py-3">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-white">
                <span className="text-white">Smash</span>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-lg ml-2 font-bold">Pass</span>
              </h1>
              <div className="text-gray-300 text-sm font-medium">
                {currentIndex + 1} of {gameCharacters.length}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exitToResults}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-200"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 h-full w-full p-4 flex">
          {/* Left Side - Passed Cards */}
          <div className="w-48 flex flex-col items-center justify-center">
            <div className="text-red-500 text-sm font-bold mb-2">PASSED ({passedCards.length})</div>
            <div className="grid grid-cols-2 gap-1 max-h-96 overflow-y-auto scrollbar-hide border-2 border-gray-700 rounded-lg p-2 bg-gray-900 min-h-96 w-full place-items-center">
              {Array.from({ length: 20 }, (_, index) => {
                const card = passedCards.slice(-20).reverse()[index];
                return (
                  <div 
                    key={index}
                    className="w-16 h-16 rounded-lg overflow-hidden border-2 border-red-500 bg-gray-800 transition-transform duration-200"
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
          <div className="flex-1 flex flex-col max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="text-center mb-6">
              <div className="bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Simple Card Display */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-2xl max-w-2xl w-full">
                <div className="text-center">
                  {/* Character Image */}
                  <div className="relative mb-6">
                    <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-lg overflow-hidden shadow-lg border-2 border-gray-600 bg-gray-800">
                      <img
                        src={currentCharacter.imageUrl}
                        alt={currentCharacter.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </div>

                  {/* Character Info */}
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
                    {currentCharacter.name}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                    {currentCharacter.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                      onClick={() => handleResponse('pass')}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-5 px-10 rounded-lg text-2xl transition-all duration-200 transform hover:scale-105 shadow-lg border-0 uppercase tracking-wide"
                      style={{
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      🤮 PASS
                    </button>
                    <button
                      onClick={() => handleResponse('smash')}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-lg text-2xl transition-all duration-200 transform hover:scale-105 shadow-lg border-0 uppercase tracking-wide"
                      style={{
                        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      🍆 SMASH
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mt-4 mb-2 flex-shrink-0">
              <p className="text-white text-sm opacity-80 font-medium">
                Click <span className="text-red-400 font-bold">PASS</span> or <span className="text-green-400 font-bold">SMASH</span> to make your choice!<br />
                <span className="text-gray-300 text-sm">Or use ← (left arrow) for PASS and → (right arrow) for SMASH</span>
              </p>
            </div>
          </div>

          {/* Right Side - Smashed Cards */}
          <div className="w-48 flex flex-col items-center justify-center">
            <div className="text-green-500 text-sm font-bold mb-2">SMASHED ({smashedCards.length})</div>
            <div className="grid grid-cols-2 gap-1 max-h-96 overflow-y-auto scrollbar-hide border-2 border-gray-700 rounded-lg p-2 bg-gray-900 min-h-96 w-full place-items-center">
              {Array.from({ length: 20 }, (_, index) => {
                const card = smashedCards[smashedCards.length - 1 - index];
                return (
                  <div 
                    key={index}
                    className="w-16 h-16 rounded-lg overflow-hidden border-2 border-green-500 bg-gray-800 transition-transform duration-200"
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
                  You're about to <span className={`font-bold ${pendingResponse === 'smash' ? 'text-green-400' : 'text-red-400'}`}>
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
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
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
                <h1 className="text-4xl font-bold text-white mb-2">
                  <span className="text-white">Smash</span>
                  <span className="bg-orange-500 text-white px-2 py-1 rounded">Pass</span>
                </h1>
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
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded transition-all duration-300"
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
          <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>
            
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
            <div className="h-screen w-screen bg-black p-4 flex items-center justify-center relative overflow-hidden">
              {/* Blurred Video Player Background */}
              <div className="absolute inset-0 grid grid-cols-6 gap-2 p-4 opacity-40">
                {characters.slice(0, 48).map((character, index) => {
                  const explicitTitles = [
                    "Hot MILF Gets Wild",
                    "Amateur Teen Fucked",
                    "Busty Babe Takes It All",
                    "Hardcore Anal Action",
                    "Threesome Gone Wild",
                    "Step Sister Surprise",
                    "Big Tits Big Fun",
                    "Creampie Compilation",
                    "Gangbang Orgy",
                    "Lesbian Lovers",
                    "Blonde Bombshell",
                    "Dirty Talk Delight",
                    "Rough Sex Session",
                    "Cumshot Collection",
                    "POV Fucking",
                    "BDSM Playtime",
                    "Swinger Party",
                    "Nude Beach Fun",
                    "Office Romance",
                    "Teacher Student",
                    "Nurse Exam",
                    "Massage Parlor",
                    "Strip Club",
                    "Hotel Hookup"
                  ];
                  const viewCounts = ["2.1M", "1.8M", "3.2M", "956K", "1.5M", "2.7M", "1.3M", "4.1M", "789K", "2.9M", "1.7M", "3.5M", "2.3M", "1.9M", "3.8M", "1.4M", "2.6M", "1.1M", "3.9M", "2.4M", "1.6M", "3.1M", "2.8M", "1.2M"];
                  const likePercentages = ["94%", "87%", "91%", "96%", "89%", "93%", "85%", "98%", "82%", "95%", "88%", "92%", "90%", "86%", "97%", "84%", "94%", "81%", "99%", "91%", "87%", "93%", "89%", "83%"];
                  
                  const title = explicitTitles[index % explicitTitles.length];
                  const views = viewCounts[index % viewCounts.length];
                  const likes = likePercentages[index % likePercentages.length];
                  
                  return (
                    <div key={`bg-${character.id}`} className="relative group">
                      <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover filter blur-md"
                        />
                        {/* Video Player Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        {/* Video Metadata */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2">
                          <div className="text-white text-xs font-semibold truncate">{title}</div>
                          <div className="text-gray-300 text-xs">{views} views • {likes}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="max-w-4xl mx-auto w-full">
                <div className="text-center mb-8 animate-fade-in">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    Your Results! 🏆
                  </h1>
                  
                  {/* Stats Section */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-4">
                      <div className="text-3xl font-black text-white">{totalRated}</div>
                      <div className="text-sm text-gray-300">Total Rated</div>
                    </div>
                    <div className="bg-gray-900 border-2 border-green-500 rounded-2xl p-4">
                      <div className="text-3xl font-black text-green-400">{smashList.length}</div>
                      <div className="text-sm text-green-300">Smash</div>
                    </div>
                    <div className="bg-gray-900 border-2 border-red-500 rounded-2xl p-4">
                      <div className="text-3xl font-black text-red-400">{passList.length}</div>
                      <div className="text-sm text-red-300">Pass</div>
                    </div>
                    <div className="bg-gray-900 border-2 border-orange-500 rounded-2xl p-4">
                      <div className="text-3xl font-black text-orange-400">{smashPercentage}%</div>
                      <div className="text-sm text-orange-300">Smash Rate</div>
                    </div>
                  </div>
                
                  <div className="space-x-4">
                    <button
                      onClick={resetGame}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Play Again
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Smash List */}
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-6 shadow-2xl animate-slide-in">
                    <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                      <span className="text-3xl mr-2">🍆</span>
                      Smash ({smashList.length})
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                      {smashList.map(character => (
                        <div key={character.id} className="flex items-center space-x-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{character.name}</h3>
                            <p className="text-sm text-gray-300">{character.description}</p>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold text-white ${getElixirColor(character.elixir)}`}>
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
                        className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        🃏 Create Smash Deck
                      </button>
                    )}
                  </div>

                  {/* Pass List */}
                  <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-6 shadow-2xl animate-slide-in">
                    <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
                      <span className="text-3xl mr-2">💔</span>
                      Pass ({passList.length})
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                      {passList.map(character => (
                        <div key={character.id} className="flex items-center space-x-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{character.name}</h3>
                            <p className="text-sm text-gray-300">{character.description}</p>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold text-white ${getElixirColor(character.elixir)}`}>
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
    </>
  );
}

export default SmashOrPass;
