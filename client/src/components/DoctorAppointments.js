import React, { useState, useEffect } from 'react';
import { Table, Form, Button,Modal, FormControl } from 'react-bootstrap';
import axios from 'axios';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState({ date: '', status: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    start_time: '',
    end_time: ''
  });
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);


  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [showUpcomingOnly]); // Added showUpcomingOnly as a dependency


  const handleReschedule = (appointment) => {
    setRescheduleAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleAccept = (appointmentId) => {
    accAppointment(appointmentId);
  };

  const editAppointment = (appointmentId,status, newStartTime, newEndTime) => {
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

  const handleCancelAppointment = (appointmentId) => {
    axios.post(`http://localhost:3100/cancelAppointment/${appointmentId}`)
      .then(response => {
        alert('Appointment canceled successfully');
        fetchAppointments(); // Refresh appointments list
      })
      .catch(error => {
        console.error('Error canceling appointment:', error);
        alert('Error canceling appointment');
      });
  };

  const accAppointment = (appointmentId) => {
    axios.put(`http://localhost:3100/editAppointment/${appointmentId}`, {
      status: "accepted"
    })
    .then(response => {
      setShowRescheduleModal(false);
      fetchAppointments();
    })
    .catch(error => {
      console.error('Error updating appointment:', error);
    });
  };


  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    editAppointment(rescheduleAppointment._id, 'pending', newAppointment.start_time, newAppointment.end_time);
  };

  const fetchAppointments = () => {
    axios.get('http://localhost:3100/getAppointmentsByDoctor/' + localStorage.getItem('userId'))
      .then(response => {
        console.log(response.data);
        const appointmentsData = response.data;
        if (showUpcomingOnly) {
          const upcomingAppointments = appointmentsData.filter(appointment =>
            new Date(appointment.start_time) > new Date()
          );
          setFilteredAppointments(upcomingAppointments);
        } else {
          setFilteredAppointments(appointmentsData);
        }
        setAppointments(appointmentsData);
      })
      .catch(error => {
        console.log(error);
      });
  };


  const toggleUpcomingFilter = () => {
    setShowUpcomingOnly(!showUpcomingOnly);
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
  
  const handleNewAppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    const appointmentData = {
      ...newAppointment,
      date: new Date(), // Setting the date to now
      patient_id: null, // Setting patient to null as per your requirement
      doctor_id: localStorage.getItem('userId')
    };

    axios.post('http://localhost:3100/addAppointment', appointmentData)
      .then(response => {
        console.log(response.data);
        setShowAddModal(false);
        fetchAppointments(); // Refresh appointments
      })
      .catch(error => {
        console.error('Error adding appointment:', error);
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
            <option value="approved">Approved</option>
          </Form.Control>
        </Form.Group>
        <br />
        <Button variant="primary" onClick={applyFilter}>
          Apply Filter
        </Button>
      </Form>
      <br /><br />
      <Button variant="primary" onClick={() => setShowAddModal(true)}>
        Add Appointment
      </Button>
      <br /><br />
      <Button variant="secondary" onClick={toggleUpcomingFilter}>
        {showUpcomingOnly ? 'Show All Appointments' : 'Show Upcoming Appointments'}
      </Button>

      <br /><br />
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
              <td>{appointment.patient_id ? appointment.patient_id.name: '-'}</td>
              <td>{appointment.status}</td>
              <td>
                {appointment.status === 'pending' && (
                  <>
                    <Button variant="primary" onClick={() => handleReschedule(appointment)}>Reschedule</Button>
                    <Button variant="success" onClick={() => handleAccept(appointment._id)}>Accept</Button>
                    <Button variant="danger" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</Button>

                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAppointment}>
            <Form.Group className="mb-3">
              <Form.Label>Start Time:</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start_time"
                value={newAppointment.start_time}
                onChange={handleNewAppointmentChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time:</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end_time"
                value={newAppointment.end_time}
                onChange={handleNewAppointmentChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
    </div>
  );
}

export default DoctorAppointments;
