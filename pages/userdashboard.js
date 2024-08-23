import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { firebase, auth } from "@/Firebase/config"; // Import your Firebase configuration
import { ToastContainer, toast } from "react-toastify";
import { format, parse } from "date-fns";
// import { format, parse } from 'date-fns';

import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [number, setNumber] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editNumber, setEditNumber] = useState("");

  const handleEdit = (index, number) => {
    setEditIndex(index);
    setEditNumber(number);
  };

  const handleSave = async (resultId, newNumber) => {
    try {
      // Update the result with the new number
      await firebase.firestore().collection("results").doc(resultId).update({
        number: newNumber,
      });
      // Update the local state with the new number
      const updatedResults = results.map((result, index) =>
        index === editIndex ? { ...result, number: newNumber } : result
      );
      setResults(updatedResults);
      // Reset editIndex and editNumber
      setEditIndex(null);
      setEditNumber("");
      toast.success("Number updated successfully");
    } catch (error) {
      console.error("Error updating number:", error);
      toast.error("Error updating number");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push("/signin");
      } else {
        const userId = currentUser.uid;
        const userDocRef = firebase
          .firestore()
          .collection("games")
          .where("userId", "==", userId);
        try {
          const userDoc = await userDocRef.get();
          if (!userDoc.empty) {
            userDoc.forEach((doc) => {
              const userData = doc.data();
              setUserData(userData);
            });
          } else {
            console.log("User document does not exist");
          }

          // Fetch results for the user
          const resultsRef = firebase
            .firestore()
            .collection("results")
            .where("userId", "==", userId);
          const resultsSnapshot = await resultsRef.get();
          const resultsData = resultsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setResults(resultsData);
        } catch (error) {
          console.error("Error fetching user document:", error);
          toast.error("Error fetching user data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmitResult = async () => {
    toast.info("Uploading result...");
  
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("User not logged in");
      return;
    }
  
    const userId = currentUser.uid;
  
    if (selectedGame && selectedDate && number) {
      const [year, month, day] = selectedDate.split("-");
      const formattedDate = `${month}-${day}-${year}`;
  
      try {
        // Check if a result already exists for the selected game and date
        const existingResult = results.find(
          (result) =>
            result.game === selectedGame && result.date === formattedDate
        );
        if (existingResult) {
          toast.error("Result already exists for this game and date");
          return;
        }
  
        const parsedNumber = parseInt(number, 10);
        // Check if the number exceeds 99 (2 digits)
        if (parsedNumber > 99) {
          toast.error("Number should not exceed 2 digits");
          return;
        }
  
        // Add the new result
        await firebase.firestore().collection("results").add({
          game: selectedGame,
          date: formattedDate,
          number: number,
          userId: userId,
        });
  
        // Refresh the results list
        const snapshot = await firebase
          .firestore()
          .collection("results")
          .where("userId", "==", userId)
          .get();
        const updatedResultsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setResults(updatedResultsList);
        toast.success("Game result added successfully");
  
        setSelectedGame("");
        setSelectedDate("");
        setNumber("");
      } catch (error) {
        console.error("Error submitting result:", error);
        toast.error("Error submitting result");
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-sky-100">
        <p className="text-blue-500 font-bold  text-5xl">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer /> {/* Place ToastContainer component here */}
      {/* <div className="bg-sky-200"> */}
      <div className="bg-sky-100 font-serif">
        {userData && (
          <div>
            <p className="text-4xl font-bold mb-2  text-black mt-1">
              {userData.name.toUpperCase()}
            </p>
            <div className="mb- mt-8">
              <h2 className="text-2xl font-bold mb-2"> +Add Result</h2>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full"
              >
                <option value="">Select a game</option>
                {userData && (
                  <option value={userData.name}>{userData.name}</option>
                )}
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
                placeholder="
                Enter number (max 2 words)"
                value={number}
                onChange={(e) => {
                  const inputNumber = e.target.value;
                  const words = inputNumber.trim().split(/\s+/); // Split input by whitespace
                  if (words.length <= 2) {
                    // If number of words is less than or equal to 2, update state
                    setNumber(inputNumber);
                  }
                }}
                className="px-4 py-2 border rounded-lg w-full mt-2"
              />

              <button
                onClick={handleSubmitResult}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg w-full mt-2"
              >
                Submit
              </button>
            </div>
            {/* <p>Usergame: {userData.game}</p> */}
          </div>
        )}
        <div className="bg-sky-100 m-2 font-serif h-[100vh]">
          {/* Render UserDetails component */}
          {/* Your existing JSX code */}

          {/* Display the results */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Results</h2>
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-400 mx-auto w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 px-4 py-2">Date</th>
                    <th className="border border-gray-400 px-4 py-2">Result</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
        <td className="border text-black border-gray-400 px-4 py-2">
        {result.date && format(new Date(result.date), 'dd MMMM yyyy')}
      </td>

                      <td className="border border-gray-400 text-black px-4 py-2">
                        {editIndex === index ? (
                          <input
                            type="number"
                            value={editNumber}
                            onChange={(e) => setEditNumber(e.target.value)}
                            className="px-2 py-1 border rounded"
                          />
                        ) : (
                          result.number
                        )}
                      </td>
                      <td className="border text-black border-gray-400 px-4 py-2">
                        {editIndex === index ? (
                          <button
                            onClick={() => handleSave(result.id, editNumber)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(index, result.number)}
                            className="bg-green-500 text-white px-3 py-1 rounded mr-2 text-center flex justify-center"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default UserDashboard;
