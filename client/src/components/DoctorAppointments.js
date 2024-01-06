import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState({ date: '', status: '' });

  useEffect(() => {
    fetchAppointments();
    console.log(new Date().toISOString());
  }, []);

  const fetchAppointments = () => {
    // Replace with your actual API endpoint
    axios.get('http://localhost:3100/getAppointmentsByDoctor/65403c8f73f5c8ad755975b3')
      .then(response => {
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    let filtered = appointments;
  
    if (filter.date) {
      filtered = filtered.filter(appointment =>
        new Date(appointment.date).toDateString() === new Date(filter.date).toDateString()
      );
    }
  
    if (filter.status) {
      filtered = filtered.filter(appointment =>
        appointment.status.toLowerCase() === filter.status.toLowerCase()
      );
    }
  
    setFilteredAppointments(filtered);
  };
  

  return (
    <div>
      <h2>Appointments</h2>

      <Form>
        <Form.Group controlId="filterDate">
          <Form.Label>Filter by Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
          />
        </Form.Group>

        <Form.Group controlId="filterStatus">
          <Form.Label>Filter by Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </Form.Control>
        </Form.Group>
        <br />
        <Button variant="primary" onClick={applyFilter}>
          Apply Filter
        </Button>
      </Form>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Patient</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment, index) => (
            <tr key={index}>
              <td>{(appointment.start_time)}</td>
              <td>{(appointment.end_time)}</td>
              <td>{appointment.patient_id.name}</td>
              <td>{appointment.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DoctorAppointments;
