import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState({ date: '', status: '', doctor: '', showUserAppointments: 'all' });
  const [doctors, setDoctors] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = () => {
    axios.get('http://localhost:3100/getAppointments')
      .then(response => {
        setAppointments(response.data);
        applyAllFilters(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchDoctors = () => {
    axios.get('http://localhost:3100/doctors')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  };

  const applyAllFilters = (appointmentsData) => {
    let filtered = [...appointmentsData]; // Clone the array to avoid direct state mutation

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

    if (filter.doctor) {
      filtered = filtered.filter(appointment =>
        appointment.doctor_id._id === filter.doctor
      );
    }

    if (filter.showUserAppointments === 'upcoming') {
      console.log(filtered)
      filtered = filtered.filter((appointment) => {
        if(!appointment.patient_id){
          return false;
        }
        return new Date(appointment.start_time) > new Date() && appointment.patient_id  && appointment.patient_id == userId 
      }
      );
    } else if (filter.showUserAppointments === 'past') {
      filtered = filtered.filter(appointment =>
        new Date(appointment.start_time) < new Date()  && appointment.patient_id  && appointment.patient_id == userId
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    applyAllFilters(appointments);
  };

  const handlePayment = (appointmentId, paymentType) => {
    axios.put(`http://localhost:3100/selectAppointment/${localStorage.getItem('userId')}`, {
      appointment_id: appointmentId,
      payment_type: paymentType
    })
      .then(response => {
        if (paymentType === "card") {
          window.location.href = response.data.url; // Redirect to payment URL for card payments
        } else {
          alert("Paid with Wallet");
          fetchAppointments(); // Refresh appointments after payment
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error processing payment");
      });
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
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="free">Free</option>


          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterDoctor">
          <Form.Label>Filter by Doctor</Form.Label>
          <Form.Control
            as="select"
            name="doctor"
            value={filter.doctor}
            onChange={handleFilterChange}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc, index) => (
              <option key={index} value={doc._id}>{doc.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterUserAppointments">
          <Form.Label>Filter Your Appointments</Form.Label>
          <Form.Control
            as="select"
            name="showUserAppointments"
            value={filter.showUserAppointments}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </Form.Control>
        </Form.Group>

        <br />
        <Button variant="primary" onClick={applyFilter}>
          Apply Filter
        </Button>

        {/* <Button variant="secondary" onClick={toggleUpcomingFilter}>
          {showUpcomingOnly ? 'Show All Appointments' : 'Show Upcoming Appointments'}
        </Button> */}
      </Form>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Doctor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment, index) => (
            <tr key={index}>
              <td>{(appointment.start_time)}</td>
              <td>{(appointment.end_time)}</td>
              <td>{appointment.doctor_id.name}</td>
              <td>{appointment.status}</td>
              <td>
                {appointment.status === 'free' && (
                  <>
                    <Button variant="success" onClick={() => handlePayment(appointment._id, 'wallet')}>Pay with Wallet</Button>{' '}
                    <Button variant="primary" onClick={() => handlePayment(appointment._id, 'card')}>Pay with Card</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PatientAppointments;
