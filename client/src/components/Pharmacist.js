
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
import Chat from './Chat';


function Pharmacist() {


  const pharmacistid = localStorage.getItem('userId'); // Replace with actual patient ID mechanism
  const [walletBalance, setWalletBalance] = useState(0);


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
      // Fetch wallet balance when component mounts
    }, []); // Fetch addresses when component mounts




    return (
      <Container fluid className="h-100 p-0">
        <Navbar bg="light" variant="light" className="mb-4">
          <Navbar.Brand style={{marginLeft:"15px"}}><img src="/icon.png" style={{height:"20px", marginRight:"10px", marginBottom:"2px"}} />El7a2ny Pharmacy - Pharmacist</Navbar.Brand>
        </Navbar>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        Wallet Balance: ${walletBalance}
      </div>
        <Row className="h-100">
          <Col md={3} className="bg-light h-100">
            <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/admin/home">
              <Nav.Item>
                <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/pharmacist/medicines">Medicines</Nav.Link>
              </Nav.Item>
              <Nav.Item>
               <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/Pharmacist/sales">Sales</Nav.Link>
              </Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/Pharmacist/chat">Chat</Nav.Link>




              <ChangePassword></ChangePassword>
              <Logout> </Logout>
            
              {/* ... Other admin routes can go here */}
            </Nav>
          </Col>
          
          <Col md={9} className="h-100">
            <Routes>
              <Route path="medicines" element={<Medicines role="pharmacist"/>} />
              <Route path="sales" element={<SalesReport />} />
              <Route path="chat" element={<Chat />} />

              {/* ... Other admin components can go here */}
              {/* <Route path="*" element={<h1>Pharmacist 404 Not Found</h1>} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
  

export default Pharmacist;
