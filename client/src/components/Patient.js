import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Form, Button, Modal } from 'react-bootstrap';
import {
  Routes,
  Route,
  Link,
  useRoutes,
  Router
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import AdminAdmins from './AdminAdmins';
import AdminPharmacists from './AdminPharmacists';
import AdminPatients from './AdminPatients';
import AdminMedicines from './AdminMedicines';
import Medicines from './Medicines';
import PatientPrescriptions from './PatientPrescriptions';
import Logout from './Logout';
import ChangePassword from './ChangePassword';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';


function Patient() {
  const [showModalAddress, setShowModalAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [showModalOrders, setShowModalOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const patientId = localStorage.getItem('userId'); // Replace with actual patient ID mechanism
  const [walletBalance, setWalletBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);


  

  const fetchWalletBalance = () => {  
    // Replace with the correct API endpoint and make sure to handle the response correctly
    axios.get(`http://localhost:3000/checkWallet/${patientId}`)
      .then(response => {
        setWalletBalance(response.data); // Assuming 'amount' is the field in the response
      })
      .catch(error => {
        console.error('Error fetching wallet balance:', error);
      });
    }


  const fetchOrders = () => {
    axios.get(`http://localhost:3000/getOrders/${patientId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  const cancelOrder = (orderId) => {
    axios.put(`http://localhost:3000/cancelOrder/${orderId}`)
      .then(() => {
        fetchOrders(); // Refresh the orders list
      })
      .catch(error => console.error('Error cancelling order:', error));
  };

  const renderOrderItem = (order) => (
    <div key={order._id}>
      <p>Order ID: {order._id}</p>
      <p>Address: {order.address}</p>
      <p>Date: {order.date}</p>
      <p>Status: {order.status}</p>
      <p>Amount: ${order.amount.toFixed(2)}</p>
      {/* Render each item in the order */}
      {order.items.map((item, idx) => (
        <div key={idx}>
          <span>{item.name} - {item.quantity} x ${item.price.toFixed(2)}</span>
        </div>
      ))}
      {order.status === 'pending' && (
        <Button onClick={() => cancelOrder(order._id)}>Cancel Order</Button>
      )}
    </div>
  );
  

  useEffect(() => {
    fetchAddresses(); 
    fetchWalletBalance()

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getMedNotifications`); // Replace with your actual API endpoint
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Fetch wallet balance when component mounts
  }, []); // Fetch addresses when component mounts

  


  const fetchAddresses = () => {
    axios.get(`http://localhost:3000/getAddresses/${patientId}`)
      .then(response => {
        setAddresses(response.data);
      })
      .catch(error => console.error('Error fetching addresses:', error));
  };

  const handleAddAddress = () => {
    axios.post(`http://localhost:3000/addAddress/${patientId}`, { address: newAddress })
      .then(() => {
        fetchAddresses(); // Fetch addresses again to update the list
        setNewAddress(''); // Reset new address input
        setShowModalAddress(false); // Close modal
      })
      .catch(error => console.error('Error adding address:', error));
  };

 




  return (
    <Container fluid className="h-100 p-0">
      <Navbar bg="light" variant="light" className="mb-4">
        <Navbar.Brand style={{ marginLeft: "15px" }}><img src="/icon.png" style={{ height: "20px", marginRight: "10px", marginBottom: "2px" }} />El7a2ny Pharmacy - Patient</Navbar.Brand>
      </Navbar>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px', display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '20px' }}>
        Wallet Balance: ${walletBalance}
      </div>
      <div className="notification-bell">
        <FontAwesomeIcon
          icon={faBell}
          onClick={() => setShowNotifications(!showNotifications)}
        />
        {showNotifications && (
          <div className="notification-dropdown">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification, index) => (
                  <li key={index}>{notification.message}</li>
                ))}
              </ul>
            ) : (
              <p>No notifications</p>
            )}
          </div>
        )}
      </div>
    </div>
      <Row className="h-100">
        <Col md={3} className="bg-light h-100">
          <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/admin/home">

            <Nav.Item>
              <Nav.Link as={Link} to="/patient/medicines">Medicines</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Button onClick={() => setShowModalAddress(true)}>Manage My Addresses</Button>
            </Nav.Item>
            <Nav.Item>
              <Button onClick={() => { setShowModalOrders(true); fetchOrders(); }}>Orders</Button>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/patient/PatientPrescriptions">Prescriptions</Nav.Link>
            </Nav.Item>
            

            <ChangePassword></ChangePassword>
            <Logout> </Logout>

            {/* ... Other admin routes can go here */}
          </Nav>
        </Col>

        <Col md={9} className="h-100">
          <Routes>
            <Route path="medicines" element={<Medicines role="patient" />} />
            <Route path="PatientPrescriptions" element={<PatientPrescriptions role="Patient" />} />
            



            {/* ... Other admin components can go here */}
            {/* <Route path="*" element={<h1>Patient 404 Not Found</h1>} /> */}
          </Routes>
        </Col>
      </Row>

      {/* Address Management Modal */}

      <Modal show={showModalAddress} onHide={() => setShowModalAddress(false)}>

        <Modal.Header closeButton>
          <Modal.Title>Manage Addresses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {addresses.map((address, index) => (
              <li key={index}>{address.address}</li>
            ))}
          </ul>
          <Form onSubmit={(e) => { e.preventDefault(); handleAddAddress(); }}>
            <Form.Group>
              <Form.Label>New Address</Form.Label>
              <Form.Control
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter new address"
                required
              />
            </Form.Group>
            <Button type="submit">Add Address</Button>
          </Form>
          <br />


        </Modal.Body>
      </Modal>

            {/* Orders Modal */}
            <Modal show={showModalOrders} onHide={() => setShowModalOrders(false)}>
        <Modal.Header closeButton>
          <Modal.Title>My Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orders.map(renderOrderItem)}
        </Modal.Body>
      </Modal>

    </Container>
  );
}


export default Patient;
