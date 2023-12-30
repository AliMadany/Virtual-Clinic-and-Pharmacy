import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { BsTrash } from 'react-icons/bs';

function AdminAdminsClinic() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3100/admins')
      .then(response => {
        setAdmins(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const addAdmin = () => {
    axios.post('http://localhost:3100/addAdmin', newAdmin)
      .then(response => {
        setAdmins([...admins, response.data]); // Assuming response.data is the added admin
        setShowModal(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const confirmDeleteAdmin = (adminId) => {
    setAdminToDelete(adminId);
    setShowConfirmationModal(true);
  };

  const deleteAdmin = () => {
    axios.delete(`http://localhost:3100/removeAdmin/${adminToDelete}`)
      .then(() => {
        setAdmins(admins.filter(admin => admin._id !== adminToDelete));
        setShowConfirmationModal(false);
      })
      .catch(error => {
        console.log(error);
        setShowConfirmationModal(false);
      });
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.username}</td>
              <td className="text-center">
                <BsTrash
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteAdmin(admin._id);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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

      {/* Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this admin?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAdmin}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminAdminsClinic;

