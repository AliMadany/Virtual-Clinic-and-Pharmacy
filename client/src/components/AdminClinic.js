import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
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
import AdminDoctors from './AdminDoctors';
import AdminPatients from './AdminPatients';
import AdminPackages from './AdminPackages';
import Logout from './Logout';
import AdminAdminsClinic from './AdminAdminsClinic';
import AdminPatientsClinic from './AdminPatientsClinic';
import ChangePasswordClinic from './ChangePaswwordClinic';
// import AdminPharmacists from './AdminPharmacists';
// import AdminPatients from './AdminPatients';
// import AdminMedicines from './AdminMedicines';
// import Medicines from './Medicines';

function AdminClinic() {
    return (
      <Container fluid className="h-100 p-0">
        <Navbar bg="light" variant="light" className="mb-4">
          <Navbar.Brand style={{marginLeft:"15px"}}><img src="/icon.png" style={{height:"20px", marginRight:"10px", marginBottom:"2px"}} />El7a2ny Virtual Clinic - Admin</Navbar.Brand>
        </Navbar>
        
        <Row className="h-100">
          <Col md={3} className="bg-light h-100">
            <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/admin/home">
              <Nav.Item>
                <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/admin-clinic/admins">Admins</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/admin-clinic/doctors">Doctors</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/admin-clinic/patients">Patients</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className='mb-1 mt-1 ms-1 me-1'  as={Link} to="/admin-clinic/packages">Health Packages</Nav.Link>
              </Nav.Item>

              <ChangePasswordClinic></ChangePasswordClinic>
              <Logout> </Logout>
              {/* ... Other admin routes can go here */}
            </Nav>
          </Col>
          
          <Col md={9} className="h-100">
            <Routes>
              <Route path="admins" element={<AdminAdminsClinic />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="patients" element={<AdminPatientsClinic />} />
              <Route path="packages" element={<AdminPackages />} />
              {/* <Route path="pharmacists" element={<AdminPharmacists />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="medicines" element={<Medicines />} /> */}
              {/* ... Other admin components can go here */}
              {/* <Route path="*" element={<h1>Admin 404 Not Found</h1>} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
  

export default AdminClinic;
