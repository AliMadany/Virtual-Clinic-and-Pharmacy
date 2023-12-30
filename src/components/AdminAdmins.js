import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

function AdminAdmins() {
  // Sample state for the list of admins
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Fetching the list of admins from the server with axios
    axios.get('http://localhost:3000/admins')
      .then(response => {
        setAdmins(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  }

  , []);

  // State for the modal form
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });

  // Handling adding a new admin

  const addAdmin = () => {
    axios.post('http://localhost:3000/addAdmin', newAdmin)
      .then(response => {
        setAdmins([...admins, newAdmin]);
        setShowModal(false);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div>
      {/* Display Admins Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={index}>
              <td>{admin.username}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Button to open the modal */}
      <Button onClick={() => setShowModal(true)}>Add Admin</Button>

      {/* Modal for adding a new admin */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" 
                            value={newAdmin.username} 
                            onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" 
                            value={newAdmin.password} 
                            onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addAdmin}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminAdmins;
