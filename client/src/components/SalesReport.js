import React, { useState } from 'react';
import axios from 'axios';

const SalesReport = () => {
  const [month, setMonth] = useState('');
  const [sales, setSales] = useState(null);
  const [error, setError] = useState('');

  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/getSalesReport/${month}`);
      setSales(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching sales report:', error);
      setError('Failed to fetch sales report. Please try again later.');
      setSales(null);
    }
  };

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
      {sales !== null && <div><h3>Total Sales for {month}:</h3><p>{sales}</p></div>}
    </div>
  );
};

export default SalesReport;
