import React, { useState, useEffect } from "react";
import "./App.css";
import { FaBan } from "react-icons/fa";
function App() {
  // State variables for input values and DRR calculation
  const [dataRows, setDataRows] = useState([
    {
      index: 1,
      startDate: "",
      endDate: "",
      excludedDates: [""], // Array to store excluded dates
      leads: 0,
      drr: 0,
      monthYear: "",
      numberOfDays: 0,
      lastUpdate: "",
    },
  ]);

  // State variable to store saved DRR values
  const [savedDRRs, setSavedDRRs] = useState([]);

  // Function to calculate DRR, Month, Year, and Number of Days for a specific row
  const calculateDRR = (rowIndex) => {
    const row = dataRows[rowIndex];
    const start = new Date(row.startDate);
    const end = new Date(row.endDate);

    if (!isNaN(start) && !isNaN(end) && start <= end) {
      const excludedDays = row.excludedDates.filter(
        (date) => date !== ""
      ).length;
      const days = (end - start) / (1000 * 60 * 60 * 24);
      const calculatedDRR = row.leads / (days - excludedDays);
      row.drr = calculatedDRR.toFixed(2); // Round to two decimal places

      // Calculate Month and Year
      const month = start.toLocaleString("en-us", { month: "long" });
      const year = start.getFullYear();
      row.monthYear = `Month: ${month} ${year}`;

      // Set Number of Days
      row.numberOfDays = days - excludedDays;

      // Update the dataRows array with the modified row
      const updatedDataRows = [...dataRows];
      updatedDataRows[rowIndex] = row;
      setDataRows(updatedDataRows);
    }
  };

  // Function to save the calculated DRR for a specific row
  const saveDRR = (rowIndex) => {
    const savedRow = dataRows[rowIndex];
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    savedRow.lastUpdate = formattedDate;
    setSavedDRRs([...savedDRRs, savedRow]);

    // Calculate the next row's DRR based on the previous row
    const nextIndex = savedRow.index + 1;
    const nextRow = {
      index: nextIndex,
      startDate: "",
      endDate: "",
      excludedDates: [""],
      leads: 0,
      drr: 0, // Set the next row's DRR to 0
      monthYear: "",
      numberOfDays: 0,
      lastUpdate: "",
    };

    // Add the new row above the previous row
    const updatedDataRows = [...dataRows];
    updatedDataRows.splice(rowIndex, 0, nextRow);
    setDataRows(updatedDataRows);
  };

  // Function to handle changes in excluded dates for a specific row
  const handleExcludedDateChange = (rowIndex, dateIndex, value) => {
    const updatedDataRows = [...dataRows];
    updatedDataRows[rowIndex].excludedDates[dateIndex] = value;
    setDataRows(updatedDataRows);

    // If the last excluded date is not empty, add a new empty one
    const lastExcludedDate =
      updatedDataRows[rowIndex].excludedDates.slice(-1)[0];
    if (lastExcludedDate !== "") {
      updatedDataRows[rowIndex].excludedDates.push("");
      setDataRows(updatedDataRows);
    }
  };

  // Helper function to handle input changes for a specific field in a row
  const handleInputChange = (fieldName, event, rowIndex) => {
    const value = event.target.value;
    const updatedDataRows = [...dataRows];
    updatedDataRows[rowIndex][fieldName] = value;
    setDataRows(updatedDataRows);
  };

  // This effect will automatically calculate DRR when start date, end date, excluded dates, or lead count changes.
  useEffect(() => {
    dataRows.forEach((row, rowIndex) => {
      calculateDRR(rowIndex);
    });
  }, [dataRows]);
  // Function to reset a row to its default state

  const resetRow = (rowIndex) => {
    if (dataRows.length === 1) {
      // Don't delete the last row
      alert("At least one row must be present.");
    } else {
      const updatedDataRows = [...dataRows];
      updatedDataRows.splice(rowIndex, 1); // Remove the row at the specified index
      setDataRows(updatedDataRows);
    }
  };

  return (
    <div className="container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Month</th>
            <th>Exclude Dates</th>
            <th>Number of Days</th>
            <th>Lead Count</th>
            <th>Expected DRR</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.index}</td>
              <td>
                <input
                  type="date"
                  value={row.startDate}
                  onChange={(e) => handleInputChange("startDate", e, rowIndex)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={row.endDate}
                  onChange={(e) => handleInputChange("endDate", e, rowIndex)}
                />
              </td>
              <td>
                <div className="month-year">
                  {row.monthYear.replace("Month:", "")}
                </div>
              </td>
              <td>
                {row.excludedDates.map((date, dateIndex) => (
                  <input
                    key={dateIndex}
                    type="date"
                    value={date}
                    onChange={(e) =>
                      handleExcludedDateChange(
                        rowIndex,
                        dateIndex,
                        e.target.value
                      )
                    }
                  />
                ))}
              </td>
              <td>
                <div className="number-of-days">
                  Number of Days: {row.numberOfDays}
                </div>
              </td>
              <td>
                <input
                  type="number"
                  value={row.leads}
                  onChange={(e) => handleInputChange("leads", e, rowIndex)}
                />
              </td>
              <td>
                <div className="dashboard">DRR: {row.drr}</div>
              </td>
              <td>
                <div className="last-update">{row.lastUpdate}</div>
              </td>
              <td>
                <div className="last-update">
                  <button onClick={() => saveDRR(rowIndex)}>Save DRR</button>
                  <button
                    onClick={() => resetRow(rowIndex)}
                    className="cancel-button"
                    disabled={dataRows.length === 1}
                  >
                    {dataRows.length === 1 ? (
                      <>
                        <FaBan /> Cancel
                      </>
                    ) : (
                      "Cancel"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
