import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, FormControl } from 'react-bootstrap';
import axios from 'axios';

function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get('http://localhost:3100/getPatientsByAppointments/65403c8f73f5c8ad755975b3')
      .then(response => {
        setPatients(response.data);
        setFilteredPatients(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    if (searchTerm) {
      setFilteredPatients(patients.filter(patient =>
        patient.username.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredPatients(patients);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const filterUpcomingAppointments = () => {
    axios.get('http://localhost:3100/getPatientsByUpcomingAppointments/65403c8f73f5c8ad755975b3')
      .then(response => {
        setFilteredPatients(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <FormControl
        type="text"
        placeholder="Search by username"
        onChange={handleSearchChange}
        style={{ marginBottom: '10px' }}
      />
      <Button onClick={filterUpcomingAppointments} style={{ marginBottom: '10px' }}>
        Filter by Upcoming Appointments
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient, index) => (
            <tr key={index}>
              <td>{patient.username}</td>
              <td>
                <Button onClick={() => handlePatientClick(patient)}>View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <p><strong>Username:</strong> {selectedPatient.username}</p>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Date of Birth:</strong> {selectedPatient.date_of_birth}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Mobile Number:</strong> {selectedPatient.mobile_number}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorPatients;
