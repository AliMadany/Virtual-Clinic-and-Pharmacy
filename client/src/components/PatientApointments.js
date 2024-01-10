import React, { useState, useEffect } from 'react';
import { Table, Form, Button,Modal, FormControl } from 'react-bootstrap';
import axios from 'axios';

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState({ date: '', status: '', doctor: '', showUserAppointments: 'all' });
  const [doctors, setDoctors] = useState([]);
  const userId = localStorage.getItem('userId');

  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    start_time: '',
    end_time: ''
  });

  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpDetails, setFollowUpDetails] = useState({
    start_time: '',
    end_time: '',
    originalAppointmentId: ''
  });

  // ... existing useEffect and functions ...

  const handleShowFollowUp = (appointment) => {
    setFollowUpDetails({ ...followUpDetails, originalAppointmentId: appointment._id, doctor_id: appointment.doctor_id  });
    setShowFollowUpModal(true);
  };

  const handleFollowUpChange = (e) => {
    const { name, value } = e.target;
    setFollowUpDetails({ ...followUpDetails, [name]: value });
  };

  const handleScheduleFollowUp = () => {
    // Add logic to schedule follow-up appointment using backend endpoint
    axios.post('http://localhost:3100/addAppointment', {
      patient_id: userId,
      start_time: followUpDetails.start_time,
      end_time: followUpDetails.end_time,
      doctor_id: followUpDetails.doctor_id._id,
      date: Date.now()
    }).then(response => {
      alert('Follow up scheduled successfully!');
      setShowFollowUpModal(false);
      fetchAppointments();
    }).catch(error => {
      console.error('Error scheduling follow up:', error);
    });
  };

  const handleNewAppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

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
        if (!appointment.patient_id) {
          return false;
        }
        return new Date(appointment.start_time) > new Date() && appointment.patient_id && appointment.patient_id == userId
      }
      );
    } else if (filter.showUserAppointments === 'past') {
      filtered = filtered.filter(appointment =>
        new Date(appointment.start_time) < new Date() && appointment.patient_id && appointment.patient_id == userId
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelAppointment = (appointmentId) => {
    axios.post(`http://localhost:3100/cancelAppointment/${appointmentId}`, {
      user: 'patient'
    })
      .then(response => {
        alert('Appointment canceled successfully');
        fetchAppointments(); // Refresh appointments list
      })
      .catch(error => {
        console.error('Error canceling appointment:', error);
        alert('Error canceling appointment');
      });
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

  const handleReschedule = (appointment) => {
    setRescheduleAppointment(appointment);
    setShowRescheduleModal(true);
  };


  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    editAppointment(rescheduleAppointment._id, 'pending', newAppointment.start_time, newAppointment.end_time);
  };

  const editAppointment = (appointmentId, status, newStartTime, newEndTime) => {
    axios.put(`http://localhost:3100/editAppointment/${appointmentId}`, {
      // patient_id: rescheduleAppointment.patient_id,
      // doctor_id: localStorage.getItem('userId'),
      // date: newStartTime ? new Date(newStartTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      start_time: newStartTime || rescheduleAppointment.start_time,
      end_time: newEndTime || rescheduleAppointment.end_time,
      status: status
    })
      .then(response => {
        setShowRescheduleModal(false);
        fetchAppointments();
      })
      .catch(error => {
        console.error('Error updating appointment:', error);
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
                {appointment.status === 'pending' && (
                  <>

                    <Button variant="primary" onClick={() => handleReschedule(appointment)}>Reschedule</Button>

                    <Button variant="danger" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</Button>

                  </>
                )}
                                {new Date(appointment.end_time) < new Date() && (
                  <Button variant="secondary" onClick={() => handleShowFollowUp(appointment)}>Schedule a Follow-Up</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Reschedule Appointment Modal */}
      <Modal show={showRescheduleModal} onHide={() => setShowRescheduleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reschedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRescheduleSubmit}>
            <Form.Group>
              <Form.Label>New Start Time:</Form.Label>
              <FormControl
                type="datetime-local"
                name="start_time"
                value={newAppointment.start_time}
                onChange={handleNewAppointmentChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New End Time:</Form.Label>
              <FormControl
                type="datetime-local"
                name="end_time"
                value={newAppointment.end_time}
                onChange={handleNewAppointmentChange}
                required
              />
            </Form.Group>
            <Button type="submit">Reschedule</Button>
          </Form>
        </Modal.Body>
      </Modal>

           {/* Follow Up Modal */}
           <Modal show={showFollowUpModal} onHide={() => setShowFollowUpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule a Follow-Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>New Start Time:</Form.Label>
              <FormControl
                type="datetime-local"
                name="start_time"
                value={followUpDetails.start_time}
                onChange={handleFollowUpChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New End Time:</Form.Label>
              <FormControl
                type="datetime-local"
                name="end_time"
                value={followUpDetails.end_time}
                onChange={handleFollowUpChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFollowUpModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleScheduleFollowUp}>Schedule Follow-Up</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PatientAppointments;
