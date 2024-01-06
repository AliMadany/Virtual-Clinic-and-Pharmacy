import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, FormControl } from 'react-bootstrap';
import axios from 'axios';

function PatientDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [healthPackage, setPackage] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3100/doctors')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.log(error);
      });

    axios.get('http://localhost:3100/getPackageForPatient/65403bf85091f5dce661f3e8')
      .then(response => {
        setPackage(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  useEffect(() => {
    if (searchDate) {
      axios.get(`http://localhost:3100/getDoctorByDateTime/${searchDate}`)
        .then(response => {
          setDoctors(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [searchDate]);

  const handleRowClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSpecialtyChange = (e) => {
    setSearchSpecialty(e.target.value);
  };

  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    doctor.specialty.toLowerCase().includes(searchSpecialty.toLowerCase())
  );

  return (
    <div>
      <Form inline>
        <FormControl type="text" placeholder="Search by Name" className="mr-sm-2" onChange={handleSearchChange} />
        <br />
        <FormControl type="text" placeholder="Search by Specialty" className="mr-sm-2" onChange={handleSpecialtyChange} />
        <br />
        <FormControl type="date" placeholder="Search by Date" className="mr-sm-2" onChange={handleDateChange} />
      </Form>

      <br />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Session Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map((doctor, index) => (
            <tr key={index} onClick={() => handleRowClick(doctor)}>
              <td>{doctor.name}</td>
              <td>{doctor.specialty}</td>
              <td>{healthPackage ? ((doctor.hourly_rate * 1.1) - parseInt(healthPackage.session_discount + '')).toFixed(2) : (doctor.hourly_rate * 1.1).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

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
    </div>
  );
}

export default PatientDoctors;
