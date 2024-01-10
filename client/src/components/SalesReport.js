import React, { useState } from 'react';
import axios from 'axios';


const SalesReport = () => {
  const [month, setMonth] = useState('');
  const [sales, setSales] = useState(null);
  const [medicine, setMedicine] = useState('');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(localStorage.getItem("type"));
  console.log("User role is:", userRole); // Debugging line
  const fetchSalesReport = async () => {
  try {
    // Assuming your backend function is expecting just the month in 'YYYY-MM' format 
    const response = await axios.get(`http://localhost:3000/getSalesReport/${month}`);
    
    setSales(response.data);
    setError('');
  } catch (error) {
    console.error('Error fetching sales report:', error);
    setError('Failed to fetch sales report. Please try again later.');
    setSales(null);
  }
};


const fetchSalesReportByMedicineDate = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/getSalesReportByMedicine/${month}/${medicine}`);
    setSales(response.data);
    setError('');
  } catch (error) {
    console.error('Error fetching sales report by medicine date:', error);
    setError('Failed to fetch sales report. Please try again later.');
    setSales(null);
    
  }
};
console.log(userRole);
  return (
    <div>
      <h2>Sales Report</h2>

      

      <div>
        <label htmlFor="month-input">Select Month: </label>
        <input
          id="month-input"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="YYYY-MM"
        />
        <button onClick={fetchSalesReport}>Get Sales Report</button>
      </div>
      {error && <div className="error">{error}</div>}
      {sales !== null && (
        <div>
          <h3>Total Sales for {month}:</h3>
          <p>{sales}</p>

          
          {userRole === 'pharmacist' && (
        <div>
          {/* Pharmacist-specific features */}
          <label htmlFor="medicine-input">Medicine: </label>
          <input
            id="medicine-input"
            type="text"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="Enter medicine name"
          />
          <label htmlFor="month-input-pharmacist">Select Month: </label>
          <input
            id="month-input-pharmacist" // Change the ID to ensure no duplication
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="YYYY-MM"
          />
          <button onClick={fetchSalesReportByMedicineDate}>Generate Medicine Sales Report</button>
        </div>
      )}

        </div>
      )}
    
    </div>
    
  );
};

export default SalesReport;
