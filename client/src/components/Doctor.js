import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Modal, Button } from 'react-bootstrap';
import {
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import DoctorEdit from './DoctorEdit';
import DoctorAppointments from './DoctorAppointments';
import DoctorPatients from './DoctorPatients';
import Logout from './Logout';
import ChangePasswordClinic from './ChangePaswwordClinic';
import axios from 'axios';
import Wallet from './Wallet';
import DoctorPrescriptions from './DoctorPrescriptions';
import Chat from './Chat';
import Notifications from './notifications';
// Import your doctor components here
// import DoctorPatients from './DoctorPatients';
// import DoctorAppointments from './DoctorAppointments';


function Doctor() {

  const [showContractModal, setShowContractModal] = useState(false);
  const doctorId = localStorage.getItem('userId'); // Replace with actual doctor ID logic

  const handleAcceptContract = () => {
    axios.post(`http://localhost:3100/acceptContract/${doctorId}`)
      .then(response => {
        console.log('Contract accepted:', response.data);
        // handle response
      })
      .catch(error => {
        console.log('Error accepting contract:', error);
        // handle error
      });

    setShowContractModal(false);
  };


  return (
    <Container fluid className="h-100 p-0">
      <Navbar bg="light" variant="light" className="mb-4">
        <Navbar.Brand style={{ marginLeft: "15px" }}><img src="/icon.png" style={{ height: "20px", marginRight: "10px", marginBottom: "2px" }} />El7a2ny Virtual Clinic - Doctor</Navbar.Brand>
      </Navbar>

      <Row className="h-100">
        <Col md={3} className="bg-light h-100">
          <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/doctor/home">
            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/doctor/edit">Edit My Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/doctor/appointments">Appointments</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/doctor/patients">Patients</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/doctor/prescriptions">Prescriptions</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="https://meet.google.com/">Video Chat</Nav.Link>
            </Nav.Item>


            <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/doctor/chat">Chat</Nav.Link>

            <Nav.Item>
              <Nav.Link className='mb-1 mt-1 ms-1 me-1'  onClick={() => setShowContractModal(true)}>View Contract</Nav.Link>
            </Nav.Item>

            <Wallet></Wallet>
            <Notifications></Notifications>

            <ChangePasswordClinic></ChangePasswordClinic>
            <Logout></Logout>
            {/* ... Other doctor routes can go here */}
          </Nav>
        </Col>

        <Col md={9} className="h-100">
          <Routes>
            <Route path="edit" element={<DoctorEdit />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="chat" element={<Chat />} />

            {/* <Route path="patients" element={<DoctorPatients />} />
              <Route path="appointments" element={<DoctorAppointments />} /> */}
            {/* ... Other doctor components can go here */}
            {/* <Route path="*" element={<h1>Doctor 404 Not Found</h1>} /> */}
          </Routes>
        </Col>
      </Row>

      {/* Contract Modal */}
      <Modal show={showContractModal} onHide={() => setShowContractModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Professional Services Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This Professional Services Contract ("Contract") is entered into by and between El7a2ny Virtual Clinic ("Clinic") and the undersigned Doctor ("Contractor").</p>
          <p>The Contractor agrees to provide medical services as per the terms and conditions set forth in this Contract. The Clinic will compensate the Contractor for services rendered, including an agreed-upon markup to ensure Clinic profitability. Which is 20% of net income generated using our service.</p>
          {/* Add more contract details as necessary */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContractModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAcceptContract}>
            Accept Contract
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}


export default Doctor;