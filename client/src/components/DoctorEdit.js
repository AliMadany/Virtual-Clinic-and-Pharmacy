import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

function DoctorEdit() {
  const doctorId = '65403c8f73f5c8ad755975b3';
  const [doctorInfo, setDoctorInfo] = useState({
    email: '',
    hourly_rate: '',
    affiliation: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3100/getDoctorById/${doctorId}`)
      .then(response => {
        setDoctorInfo(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [doctorId]);

  const handleInputChange = (e) => {
    setDoctorInfo({ ...doctorInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3100/editDoctorDetails/${doctorId}`, doctorInfo)
      .then(() => {
        setSuccessMessage('Doctor information updated successfully!');
      })
      .catch(error => {
        setErrorMessage('Failed to update doctor information.');
        console.log(error);
      });
  };

  return (
    <div>
      <h2>Edit Doctor Information</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            required
            value={doctorInfo.email}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Hourly Rate</Form.Label>
          <Form.Control
            type="number"
            name="hourly_rate"
            required
            value={doctorInfo.hourly_rate}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Affiliation</Form.Label>
          <Form.Control
            type="text"
            name="affiliation"
            required
            value={doctorInfo.affiliation}
            onChange={handleInputChange}
          />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit">
          Update Doctor
        </Button>
      </Form>
    </div>
  );
}

export default DoctorEdit;
