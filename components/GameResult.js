import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { format, parse } from 'date-fns';

const Index = () => {
  const [games, setGames] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editNumber, setEditNumber] = useState('');
  const [gameToEdit, setGameToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const formattedDate = `${month}-${day}-${year}`;
    setCurrentDate(formattedDate);

    const fetchResults = async () => {
      const snapshot = await firebase.firestore().collection('results').get();
      const resultsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFilteredResults(resultsList);
    };

    fetchResults();
  }, []);

  useEffect(() => {
    const fetchGameNames = async () => {
      const snapshot = await firebase.firestore().collection('games').get();
      const gameNamesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  const formatTime = (time) => {
    try {
      if (typeof time !== 'string' || time.trim() === '') {
        throw new Error('Invalid time value');
      }

      const parsedTime = parse(time, 'HH:mm', new Date());
      if (isNaN(parsedTime.getTime())) {
        throw new Error('Invalid time value');
      }

      const formattedTime = format(parsedTime, 'hh:mm aa');

      return formattedTime;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  const handleEdit = (game) => {
    const foundResult = filteredResults.find(result => result.game === game.name && format(new Date(result.date), 'MM-dd-yyyy') === currentDate);
    if (foundResult) {
      setGameToEdit(foundResult);
      setIsEditing(true);
      setEditNumber(foundResult.number);
    } else {
      setIsEditing(false);
      setGameToEdit(null);
    }
  };

  const handleEditSubmit = async () => {
    if (isEditing && gameToEdit) {
      try {
        await firebase.firestore().collection('results').doc(gameToEdit.id).update({
          number: editNumber,
        });
        setIsEditing(false);
        const updatedResults = filteredResults.map(result =>
          result.id === gameToEdit.id ? { ...result, number: editNumber } : result
        );
        setFilteredResults(updatedResults);
        setGameToEdit(null);
      } catch (error) {
        console.error('Error editing result:', error);
        setIsEditing(false);
        setGameToEdit(null);
      }
    } else {
      setIsEditing(false);
      setGameToEdit(null);
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-white'>
      {isLoading ? (
        <div className='flex justify-center items-center h-screen'>
          {/* <p className='text-red-300 font-bold text-5xl'>Loading...</p> */}
        </div>
      ) : (
        <div className='grid px-10 py-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {games.map((game, index) => {
            const foundResult = filteredResults.find(result => result.game === game.name && format(new Date(result.date), 'MM-dd-yyyy') === currentDate);
            const gameTime = formatTime(game.time);
            return (
              <div
                key={index}
                className={`bg-white p-2 rounded-md shadow-md ${index % 2 === 0 ? 'text-blue-900' : 'text-blue-800'}`}
              >
                <span className={`w-2 h-2 inline-block rounded-full mr-1 animate-blink`}></span>
                <div className='flex flex-col border w-[100%] rounded border-blue-500'>
                  <span className='text-xl font-bold text-center'>{game.name}</span>
                  <span className='text-2xl mt-2 text-center'>{gameTime}</span>
                  {isEditing && gameToEdit && foundResult && gameToEdit.id === foundResult.id ? (
                    <div className='flex justify-center flex-col'>
                      <input
                        type='text'
                        value={editNumber}
                        className="border border-gray-300 rounded-md p-2 mx-2 mb-4"
                        onChange={(e) => setEditNumber(e.target.value)}
                      />
                      <div className='flex '>
                        <button className='p-2 text-sm bg-green-800 rounded-md m-2 text-white' onClick={handleEditSubmit}>Submit</button>
                        <button className='p-2 text-sm bg-red-800 rounded-md m-2 text-white' onClick={() => {
                          setIsEditing(false);
                          setGameToEdit(null);
                        }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button className='text-xl px-3 py-1 mt-2 rounded font-bold mb-6 text-white bg-blue-800'>
                      {foundResult ? foundResult.number : '-'}
                    </button>
                  )}
                  <div className='flex justify-center mb-20'>
                    <button
                      onClick={() => handleEdit(game)}
                      className='text-md px-3 py-1 mt-2 rounded font-bold mb-6 text-white bg-blue-900'
                    >
                      Edit Number
                    </button>
                  </div>
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
