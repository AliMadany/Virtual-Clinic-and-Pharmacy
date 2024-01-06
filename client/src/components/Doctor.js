import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
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
// Import your doctor components here
// import DoctorPatients from './DoctorPatients';
// import DoctorAppointments from './DoctorAppointments';

function Doctor() {
    return (
      <Container fluid className="h-100 p-0">
        <Navbar bg="light" variant="light" className="mb-4">
        <Navbar.Brand style={{marginLeft:"15px"}}><img src="/icon.png" style={{height:"20px", marginRight:"10px", marginBottom:"2px"}} />El7a2ny Virtual Clinic - Doctor</Navbar.Brand>
        </Navbar>
        
        <Row className="h-100">
          <Col md={3} className="bg-light h-100">
            <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/doctor/home">
              <Nav.Item>
                <Nav.Link as={Link} to="/doctor/edit">Edit My Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/doctor/appointments">Appointments</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/doctor/patients">Patients</Nav.Link>
              </Nav.Item>
              <Logout></Logout>
              {/* ... Other doctor routes can go here */}
            </Nav>
          </Col>
          
          <Col md={9} className="h-100">
            <Routes>
            <Route path="edit" element={<DoctorEdit />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
          
              {/* <Route path="patients" element={<DoctorPatients />} />
              <Route path="appointments" element={<DoctorAppointments />} /> */}
              {/* ... Other doctor components can go here */}
              {/* <Route path="*" element={<h1>Doctor 404 Not Found</h1>} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
  

export default Doctor;