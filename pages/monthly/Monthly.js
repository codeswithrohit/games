import React, { useState, useEffect } from 'react';
import { firebase, auth, firestore } from "@/Firebase/config";

const GameTable = ({ selectedGame }) => {
  const [results, setResults] = useState([]);
  const [gameNames, setGameNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch game names from Firestore
    const fetchGameNames = async () => {
      const snapshot = await firebase.firestore().collection('games').get();
      const gameNamesList = snapshot.docs.map(doc => doc.data());
      gameNamesList.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));
      setGameNames(gameNamesList);
      setIsLoading(false);
    };

    // Fetch results from Firestore
    const fetchResults = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
    
        if (currentUser) {
          setUser(currentUser);
    
          const snapshot = await firebase.firestore().collection('results')
            .where('userId', '==', currentUser.uid) // Filter results by user ID
            .where('game', '==', selectedGame) // Filter results by selected game
            .get();
    
          const resultsList = snapshot.docs.map(doc => doc.data());
          console.log("dfgh",resultsList);
          setResults(resultsList);
          setIsLoading(false);
        } else {
          console.error('User not logged in');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setIsLoading(false);
      }
    };

    fetchGameNames();
    fetchResults();
  }, [selectedGame]);

  // ... (rest of the code remains the same)
  const getBestResults = () => {
   const bestResults = {};

   gameNames.forEach(gameName => {
     const bestResult = results
       .filter(result => result.game === gameName)
       .reduce((prev, current) => (prev.number > current.number ? prev : current), {});
     
     bestResults[gameName] = bestResult;
   });

   return bestResults;
 };

 const bestResults = getBestResults();

 // State for selected month and year
 const currentDate = new Date();
 const currentYear = currentDate.getFullYear();
 const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

 // State for selected month and year
 const [selectedMonth, setSelectedMonth] = useState(currentMonth);
 const [selectedYear, setSelectedYear] = useState(currentYear);

 // Function to generate dates based on selected year and month
 const generateDates = () => {
   const startDate = new Date(selectedYear, getMonthIndex(selectedMonth), 1);
   const endDate = new Date(selectedYear, getMonthIndex(selectedMonth) + 1, 0);

   const dates = [];
   const currentDate = new Date(startDate);

   while (currentDate <= endDate) {
     dates.push(currentDate.getDate());
     currentDate.setDate(currentDate.getDate() + 1);
   }

   return dates;
 };

 // Helper function to get month index (0-based) from month name
 const getMonthIndex = (monthName) => {
   return [
     'January', 'February', 'March', 'April', 'May', 'June',
     'July', 'August', 'September', 'October', 'November', 'December'
   ].indexOf(monthName);
 };

 // Function to handle form submission
 const handleSubmit = (e) => {
   e.preventDefault();
   // You can perform actions with the selectedMonth and selectedYear values here
   console.log('Selected Month:', selectedMonth);
   console.log('Selected Year:', selectedYear);
 };

 // Function to get the result for a specific game and date
 const getResultForGameAndDate = (gameName, date) => {
   const formattedDate = `${(getMonthIndex(selectedMonth) + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}-${selectedYear}`;

   const result = results.find(result => result.game === gameName && result.date === formattedDate);
   return result ? result.number : '-';
 };


  return (
    <div className="mx-auto bg-white min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-300 font-bold text-5xl">Loading...</p>
        </div>
      ) : (
       <div>
       <div className="justify-center items-center flex">
          <p className='text-red-300 font-bold text-xl'>
            Monthly Chart
          </p>
          
        </div>
          <div className="flex justify-center items-center p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="mb-4">
            <label className="block text-xs text-red-300 font-medium mb-2" htmlFor="selectMonth">
              Select Month:
            </label>
            <select
              id="selectMonth"
              className="px-2 py-1 border border-black rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {[
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-red-300 font-medium mb-2" htmlFor="selectYear">
              Select Year:
            </label>
            <select
              id="selectYear"
              className="px-2 py-1 border border-black rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 6 }, (_, index) => 2018 + index).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className='mt-2'>
            <button class="disabled:opacity-50 transition inline-flex items-center justify-center space-x-1.5 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 shrink-0 border-red-700/75 focus:ring-red-500 bg-red-300 text-white hover:bg-red-300 hover:border-red-700 px-3 py-1.5 text-sm font-medium rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
                <path d="M4.222 12.778 9.667 19l10.11-14"></path>
              </svg>
              <span>Submit</span>
            </button>
          </div>
        </form>
        {/* Display selected month and year below the form */}
        
      </div>
      <div className="mt-4 justify-center items-center flex">
          <p className='text-red-300 font-bold'>
            Selected Month: {selectedMonth}
          </p>
          <p className='text-red-300 font-bold ml-4'>
            Selected Year: {selectedYear}
          </p>
        </div>
      
          <div className="overflow-x-auto  md:p-8">
            <table className="w-full bg-white border border-black shadow-md rounded-lg">
              <thead className="bg-red-300 text-white">
                <tr>
                  <th className="px-1 py-2 text-left border border-black">Games</th>
                  {generateDates().map((date) => (
                    <th key={date} className="px-1 py-2 text-center border border-black">
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-700">
  {gameNames.map((gameName, index) => {
    // Filter results for the current gameName
    const filteredResults = results.filter(result => result.game === selectedGame);
    return (
      filteredResults.length > 0 && (
        <tr key={index}>
          <td className="px-1 py-1 border border-black">{gameName.name}</td>
          {generateDates().map((date) => (
            <td key={date} className="px-1 py-1 text-center border border-black">
              {getResultForGameAndDate(selectedGame, date)}
            </td>
          ))}
        </tr>
      )
    );
  })}
</tbody>


      
            </table>
          </div>

          </div>
      )}
    </div>
  );
};

export default GameTable;
