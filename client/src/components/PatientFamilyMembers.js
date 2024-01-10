import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function PatientFamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentFamilyMember, setCurrentFamilyMember] = useState(null);

  const fetchFamilyMembers = () => {
    // Replace with your actual API endpoint
    axios.get('http://localhost:3100/getFamilyMembers/' + localStorage.getItem('userId'))
      .then(response => {
        setFamilyMembers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const familyMemberData = Object.fromEntries(formData.entries());

    if (currentFamilyMember) {
      axios.put(`http://localhost:3100/editFamilyMember/${currentFamilyMember._id}`, familyMemberData)
        .then(() => {
          fetchFamilyMembers();
          setShowModal(false);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log(familyMemberData);
      axios.post('http://localhost:3100/addFamilyMember/'+localStorage.getItem('userId'), familyMemberData)
        .then(() => {
          fetchFamilyMembers();
          setShowModal(false);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const openModal = (familyMember = null) => {
    setCurrentFamilyMember(familyMember);
    setShowModal(true);
  };

  useEffect(() => {
    fetchFamilyMembers();
  }
  , []);

  return (
    <div>
      <Button onClick={() => openModal()}>Add Family Member</Button>
      <br /><br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>National ID</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Relation</th>
          </tr>
        </thead>
        <tbody>
          {familyMembers.map((member, index) => (
            <tr key={index}>
              <td>{member.name}</td>
              <td>{member.nationalId}</td>
              <td>{member.age}</td>
              <td>{member.gender}</td>
              <td>{member.relation}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Family Member */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentFamilyMember ? 'Edit Family Member' : 'Add Family Member'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                required
                defaultValue={currentFamilyMember ? currentFamilyMember.name : ''}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>National ID</Form.Label>
              <Form.Control
                type="text"
                name="nationalId"
                required
                defaultValue={currentFamilyMember ? currentFamilyMember.nationalID : ''}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                required
                min="0"
                defaultValue={currentFamilyMember ? currentFamilyMember.age : ''}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                required
                defaultValue={currentFamilyMember ? currentFamilyMember.gender : ''}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Relation</Form.Label>
              <Form.Control
                as="select"
                name="relation"
                required
                defaultValue={currentFamilyMember ? currentFamilyMember.relation : ''}
              >
                <option value="">Select relation</option>
                <option value="wife">Wife</option>
                <option value="husband">Husband</option>
                <option value="children">Children</option>
              </Form.Control>
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              {currentFamilyMember ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PatientFamilyMembers;
