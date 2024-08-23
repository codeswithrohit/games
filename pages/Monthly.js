import React, { useState, useEffect } from "react";
import { firebase } from "../Firebase/config";

const GameTable = () => {
  const [results, setResults] = useState([]);
  const [gameNames, setGameNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  useEffect(() => {
    // Fetch game names from Firestore
    const fetchGameNames = async () => {
      const snapshot = await firebase.firestore().collection("games").get();
      const gameNamesList = snapshot.docs.map((doc) => doc.data().name); // Extracting only the name property
      console.log("hxbjsx", gameNamesList);
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

    // Fetch results from Firestore
    const fetchResults = async () => {
      const snapshot = await firebase.firestore().collection("results").get();
      const resultsList = snapshot.docs.map((doc) => doc.data());
      console.log("ghjkl", resultsList);
      setResults(resultsList);
      setIsLoading(false);
    };

    fetchGameNames();
    fetchResults();
  }, []);

  // Function to find the best result for each game
  const getBestResults = () => {
    const bestResults = {};

    gameNames.forEach((gameName) => {
      const bestResult = results
        .filter((result) => result.game === gameName)
        .reduce(
          (prev, current) => (prev.number > current.number ? prev : current),
          {}
        );

      bestResults[gameName] = bestResult;
    });
    return bestResults;
  };

  const bestResults = getBestResults();

  // State for selected month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(monthName);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform actions with the selectedMonth and selectedYear values here
    console.log("Selected Month:", selectedMonth);
    console.log("Selected Year:", selectedYear);
  };

  // Function to get the result for a specific game and date
  const getResultForGameAndDate = (gameName, date) => {
    const formattedDate = `${(getMonthIndex(selectedMonth) + 1)
      .toString()
      .padStart(2, "0")}-${date.toString().padStart(2, "0")}-${selectedYear}`;

    const result = results.find(
      (result) => result.game === gameName && result.date === formattedDate
    );
    return result ? result.number : "-";
  };
// Function to generate the list of selectable years
const generateSelectableYears = () => {
  const startYear = 2018;
  const endYear = 2024;
  const selectableYears = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  return selectableYears;
};
  return (
    <div
      className="mx-auto bg-blue-100 min-h-screen font-serif"
    
    >
      {isLoading ? ( // Display loading indicator while isLoading is true
        <div className="flex justify-center items-center h-screen">
          <p className="text-sky-300 font-bold text-5xl">Loading...</p>
        </div>
      ) : (
        // Data has loaded, display the game table
        <div>
          <div className="justify-center items-center flex flex-col">
            <p className="text-sky-500 font-bold text-3xl mt-4">Monthly Chart</p>
          </div>
          <div className="flex justify-center items-center p-2 bg-sky-100 m-4">
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-3"
            >
              <div className="mb-4">

                <label
                  className="block text-1xl text-blue-500 font-medium mb-2"
                  htmlFor="selectMonth"
                >
                  Select Month:
                </label>
                <select
                  id="selectMonth"
                  className="px-2 py-1 border border-black rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
           <div className="mb-4">
  <label
    className="block text-1xl text-sky-500 font-medium mb-2 "
    htmlFor="selectYear"
  >
    Select Year:
  </label>
  <select
    id="selectYear"
    className="px-2 py-1 border border-black rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
    value={selectedYear}
    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
  >
    {generateSelectableYears().map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>
              {/* <div className="mt-2 bg-blue-200">
                <button class="disabled:opacity-50 transition inline-flex items-center justify-center space-x-1.5 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 shrink-0 border-blue-700/75 focus:ring-blue-500 bg-blue-300 text-white hover:bg-blue-300 hover:border-blue-700 px-3 py-1.5 text-sm font-medium rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-3.5 w-3.5"
                  >
                    <path d="M4.222 12.778 9.667 19l10.11-14"></path>
                  </svg>
                  <span>Submit</span>
                  
                </button>
              </div> */}
            </form>
            {/* Display selected month and year below the form */}
          </div>
          <div className="mt-4 justify-center items-center flex bg-sky-100 p-3 m-4 lg:flex-row flex-col">
            <p className="text-blue-500 font-bold">
              Selected Month: {selectedMonth}
            </p>
            <p className="text-sky-500 font-bold ml-4">
              Selected Year: {selectedYear}
            </p>
          </div>
          <div className="overflow-x-auto  md:p-8 mx-2">
            <table className="w-full bg-white border border-black shadow-md rounded-lg">
              <thead className="bg-sky-500 text-white">
                <tr>
                  <th className="px-1 py-2 text-left border border-black">
                    Games
                  </th>
                  {generateDates().map((date) => (
                    <th
                      key={date}
                      className="px-1 py-2 text-center border border-black"
                    >
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {gameNames.map((gameName, index) => {
                  // Filter results for the current gameName
                  const filteredResults = results.filter(
                    (result) => result.game === gameName.name
                  );
                  return (
                    <tr key={index}>
                      <td className="px-1 py-1 border   border-black">
                        {gameName}
                      </td>{" "}
                      {/* Change here */}
                      {generateDates().map((date, dateIndex) => (
                        <td
                          key={dateIndex}
                          className="px-1 py-1 text-center border border-black"
                        >
                          {getResultForGameAndDate(gameName, date)}{" "}
                          {/* Change here */}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default GameTable;
