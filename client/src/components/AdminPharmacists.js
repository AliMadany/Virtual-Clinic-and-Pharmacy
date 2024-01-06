import React, { useEffect, useState } from 'react';
import { Table, Button, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';
import { BsTrash } from 'react-icons/bs';

function AdminPharmacists() {
  const [pharmacists, setPharmacists] = useState([]);
  const [pendingPharmacists, setPendingPharmacists] = useState([]);
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pharmacistToDelete, setPharmacistToDelete] = useState(null);
  const [filter, setFilter] = useState('Existing');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (filter === 'Existing') {
      axios.get('http://localhost:3000/pharmacists')
        .then(response => {
          setPharmacists(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios.get('http://localhost:3000/getPendingPharmacists')
        .then(response => {
          setPendingPharmacists(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [filter]);

  const confirmDeletePharmacist = (pharmacistId) => {
    setPharmacistToDelete(pharmacistId);
    setShowConfirmationModal(true);
  };

  const deletePharmacist = () => {
    axios.delete(`http://localhost:3000/removePharmacist/${pharmacistToDelete}`)
      .then(() => {
        setPharmacists(pharmacists.filter(pharmacist => pharmacist._id !== pharmacistToDelete));
        setShowConfirmationModal(false);
      })
      .catch(error => {
        console.log(error);
        setShowConfirmationModal(false);
      });
  };


  const acceptPharmacist = (pharmacistId) => {
    axios.put(`http://localhost:3000/acceptPharmacist/${pharmacistId}`)
      .then(() => {
        setPendingPharmacists(pendingPharmacists.filter(pharmacist => pharmacist._id !== pharmacistId));
        setSuccessMessage('Pharmacist accepted successfully');
        setShowSuccessModal(true);
      })
      .catch(error => console.log(error));
  };

  const rejectPharmacist = (pharmacistId) => {
    axios.put(`http://localhost:3000/rejectPharmacist/${pharmacistId}`)
      .then(() => {
        setPendingPharmacists(pendingPharmacists.filter(pharmacist => pharmacist._id !== pharmacistId));
        setSuccessMessage('Pharmacist rejected successfully');
        setShowSuccessModal(true);
      })
      .catch(error => console.log(error));
  };

  const handleRowClick = (pharmacist) => {
    setSelectedPharmacist(pharmacist);
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

      {/* Display Pharmacists Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(filter === 'Existing' ? pharmacists : pendingPharmacists).map((pharmacist, index) => (
            <tr key={index}>
              <td onClick={() => handleRowClick(pharmacist)}>{pharmacist.name}</td>
              {filter === 'Existing' ? (
                <td className="text-center">
                  <BsTrash
                    onClick={(e) => {
                      e.stopPropagation(); // This prevents the click from reaching the row
                      confirmDeletePharmacist(pharmacist._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
              ) : (
                <td className="text-center">
                  <Button variant="success" onClick={() => acceptPharmacist(pharmacist._id)}>Accept</Button>
                  {' '}
                  <Button variant="danger" onClick={() => rejectPharmacist(pharmacist._id)}>Reject</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for displaying pharmacist details */}
      <Modal show={selectedPharmacist !== null} onHide={() => setSelectedPharmacist(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Pharmacist Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPharmacist && (
            <div>
              <p>Name: {selectedPharmacist.name}</p>
              <p>Email: {selectedPharmacist.email}</p>
              <p>Username: {selectedPharmacist.username}</p>
              <p>Date of Birth: {selectedPharmacist.date_of_birth}</p>
              <p>Hourly Rate: {selectedPharmacist.hourly_rate}</p>
              <p>Affiliation: {selectedPharmacist.affiliation}</p>
              <p>Educational Background: {selectedPharmacist.education}</p>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedPharmacist(null)}>
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
          Are you sure you want to delete this pharmacist?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deletePharmacist}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Action Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminPharmacists;
