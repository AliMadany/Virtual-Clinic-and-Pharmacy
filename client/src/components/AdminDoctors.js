import React, { useEffect, useState } from 'react';
import { Table, Button, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';
import { BsTrash } from 'react-icons/bs';

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [filter, setFilter] = useState('Existing');

  useEffect(() => {
    if (filter === 'Existing') {
      axios.get('http://localhost:3100/doctors')
        .then(response => {
          setDoctors(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios.get('http://localhost:3100/getPendingDoctors')
        .then(response => {
          setPendingDoctors(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [filter]);

  const confirmDeleteDoctor = (doctorId) => {
    setDoctorToDelete(doctorId);
    setShowConfirmationModal(true);
  };

  const deleteDoctor = () => {
    axios.delete(`http://localhost:3100/removeDoctor/${doctorToDelete}`)
      .then(() => {
        setDoctors(doctors.filter(doctor => doctor._id !== doctorToDelete));
        setShowConfirmationModal(false);
      })
      .catch(error => {
        console.log(error);
        setShowConfirmationModal(false);
      });
  };


  const acceptDoctor = (event, doctorId) => {
    event.stopPropagation(); // This stops the event from propagating to the row click handler

    axios.put(`http://localhost:3100/acceptDoctor/${doctorId}`)
      .then(() => {
        // Update the UI accordingly, e.g., remove the doctor from pendingDoctors
        setPendingDoctors(pendingDoctors.filter(doctor => doctor._id !== doctorId));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const rejectDoctor = (event, doctorId) => {
    event.stopPropagation(); // This stops the event from propagating to the row click handler

    axios.put(`http://localhost:3100/rejectDoctor/${doctorId}`)
      .then(() => {
        // Update the UI accordingly, e.g., remove the doctor from pendingDoctors
        setPendingDoctors(pendingDoctors.filter(doctor => doctor._id !== doctorId));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleRowClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <div>
      {/* Filter Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {filter}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setFilter('Existing')}>Existing</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <br />

      {/* Display Doctors Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            {filter === 'Existing' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {(filter === 'Existing' ? doctors : pendingDoctors).map((doctor, index) => (
            <tr key={index} onClick={() => handleRowClick(doctor)}>
              <td>{doctor.name}</td>
              {filter === 'Existing' ? (
                <td className="text-center">
                  <BsTrash
                    onClick={(e) => {
                      e.stopPropagation(); // This prevents the click from reaching the row
                      confirmDeleteDoctor(doctor._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
              ) : (
                <td className="text-center">
                  <Button variant="success" onClick={(e) => acceptDoctor(e, doctor._id)}>Accept</Button>{' '}
                  <Button variant="danger" onClick={(e) => rejectDoctor(e, doctor._id)}>Reject</Button>

                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for displaying doctor details */}
      <Modal show={selectedDoctor !== null} onHide={() => setSelectedDoctor(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Doctor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <div>
              <p>Name: {selectedDoctor.name}</p>
              <p>Hourly Rate: {selectedDoctor.hourly_rate}</p>
              <p>Affiliation: {selectedDoctor.affiliation}</p>
              <p>Education: {selectedDoctor.education}</p>
              <p>Specialty: {selectedDoctor.specialty}</p>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedDoctor(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this doctor?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteDoctor}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDoctors;
