import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import {
    Routes,
    Route,
    Link,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import PatientDoctors from './PatientDoctors';
import PatiePtprescriptions from './PatientPrescriptions';
import PatientPrescriptions from './PatientPrescriptions';
import PatientFamilyMembers from './PatientFamilyMembers';
import PatientAppointments from './PatientApointments';
import PatientMedicalHistory from './PatientMedicalHistory';
import PatientPackages from './PatientPackages';

import Logout from './Logout';
import ChangePasswordClinic from './ChangePaswwordClinic';
import Wallet from './Wallet';
// Import your doctor components here
// import DoctorPatients from './DoctorPatients';
// import DoctorAppointments from './DoctorAppointments';

function PatientClinic() {
    return (
      <Container fluid className="h-100 p-0">
        <Navbar bg="light" variant="light" className="mb-4">
        <Navbar.Brand style={{marginLeft:"15px"}}><img src="/icon.png" style={{height:"20px", marginRight:"10px", marginBottom:"2px"}} />El7a2ny Virtual Clinic - Patient</Navbar.Brand>
        </Navbar>
        
        <Row className="h-100">
          <Col md={3} className="bg-light h-100">
            <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/doctor/home">
              <Nav.Item>
                <Nav.Link as={Link} to="/patient-clinic/doctors">Doctors</Nav.Link>
                <Nav.Link as={Link} to="/patient-clinic/prescriptions">Prescriptions</Nav.Link>
                <Nav.Link as={Link} to="/patient-clinic/family-members">Family Members</Nav.Link>
                <Nav.Link as={Link} to="/patient-clinic/appointments">Appointments</Nav.Link>
                <Nav.Link as={Link} to="/patient-clinic/Patient-Packages">Health Pakages</Nav.Link>
                <Nav.Link as={Link} to="/patient-clinic/medical-history">Medical History</Nav.Link>

              


              </Nav.Item>

              <Wallet></Wallet>

              <ChangePasswordClinic></ChangePasswordClinic>
              <Logout> </Logout>
              {/* ... Other doctor routes can go here */}
            </Nav>
          </Col>
          
          <Col md={9} className="h-100">
            <Routes>
            <Route path="doctors" element={<PatientDoctors />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="family-members" element={<PatientFamilyMembers />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="medical-history" element={<PatientMedicalHistory />} />
            <Route path="Patient-Packages" element={<PatientPackages />} />

            
              {/* <Route path="patients" element={<DoctorPatients />} />
            //   <Route path="appointments" element={<DoctorAppointments />} /> */}
              {/* ... Other doctor components can go here */}
              {/* <Route path="*" element={<h1>Doctor 404 Not Found</h1>} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    );






  }
  

export default PatientClinic;