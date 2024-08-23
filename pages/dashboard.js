import { useRouter } from 'next/router'; // Import the useRouter hook
import React,{ useEffect, useState } from 'react';
import { firebase } from '../Firebase/config';
import { format, parse } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Gamesedit from '../components/Gamesedit'
import GameResult from '../components/GameResult'

const Dashboard = () => {
  const router = useRouter(); // Initialize the router
  const [authUser, setAuthUser] = useState(null);
  const formatTime = (time) => {
    // Parse the time string into a Date object
    const parsedTime = parse(time, 'HH:mm', new Date());

    // Format the time in Indian format with AM/PM
    const formattedTime = format(parsedTime, 'hh:mm a');

    return formattedTime;
  };
  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, store user data if needed
        setAuthUser(user);
      } else {
        // User is not authenticated, redirect to the login page
        // router.push('/signin'); // Replace with the actual login page path
      }
    });
  
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  const [gameName, setGameName] = useState('');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [number, setNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [monthnumber, setMonthnumber] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Track whether we are in edit mode
  const [editGame, setEditGame] = useState(null); // Track the game being edited
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [gamesData, setGamesData] = useState([]);
  useEffect(() => {

    const fetchUserData = async () => {
      const usersSnapshot = await firebase.firestore().collection('games').get();
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      setUsersData(usersList);
      console.log("userData",usersData);
      console.log("user list",usersList);
    };

    // Fetch game data from Firestore
    const fetchGameNames = async () => {
      const snapshot = await firebase.firestore().collection('games').get();
      const gameNamesList = snapshot.docs.map(doc => doc.data());
      console.log("sdfghj",gameNamesList);
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
    fetchUserData();

    fetchGameNames();
  },  []);

  const handleAddGame = async () => {
    // Add a new game to Firestore
    if (gameName) {
      await firebase.firestore().collection('games').add({ name: gameName, time: selectedTime });
      setGameName('');
      setSelectedTime('');
      // Refresh the page after adding a new game
      toast.success('Game Added successfully');
      window.location.reload();
    }
  };
  
  const handleSubmitResult = async () => {
    // Show a loading message
    toast.info('Uploading result...');
    // Submit the result to Firestore
    if (selectedGame && selectedDate &&  number) {
      // Split the selectedDate into parts
      const [year, month, day] = selectedDate.split('-');

      // Format the selected date as "mm-dd-yyyy"
      const formattedDate = `${month}-${day}-${year}`;

      try {
        await firebase.firestore().collection('results').add({
          game: selectedGame,
          date: formattedDate,
          number: number,
          // userId: user.uid, 
        });

        // Show a success message
        toast.success('Game result added successfully');

        setSelectedGame('');
        setSelectedDate('');
        setNumber('');
      } catch (error) {
        console.error('Error submitting result:', error);
        // Show an error message
        toast.error('Error submitting result');
      }
    }
  };

  const handleEdit = async (game) => {
    setIsEditing(true); // Enter edit mode
    setEditGame(game);
    setGameName(game.name);
    setSelectedTime(game.time);
  };

  const handleSaveEdit = async () => {
    try {
      // Implement your editing logic here using Firebase Firestore
      // For example, you can update the name and time fields
      const updatedData = {
        name: gameName,
        time: selectedTime,
      };
      await firebase.firestore().collection('games').doc(editGame.id).update(updatedData);
      // Refresh the games list
      const updatedGamesList = games.map(g => (g.id === editGame.id ? { ...g, ...updatedData } : g));
      setGames(updatedGamesList);
      setIsEditing(false); // Exit edit mode
      setEditGame(null);
      setGameName('');
      setSelectedTime('');
    } catch (error) {
      console.error('Error editing game:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Exit edit mode
    setEditGame(null);
    setGameName('');
    setSelectedTime('');
  };

  // Function to handle deleting data
  const handleDelete = (game) => {
    // Set the game to delete and open the modal
    setGameToDelete(game);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (gameToDelete) {
      try {
        await firebase.firestore().collection('games').doc(gameToDelete.id).delete();
        // Refresh the games list by filtering out the deleted game
        const updatedGamesList = gamesData.filter((g) => g.id !== gameToDelete.id);
        setGames(updatedGamesList);
      
        setIsModalOpen(false);
        window.location.reload();
        // Close the modal
      } catch (error) {
        console.error('Error deleting game:', error);
        // Close the modal on error
        setIsModalOpen(false);
      }
    }
  };

  const closeModal = () => {
    // Close the modal without deleting
    setIsModalOpen(false);
  };

  

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const handleDelete1 = async (game) => {
    try {
      if (game && game.id) {
        await firebase.firestore().collection('games').doc(game.id).delete();
        const updatedGamesList = gamesData.filter(g => g.id !== game.id);
        setGamesData(updatedGamesList);
        toast.success('Game deleted successfully');
      } else {
        // Handle case where game or game.id is undefined
        console.error('Invalid game object:', game);
        toast.error('Error deleting game: Invalid game object');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error('Error deleting game');
    }
  };
  

  return (
    <div className="bg-sky-100 font-serif">
      <div className="bg-blue-50 rounded-lg shadow-lg p-6"  >
        <div className="mb-4">
          <div className='flex justify-between '>
          {/* <h1 className="text-2xl font-bold mb-4 font-serif">Add New Game</h1> */}
         <a href='/UserSignUp.html'><button className='bg-blue-900 text-white px-4 py-2 rounded-lg mt-2 '>ADD USER</button></a> 
          </div>
         
          {/* <input
            type="text"
            placeholder="Enter game name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full mt-2"
          />
           <input
  type="time"
  value={selectedTime}
  onChange={(e) => setSelectedTime(e.target.value)}
  className="px-4 py-2 border rounded-lg w-full mt-2"
/>

            <button onClick={handleAddGame} className="bg-blue-900 text-white px-4 py-2 rounded-lg mt-2">
              + Add Game
            </button> */}
          
        </div>
       <Gamesedit/>
        {/* <div className="mb- mt-8">
          <h2 className="text-xl font-bold mb-2"> +  Game Number Add</h2>
          <select
            value={selectedGame}
            onChange={(e) =>setSelectedGame(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full"
          >
            <option value="">Select a game</option>
            {games.map((game, index) => (
              <option key={index} value={game.name}>
                {game.name}
              </option>
            ))}
          </select>
        </div> 
        <div className="mb-8">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full"
          />
          <input
            type="number"
            placeholder="Enter number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full mt-2"
          />
          <button onClick={handleSubmitResult} className="bg-blue-900 text-white px-4 py-2 rounded-lg w-full mt-2">
            Submit
          </button>
        </div> */}

        <GameResult/>
       
      </div>

    
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Dashboard;