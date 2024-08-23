import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { firebase } from '../Firebase/config';
import { format, parse } from 'date-fns';
import Modal from 'react-modal';

const Dashboard = () => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
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


  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
      } else {
        router.push('/signin');
      }
    });
    return () => unsubscribe();
  }, []);
 
  const [gameName, setGameName] = useState('');
  const [games, setGames] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editGame, setEditGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);

  useEffect(() => {
    const fetchGameNames = async () => {
      const snapshot = await firebase.firestore().collection('games').get();
      const gameNamesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  const handleEdit = (game) => {
    setEditGame(game);
    setGameName(game.name);
    setSelectedTime(game.time);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (editGame) {
      try {
        await firebase.firestore().collection('games').doc(editGame.id).update({
          name: gameName,
          time: selectedTime,
        });
        setIsEditing(false);
        setIsModalOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Error editing game:', error);
        setIsEditing(false);
        setIsModalOpen(false);
      }
    }
  };

  const handleDelete = (game) => {
    setGameToDelete(game);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (gameToDelete) {
      try {
        await firebase.firestore().collection('games').doc(gameToDelete.id).delete();
        const updatedGamesList = games.filter((g) => g.id !== gameToDelete.id);
        setGames(updatedGamesList);
        setIsModalOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting game:', error);
        setIsModalOpen(false);
      }
    }
  };

  const closeModal = () => {
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="bg-white" style={{ backgroundImage: `url(https://media.istockphoto.com/id/1158182576/vector/digital-marketing-strategies.jpg?s=612x612&w=0&k=20&c=q7i7EA0p0bOl6z9ZaoQSsGSqcB-aswN70f3pQSUR-gw=)` }}>
      <div className="bg- rounded-lg shadow-lg p-6">
        {isLoading ? (
          <div className="flex justify-center items-center ">
            <p className="text-red-300 font-bold text-5xl">Loading...</p>
          </div>
        ) : (
          <div className="mx-auto pb-8 w-full max-w-7xl overflow-x-auto">
            <table className="px-4 min-w-full rounded-md border border-gray-200 overflow-hidden">
              <thead className="min-w-full bg-gray-100 text-left text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-sm font-medium uppercase tracking-wide" scope="col">
                    Game Name
                  </th>
                  <th className="py-3 px-4 text-sm font-medium uppercase tracking-wide" scope="col">
                    Time
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-medium uppercase tracking-wide" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {games.map((game, index) => (
                  <tr key={game.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} whitespace-nowrap`}>
                    <td className="py-3 px-4 text-base text-gray-700 font-semibold">{game.name}</td>
                    <td className="py-3 px-4 text-base text-gray-500 font-medium">{formatTime(game.time)}</td>
                    <td className="py-3 px-4 flex justify-around items-center space-x-6 text-base text-gray-700 font-medium">
                      <>
                        <button
                          onClick={() => handleEdit(game)}
                          type="button"
                          className="text-sm text-gray-700 font-semibold hover:underline hover:text-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(game)}
                          type="button"
                          className="text-sm text-red-500 font-semibold hover:text-red-600"
                        >
                          Delete
                        </button>
                      </>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Confirm Action">
          <div className="bg-white rounded-lg p-4 text-center">
            {isEditing ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Edit Game</h2>
                <p className="text-lg mb-4">Game Name: {editGame?.name}</p>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 mb-4"
                  placeholder="Edit Game Name"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                />
                <input
                  type="time"
                  className="border border-gray-300 rounded-md p-2 mb-4"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleEditSubmit}
                    className="bg-blue-900 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Submit
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
                {gameToDelete && (
                  <p className="text-lg mb-8">Are you sure you want to delete the game: {gameToDelete.name}?</p>
                )}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;











