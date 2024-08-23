import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
// import GameTable from '../pages';

const yearOptions = [2018, 2019, 2020, 2021, 2022, 2023, 2024]; // Update with the desired range

const GameTable = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedGame, setSelectedGame] = useState('');
  const [uniqueGameNames, setUniqueGameNames] = useState([]);
  const [gamesData, setGamesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [gameNames, setGameNames] = useState([]);
 
  useEffect(() => {
    // Fetch game names from Firestore
    const fetchGameNames = async () => {
      const snapshot = await firebase.firestore().collection('games').get();
      const gameNamesList = snapshot.docs.map((doc) => doc.data());
      // Sort the game names based on the time property
      gameNamesList.sort((a, b) => {
        if (a.time < b.time) {
          return -1;
        }
        if (a.time > b.time) {
          return 1;
        }
        return 0;
      });
      setGameNames(gameNamesList);
      setIsLoading(false);
    };
  
    fetchGameNames();
  }, []);

  useEffect(() => {
    // Fetch results from Firestore
    const fetchResults = async () => {
      const snapshot = await firebase.firestore().collection('results').get();
      const resultsList = snapshot.docs.map((doc) => doc.data());
      setGamesData(resultsList);
      setIsLoading(false);
    };

    fetchResults();
  }, []);

  useEffect(() => {
    // Determine the top game based on your criteria (e.g., highest number)
    // Replace this logic with your specific criteria
    const topGame = gamesData.reduce((prevGame, currentGame) => {
      return currentGame.number > prevGame.number ? currentGame : prevGame;
    }, { number: -1 }); // Initialize with a low number

    // Set the top game as the selected game
    setSelectedGame(topGame.game);
  }, [gamesData]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const handleGameChange = (e) => {
    setSelectedGame(e.target.value);
  };

  const filteredGames = gamesData.filter((game) => {
    const gameYear = new Date(game.date).getFullYear();
    return (
      (!selectedYear || gameYear === selectedYear) &&
      (!selectedGame || game.game === selectedGame)
    );
  });

  return (
    <div className="mx-auto bg-blue-100 font-serif  " >
      {isLoading ? ( // Display loading indicator while isLoading is true
        <div className="flex justify-center items-center h-screen">
          <p className="text-blue-500 font-bold  text-5xl">Loading...</p>
        </div>
      ) : (
        // Data has loaded, display the game table
        <div>
          <div className="justify-center items-center flex">
            <p className='text-blue-800 font-bold text-3xl mt-3'>
              Yearly Chart
            </p>
          </div>
          <div className="flex justify-center mb-4  lg:p-4 bg-sky-100 m-3 p-2">
            <div className="mr-8">
              <label className="block mb-2 atext-lg text-blue-600 t">Select Year:</label>
              <select
                className="border p-2 rounded-md text-black"
                onChange={handleYearChange}
                value={selectedYear}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-lg text-blue-600 text-black">Select Game:</label>
              <select
                className="border p-2 rounded-md text-black"
                onChange={handleGameChange}
                value={selectedGame}
              >
                {gameNames.map((gameName) => (
                  <option key={gameName} value={gameName.name}>
                    {gameName.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 mb-4 justify-center items-center flex p-4 flex-col md:flex-row lg:flex-row bg-sky-100 m-3">
            <p className='text-blue-600 font-bold'>
              Selected Year: {selectedYear}
            </p>
            <p className='text-blue-600 font-bold ml-4'>
              Selected Game: {selectedGame}
            </p>
          </div>
          <div className="overflow-x-auto mx-5" style={{ backgroundImage: `url(https://media.istockphoto.com/id/1158182576/vector/digital-marketing-strategies.jpg?s=612x612&w=0&k=20&c=q7i7EA0p0bOl6z9ZaoQSsGSqcB-aswN70f3pQSUR-gw=)` }}  >
            <table className="border-collapse w-full text-black">
              <thead className='bg-sky-300 text-[18px]'>
                <tr>
                  <th className="border text-white px-4 py-2">Date</th>
                  {Array.from({ length: 12 }).map((_, monthIndex) => (
                    <th key={monthIndex} className="border text-white px-4 py-2">
                      {new Date(selectedYear, monthIndex, 1).toLocaleString('en-US', {
                        month: 'long',
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-sky-50 '>
  {Array.from({ length: 31 }).map((_, dayIndex) => (
    <tr key={dayIndex}>
      <td className="border px-4 py-2">{dayIndex + 1}</td>
      {Array.from({ length: 12 }).map((_, monthIndex) => {
        const game = filteredGames.find((g) => {
          const date = new Date(g.date);
          return (
            date.getMonth() === monthIndex &&
            date.getDate() === dayIndex + 1
          );
        });

        return (
          <td key={monthIndex} className="border px-4 py-2">
            {game ? game.number : '-'}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTable;
