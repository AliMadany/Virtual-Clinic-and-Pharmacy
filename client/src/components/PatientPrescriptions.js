import React, { useEffect, useState } from 'react';
import { Table, Form, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');


  const downloadPrescription = (prescription) => {
    const doc = new jsPDF();
    const tableColumn = ["Medicine Name", "Dosage"];
    const tableRows = [];

    prescription.medicines.forEach(med => {
      const medData = [
        med.name,
        med.dosage,
      ];
      tableRows.push(medData);
    });

    doc.text(`Prescription Date: ${prescription.date}`, 14, 15);
    doc.text(`Doctor: ${prescription.doctor_id.name}`, 14, 25);
    doc.text(`Status: ${prescription.status}`, 14, 35);
    doc.autoTable(tableColumn, tableRows, { startY: 45 });

    doc.save(`prescription_${prescription._id}.pdf`);
  };
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

  const handlePayment = ( paymentType) => {
    axios.put(`http://localhost:3100/subscribePrescription/${localStorage.getItem('userId')}`, {
      payable: 250,
      payment_type: paymentType
    })
      .then(response => {
        if (paymentType === "card") {
          window.location.href = response.data.url; // Redirect to payment URL for card payments
        } else {
          alert("Paid with Wallet");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error processing payment");
      });
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
              <td>
                <Button onClick={() => downloadPrescription(prescription)}>Download</Button>
              </td>
              <td>
                <Button variant="success" onClick={() => handlePayment('wallet')}>Pay with Wallet</Button>{' '}
                <Button variant="primary" onClick={() => handlePayment("card")}>Pay with Card</Button>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PatientPrescriptions;
