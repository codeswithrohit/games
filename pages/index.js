import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { format, parse } from 'date-fns';

const Index = () => {
  const [games, setGames] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [currentDate, setCurrentDate] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();

    const formattedDate = `${month}-${day}-${year}`;
    setCurrentDate(formattedDate);

    // Fetch results from Firestore and filter based on the current date
    const fetchResults = async () => {
      const snapshot = await firebase.firestore().collection('results').get();
      const resultsList = snapshot.docs.map((doc) => doc.data());
      setFilteredResults(resultsList);
    };

    fetchResults();
  }, []);
  console.log(filteredResults)

  useEffect(() => {
    // Fetch game data from Firestore
    const fetchGameNames = async () => {
      const snapshot = await firebase.firestore().collection('games').get();
      const gameNamesList = snapshot.docs.map(doc => doc.data());
      // Sort the game names based on the time property
      gameNamesList.sort((a, b) => {
        const timeA = parse(a.time, 'HH:mm', new Date());
        const timeB = parse(b.time, 'HH:mm', new Date());
        if (timeA < timeB) {
          return -1;
        }
        if (timeA > timeB) {
          return 1;
        }
        return 0;
      });
      setGames(gameNamesList);
      setIsLoading(false);
    };
  
    fetchGameNames();
  }, []);
  console.log(games)

 const formatTime = (time) => {
  try {
    // Check if the time is a non-empty string
    if (typeof time !== 'string' || time.trim() === '') {
      throw new Error('Invalid time value');
    }

    // Parse the time string into a Date object
    const parsedTime = parse(time, 'HH:mm', new Date());

    // Check if the parsedTime is a valid Date object
    if (isNaN(parsedTime.getTime())) {
      throw new Error('Invalid time value');
    }

    // Format the time in Indian format with AM/PM
    const formattedTime = format(parsedTime, 'hh:mm aa');

    console.log('Original time:', time);
    console.log('Parsed time:', parsedTime);
    console.log('Formatted time:', formattedTime);

    return formattedTime;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
};

  return (
    <div className='min-h-screen bg-blue-50 dark:bg-white' >
      {isLoading ? (
        // Display loading indicator while isLoading is true
        <div className='flex justify-center items-center h-screen'>
          <p className='text-blue-300 font-bold text-5xl bg'>Loading...</p>
        </div>
      ) : (
        <div className='border-pink-300
         grid px-10 py-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-3 gap-4' >
          {games.map((game, index) => {
            // Check if the formatted date matches the current date
            const showResult = filteredResults.find(
              result => format(new Date(result.date), 'MM-dd-yyyy') === currentDate && result.game === game.name
            );
            const gameTime = formatTime(game.time);
  
            return (
              <div 
              key={index}
              className={`bg-white p-2 rounded-md shadow-md border  border-blue-500 ${index % 2 === 0 ? 'text-blue-900' : 'text-blue-800'}`}
              // style={{ backgroundImage: `url(https://cdn.pixabay.com/photo/2014/04/02/10/13/whiteboard-303145_1280.png)`, backgroundSize: 'cover' }}
            >
                <span className={`w-2 h-2 inline-block rounded-full mr-1 animate-blink`}></span>
                <div className='flex flex-col'>
                  <span className='text-xl font-bold text-center'>{game.name}</span>
                  <span className='text-1xl lg:text-2xl md:text-2xl  mt-2 text-center'>{gameTime}</span>
                  <button className='text-xl px-3 py-1 mt-2 rounded font-bold mb-6 text-white bg-sky-600'>
                    {showResult ? showResult.number : '-'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
  
};

export default Index;
