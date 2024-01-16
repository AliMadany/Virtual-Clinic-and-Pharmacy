
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import {
    Routes,
    Route,
    Link,
    useRoutes,
    Router
} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import AdminAdmins from './AdminAdmins';
import AdminPharmacists from './AdminPharmacists';
import AdminPatients from './AdminPatients';
import AdminMedicines from './AdminMedicines';
import Medicines from './Medicines';
import Logout from './Logout';
import ChangePassword from './ChangePassword';
import SalesReport from './SalesReport'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';





function Pharmacist() {


  const pharmacistid = localStorage.getItem('userId'); // Replace with actual patient ID mechanism
  const [walletBalance, setWalletBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);


  const fetchWalletBalance = () => {
    // Replace with the correct API endpoint and make sure to handle the response correctly
    axios.get(`http://localhost:3000/checkWallet/${pharmacistid}`)
      .then(response => {
        setWalletBalance(response.data); // Assuming 'amount' is the field in the response
      })
      .catch(error => {
        console.error('Error fetching wallet balance:', error);
      });
    }

    useEffect(() => {
      fetchWalletBalance();


      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/getMedNotifications`); 
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
  
      fetchNotifications();
      // Fetch wallet balance when component mounts
    }, []); // Fetch addresses when component mounts




    return (
      <Container fluid className="h-100 p-0">
        <Navbar bg="light" variant="light" className="mb-4">
          <Navbar.Brand style={{marginLeft:"15px"}}><img src="/icon.png" style={{height:"20px", marginRight:"10px", marginBottom:"2px"}} />El7a2ny Pharmacy - Pharmacist</Navbar.Brand>
        </Navbar>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px', display: 'flex', alignItems: 'center' }}>
  <div style={{ marginRight: '20px' }}>
    Wallet Balance: ${walletBalance}
  </div>
  <div className="notification-bell" style={{ position: 'relative' }}>
    <FontAwesomeIcon
      icon={faBell}
      onClick={() => setShowNotifications(!showNotifications)}
    />
    {showNotifications && (
      <div className="notification-dropdown" style={{
        position: 'absolute',
        right: 0,
        top: '100%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        width: '300px',
        zIndex: 1050 // Ensure dropdown is above other elements
      }}>
        <p style={{ padding: '10px', borderBottom: '1px solid #ddd', margin: 0 }}>
          Notifications are:
        </p>
        {notifications.length > 0 ? (
          <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
            {notifications.map((notification, index) => (
              <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {notification.message}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ padding: '10px' }}>No notifications</p>
        )}
      </div>
    )}
  </div>
</div> 
        <Row className="h-100">
          <Col md={3} className="bg-light h-100">
            <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/admin/home">
              <Nav.Item>
                <Nav.Link as={Link} to="/pharmacist/medicines">Medicines</Nav.Link>
              </Nav.Item>
              <Nav.Item>
               <Nav.Link as={Link} to="/Pharmacist/sales">Sales</Nav.Link>
              </Nav.Item>
           




              <ChangePassword></ChangePassword>
              <Logout> </Logout>
            
              {/* ... Other admin routes can go here */}
            </Nav>
          </Col>
          
          <Col md={9} className="h-100">
            <Routes>
              <Route path="medicines" element={<Medicines role="pharmacist"/>} />
              <Route path="sales" element={<SalesReport />} />

              {/* ... Other admin components can go here */}
              {/* <Route path="*" element={<h1>Pharmacist 404 Not Found</h1>} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
  

export default Pharmacist;
