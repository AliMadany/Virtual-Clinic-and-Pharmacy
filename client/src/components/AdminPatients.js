import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { BsTrash } from 'react-icons/bs';

function AdminPatients() {
  // State for the list of patients
  const [patients, setPatients] = useState([]);

  // State for the selected patient
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    // Fetching the list of patients from the server with axios
    axios.get('http://localhost:3000/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Function to handle the deletion confirmation
  const confirmDeletePatient = (patientId) => {
    setPatientToDelete(patientId);
    setShowConfirmationModal(true);
  };

  // Function to actually delete the patient
  const deletePatient = () => {
    axios.delete(`http://localhost:3000/removePatient/${patientToDelete}`)
      .then(() => {
        setPatients(patients.filter(patient => patient._id !== patientToDelete));
        setShowConfirmationModal(false);
      })
      .catch(error => {
        console.log(error);
        setShowConfirmationModal(false);
      });
  };

  // Function to handle row click
  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div>
      {/* Display Patients Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={index} onClick={() => handleRowClick(patient)}>
              <td>{patient.name}</td>
              <td className="text-center">
                <BsTrash
                  onClick={(e) => {
                    e.stopPropagation(); // This prevents the click from reaching the row
                    confirmDeletePatient(patient._id); // Call confirmDeletePatient instead of deletePatient
                  }}
                  style={{ cursor: 'pointer' }}
                />

              </td>

            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for displaying patient details */}
      <Modal show={selectedPatient !== null} onHide={() => setSelectedPatient(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <p>Name: {selectedPatient.name}</p>
              <p>Email: {selectedPatient.email}</p>
              <p>Username: {selectedPatient.username}</p>
              <p>Password: {selectedPatient.password}</p>
              <p>Date of Birth: {selectedPatient.date_of_birth}</p>
              <p>Gender: {selectedPatient.gender}</p>
              <p>Mobile Number: {selectedPatient.mobile_number}</p>
              <p>Emergency Contact:</p>
              <ul>
                <li>Name: {selectedPatient.emergency_contact.name}</li>
                <li>Mobile Number: {selectedPatient.emergency_contact.mobile_number}</li>
                <li>Relation: {selectedPatient.emergency_contact.relation}</li>
              </ul>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedPatient(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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

export default AdminPatients;
