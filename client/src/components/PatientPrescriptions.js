import React, { useEffect, useState } from 'react';
import { Table, Form, FormControl } from 'react-bootstrap';
import axios from 'axios';

function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3100/getPrescriptionsByPatient/' + localStorage.getItem('userId'))
      .then(response => {
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
    filterPrescriptions(e.target.value, searchDoctor, filterStatus);
  };

  const handleDoctorChange = (e) => {
    setSearchDoctor(e.target.value);
    filterPrescriptions(searchDate, e.target.value, filterStatus);
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    filterPrescriptions(searchDate, searchDoctor, e.target.value);
  };

  const filterPrescriptions = (date, doctor, status) => {
    let filtered = prescriptions;

    if (date) {
      filtered = filtered.filter(prescription => prescription.date === date);
    }

    if (doctor) {
      filtered = filtered.filter(prescription => prescription.doctor_id.name.toLowerCase().includes(doctor.toLowerCase()));
    }

    if (status !== '') {
      filtered = filtered.filter(prescription => {
        // Match the status considering the space in "not filled"
        return status === 'filled' ? prescription.status === 'filled' : prescription.status === 'not filled';
      });
    }

    setFilteredPrescriptions(filtered);
  };


  return (
    <div>
      <Form inline>
        <FormControl type="date" placeholder="Filter by Date" className="mr-sm-2" onChange={handleDateChange} />
        <br />
        <FormControl type="text" placeholder="Filter by Doctor" className="mr-sm-2" onChange={handleDoctorChange} />
        <br />
        <Form.Control as="select" className="mr-sm-2" onChange={handleStatusChange}>
          <option value="">Filter by Filled/Unfilled</option>
          <option value="filled">Filled</option>
          <option value="not filled">Unfilled</option>
        </Form.Control>

      </Form>

      <br />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Doctor</th>
            <th>Medicines</th>
            <th>Filled</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrescriptions.map((prescription, index) => (
            <tr key={index}>
              <td>{prescription.date}</td>
              <td>{prescription.doctor_id.name}</td>
              <td>{prescription.medicines.map(med => (

                <div key={med._id}>
                  {med.name} - {med.dosage}
                </div>

              ))

              }</td>
              <td>{prescription.status === 'filled' ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PatientPrescriptions;
