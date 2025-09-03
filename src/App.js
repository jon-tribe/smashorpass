import React, { useState } from 'react';
import './App.css';
import characters from './data/characters.json';

// Import the existing SmashOrPass component
import SmashOrPass from './components/SmashOrPass';

function App() {
  const [currentGame, setCurrentGame] = useState('home'); // 'home', 'smash-or-pass'
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  const renderHomePage = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blurred Video Player Background */}
      <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 p-2 sm:p-4 opacity-20">
        {characters.slice(0, window.innerWidth < 640 ? 24 : 48).map((character, index) => {
          const familyFriendlyTitles = [
            "Cute Cat Videos",
            "Funny Dog Moments",
            "Amazing Magic Tricks",
            "Cool Science Experiments",
            "Awesome Dance Moves",
            "Epic Gaming Highlights",
            "Delicious Cooking Recipes",
            "Amazing Nature Scenes",
            "Fun Family Activities",
            "Exciting Sports Plays",
            "Beautiful Art Creations",
            "Interesting History Facts",
            "Amazing Space Discoveries",
            "Funny Baby Laughs",
            "Cool Car Reviews",
            "Awesome Music Covers",
            "Fun Travel Adventures",
            "Amazing Animal Friends",
            "Cool Tech Reviews",
            "Funny School Moments",
            "Awesome Parkour Moves",
            "Beautiful Sunset Views",
            "Fun Party Games",
            "Amazing Talent Shows"
          ];
          const viewCounts = ["2.1M", "1.8M", "3.2M", "956K", "1.5M", "2.7M", "1.3M", "4.1M", "789K", "2.9M", "1.7M", "3.5M", "2.3M", "1.9M", "3.8M", "1.4M", "2.6M", "1.1M", "3.9M", "2.4M", "1.6M", "3.1M", "2.8M", "1.2M"];
          const likePercentages = ["94%", "87%", "91%", "96%", "89%", "93%", "85%", "98%", "82%", "95%", "88%", "92%", "90%", "86%", "97%", "84%", "94%", "81%", "99%", "91%", "87%", "93%", "89%", "83%"];
          
          const title = familyFriendlyTitles[index % familyFriendlyTitles.length];
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
                  <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-3 border-l-white border-t-1.5 border-t-transparent border-b-1.5 border-b-transparent ml-0.5"></div>
                  </div>
                </div>
                {/* Video Metadata */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-1">
                  <div className="text-white text-xs truncate">{title}</div>
                  <div className="text-gray-300 text-xs">{views} views • {likes}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center max-w-2xl relative z-10">
        <div className="mb-6">
          <img 
            src="/images/SmashPass.png" 
            alt="Smash Pass" 
            className="h-20 md:h-24 mx-auto"
          />
        </div>
        <p className="text-xl text-gray-300 mb-8">
          Rate your favorite Clash Royale characters! Swipe right for smash, left for pass.
        </p>
        <button
          onClick={() => {
            setShowAgeVerification(true);
            setCurrentGame('smash-or-pass');
          }}
          className="bg-logo-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Start Playing
        </button>
      </div>
    </div>
  );



  // Render the appropriate component based on current game
  switch (currentGame) {
    case 'smash-or-pass':
      return <SmashOrPass showAgeVerification={showAgeVerification} />;
    default:
      return renderHomePage();
  }
}

export default App; 