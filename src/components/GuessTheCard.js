import React, { useState, useEffect } from 'react';
import characters from '../data/characters.json';

function GuessTheCard() {
  const [currentCard, setCurrentCard] = useState(null);
  const [revealLevel, setRevealLevel] = useState(0); // 0-4: 0=hidden, 4=fully revealed
  const [gameState, setGameState] = useState('landing'); // 'landing', 'game', 'results'
  const [score, setScore] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [shuffledCharacters, setShuffledCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize game
  useEffect(() => {
    if (gameState === 'game' && shuffledCharacters.length > 0) {
      setCurrentCard(shuffledCharacters[currentIndex]);
      setRevealLevel(0);
      setShowAnswer(false);
      setUserGuess('');
      setFilteredSuggestions([]);
    }
  }, [gameState, currentIndex, shuffledCharacters]);

  // Filter suggestions based on user input
  useEffect(() => {
    if (userGuess.length > 0) {
      const filtered = characters
        .filter(char => 
          char.name.toLowerCase().includes(userGuess.toLowerCase()) ||
          char.id.toLowerCase().includes(userGuess.toLowerCase())
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [userGuess]);

  const startGame = () => {
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    setShuffledCharacters(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTotalGuesses(0);
    setCurrentStreak(0);
    setGameState('game');
  };

  const revealMore = () => {
    if (revealLevel < 4) {
      setRevealLevel(prev => prev + 1);
    }
  };

  const handleGuess = (guess) => {
    setUserGuess(guess);
    setShowSuggestions(false);
  };

  const submitGuess = (guessedCharacter) => {
    const isCorrect = guessedCharacter.id === currentCard.id;
    setTotalGuesses(prev => prev + 1);
    
    if (isCorrect) {
      const points = 5 - revealLevel; // More points for guessing earlier
      setScore(prev => prev + points);
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setCurrentStreak(0);
    }

    setShowAnswer(true);
    
    // Show answer for 2 seconds, then move to next card
    setTimeout(() => {
      if (currentIndex < shuffledCharacters.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  const selectSuggestion = (character) => {
    submitGuess(character);
  };

  const getRevealStyle = () => {
    const styles = [
      { clipPath: 'inset(0 0 0 0)', filter: 'blur(20px)' }, // 0 - completely hidden
      { clipPath: 'inset(0 0 0 0)', filter: 'blur(15px)' }, // 1 - very blurry
      { clipPath: 'inset(0 0 0 0)', filter: 'blur(10px)' }, // 2 - blurry
      { clipPath: 'inset(0 0 0 0)', filter: 'blur(5px)' },  // 3 - slightly blurry
      { clipPath: 'inset(0 0 0 0)', filter: 'blur(0px)' }   // 4 - clear
    ];
    return styles[revealLevel];
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

  if (gameState === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="mb-8">
                <div className="text-8xl mb-4 animate-bounce">🎯</div>
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 mb-4">
                  GUESS THE CARD
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg">
                  CLASH ROYALE EDITION
                </h2>
              </div>
              <p className="text-white text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                Test your Clash Royale knowledge! Cards are revealed piece by piece - can you guess them before they're fully shown?
                <span className="block text-blue-300 font-bold">The earlier you guess, the more points you get!</span>
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-8 max-w-5xl mx-auto">
              {/* Start Game Button */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative bg-black rounded-3xl p-8 border border-gray-800">
                  <div className="text-center">
                    <div className="text-7xl mb-6 animate-pulse">🎮</div>
                    <h3 className="text-3xl font-black text-white mb-4">START GAME</h3>
                    <p className="text-gray-300 mb-8 text-lg">
                      Begin your Clash Royale card guessing challenge!
                    </p>
                    <button
                      onClick={startGame}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black py-6 px-12 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-lg"
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
    );
  }

  if (gameState === 'results') {
    const accuracy = totalGuesses > 0 ? Math.round((score / (totalGuesses * 5)) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Game Complete! 🏆
            </h1>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-20">
                <div className="text-3xl font-black text-white">{totalGuesses}</div>
                <div className="text-sm text-gray-200">Total Guesses</div>
              </div>
              <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400 border-opacity-20">
                <div className="text-3xl font-black text-blue-400">{score}</div>
                <div className="text-sm text-blue-200">Total Score</div>
              </div>
              <div className="bg-purple-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-purple-400 border-opacity-20">
                <div className="text-3xl font-black text-purple-400">{accuracy}%</div>
                <div className="text-sm text-purple-200">Accuracy</div>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400 border-opacity-20">
                <div className="text-3xl font-black text-yellow-400">{bestStreak}</div>
                <div className="text-sm text-yellow-200">Best Streak</div>
              </div>
            </div>
            
            <div className="space-x-4">
              <button
                onClick={startGame}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <div className="text-white text-lg font-bold">Score: {score}</div>
                <div className="text-white text-sm">Streak: {currentStreak}</div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  GUESS THE CARD
                </h1>
                <p className="text-white text-sm opacity-80">Clash Royale Edition</p>
              </div>
              <div className="text-right">
                <div className="text-white text-lg font-bold">{currentIndex + 1} / {shuffledCharacters.length}</div>
                <div className="text-white text-sm">Best: {bestStreak}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-black bg-opacity-30 rounded-full h-4 mb-4 border border-gray-600">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${((currentIndex + 1) / shuffledCharacters.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Card Display */}
          <div className="group relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative bg-black rounded-3xl p-8 border border-gray-800 shadow-2xl">
              <div className="text-center">
                {/* Card Image */}
                <div className="relative mb-8">
                  <div className="w-80 h-80 md:w-96 md:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-700 bg-gray-800">
                    <img
                      src={currentCard.imageUrl}
                      alt={currentCard.name}
                      className="w-full h-full object-contain p-2 transition-all duration-500"
                      style={getRevealStyle()}
                    />
                  </div>
                  
                  {/* Reveal Level Indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                      {[0, 1, 2, 3, 4].map(level => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            level <= revealLevel ? 'bg-blue-400' : 'bg-gray-600'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Answer Display */}
                {showAnswer && (
                  <div className="mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <h2 className="text-3xl font-black text-white mb-2">
                      {currentCard.name}
                    </h2>
                    <p className="text-gray-300 text-lg mb-4">
                      {currentCard.description}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getRarityColor(currentCard.rarity)}`}>
                        {currentCard.rarity.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getElixirColor(currentCard.elixir)}`}>
                        {currentCard.elixir} Elixir
                      </span>
                    </div>
                  </div>
                )}

                {/* Controls */}
                {!showAnswer && (
                  <div className="space-y-6">
                    {/* Reveal Button */}
                    <button
                      onClick={revealMore}
                      disabled={revealLevel >= 4}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                    >
                      {revealLevel >= 4 ? 'Fully Revealed!' : 'Reveal More'}
                    </button>

                    {/* Guess Input */}
                    <div className="relative">
                      <input
                        type="text"
                        value={userGuess}
                        onChange={(e) => handleGuess(e.target.value)}
                        placeholder="Type card name to guess..."
                        className="w-full max-w-md px-6 py-4 text-xl font-bold text-white bg-black bg-opacity-50 border-2 border-gray-600 rounded-2xl focus:border-blue-400 focus:outline-none transition-all duration-300"
                        disabled={showAnswer}
                      />
                      
                      {/* Suggestions */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 max-w-md mx-auto mt-2 bg-black bg-opacity-90 backdrop-blur-sm border border-gray-600 rounded-2xl overflow-hidden z-50">
                          {filteredSuggestions.map((character) => (
                            <button
                              key={character.id}
                              onClick={() => selectSuggestion(character)}
                              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3"
                            >
                              <img
                                src={character.imageUrl}
                                alt={character.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <div className="font-bold">{character.name}</div>
                                <div className="text-sm text-gray-400">{character.rarity} • {character.elixir} elixir</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={() => {
                        const guessedCharacter = characters.find(char => 
                          char.name.toLowerCase() === userGuess.toLowerCase() ||
                          char.id.toLowerCase() === userGuess.toLowerCase()
                        );
                        if (guessedCharacter) {
                          submitGuess(guessedCharacter);
                        }
                      }}
                      disabled={!userGuess || showAnswer}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                    >
                      Submit Guess
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-white text-lg opacity-80 font-medium">
              Click <span className="text-blue-400 font-bold">Reveal More</span> to gradually show the card, then <span className="text-green-400 font-bold">guess the character</span>!
            </p>
            <p className="text-white text-sm opacity-60 mt-2">
              Points: 5 (hidden) • 4 (blurry) • 3 (less blurry) • 2 (slightly blurry) • 1 (clear)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuessTheCard;
