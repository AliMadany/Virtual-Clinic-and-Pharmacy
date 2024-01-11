import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import axios from 'axios';

function Wallet() {
  const [wallet, setWallet] = useState(0);
  const patientId = localStorage.getItem('userId'); // Replace with the appropriate method to get the patient's ID

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = () => {
    axios.get(`http://localhost:3100/checkWallet/${patientId}`)
      .then(response => {
        if (response.data === null) {
          setWallet(0);
          return;
        }
        setWallet(response.data);
      })
      .catch(error => {
        console.error('Error fetching wallet:', error);
      });
  };

  return (
    <Nav.Item>
      <Nav.Link className='mb-1 mt-1 ms-1 me-1' >Wallet Balance: ${wallet}</Nav.Link>
    </Nav.Item>
  );
}

export default Wallet;
