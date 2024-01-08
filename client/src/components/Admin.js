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
import AdminPharmacists from './AdminPharmacists';
import AdminPatients from './AdminPatients';
import AdminMedicines from './AdminMedicines';
import Medicines from './Medicines';
import Logout from './Logout';
import ChangePassword from './ChangePassword';
import SalesReport from './SalesReport'; 


function Admin() {
    return (
      <Container fluid className="h-100 p-0">
        <Navbar bg="light" variant="light" className="mb-4">
          <Navbar.Brand style={{marginLeft:"15px"}}><img src="/icon.png" style={{height:"20px", marginRight:"10px", marginBottom:"2px"}} />El7a2ny Pharmacy - Admin</Navbar.Brand>
        </Navbar>
        
        <Row className="h-100">
          <Col md={3} className="bg-light h-100">
            <Nav className="flex-column mt-3" variant="pills" defaultActiveKey="/admin/home">
              <Nav.Item>
                <Nav.Link as={Link} to="/admin/admins">Admins</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/admin/pharmacists">Pharmacists</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/admin/patients">Patients</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/admin/medicines">Medicines</Nav.Link>
              </Nav.Item>
              <Nav.Item>
               <Nav.Link as={Link} to="/admin/sales">Sales</Nav.Link>
              </Nav.Item>





              <ChangePassword></ChangePassword>
              <Logout> </Logout>
              {/* ... Other admin routes can go here */}
            </Nav>
          </Col>
          
          <Col md={9} className="h-100">
            <Routes>
              <Route path="admins" element={<AdminAdmins />} />
              <Route path="pharmacists" element={<AdminPharmacists />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="medicines" element={<Medicines role="admin"/>} />
              <Route path="sales" element={<SalesReport />} />
              {/* ... Other admin components can go here */}
              {/* <Route path="*" element={<h1>Admin 404 Not Found</h1>} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    );
  }
  

export default Admin;
