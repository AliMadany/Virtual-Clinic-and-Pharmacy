import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { BsTrash } from 'react-icons/bs';

function AdminPatientsClinic() {
  const [patients, setPatients] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3100/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const confirmDeletePatient = (patientId) => {
    setPatientToDelete(patientId);
    setShowConfirmationModal(true);
  };

  const deletePatient = () => {
    axios.delete(`http://localhost:3100/removePatient/${patientToDelete}`)
      .then(() => {
        setPatients(patients.filter(patient => patient._id !== patientToDelete));
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
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td>{patient.username}</td>
              <td className="text-center">
                <BsTrash
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeletePatient(patient._id);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this patient?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deletePatient}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminPatientsClinic;
