import React, { useEffect, useState } from 'react';
import { Table, Form, FormControl, Button, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);
  const [medicineList, setMedicineList] = useState([{ name: '', dosage: '' }]);
  const [editingPrescription, setEditingPrescription] = useState(null);

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
    fetchPrescriptions();
    fetchPatients();
    fetchMedicines();
  }, []);

  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setSelectedPatient(prescription.patient_id._id);
    setMedicineList(prescription.medicines);
    setShowAddPrescriptionModal(true);
  };

  const handleUpdatePrescription = () => {
    const doctorId = localStorage.getItem('userId');
    axios.put(`http://localhost:3100/editPrescription/${editingPrescription._id}`, {
      medicines: medicineList,
      doctor_id: doctorId,
      patient_id: selectedPatient,
      date: new Date().toISOString().split('T')[0],
      status: 'not filled',
    })
      .then(response => {
        alert('Prescription updated successfully!');
        setShowAddPrescriptionModal(false);
        fetchPrescriptions();
      })
      .catch(error => {
        console.error('Error updating prescription:', error);
        alert('Error updating prescription');
      });
  };

  const handleRemovePrescription = (prescriptionId) => {
    axios.delete(`http://localhost:3100/removePrescription/${prescriptionId}`)
      .then(response => {
        alert('Prescription deleted successfully!');
        fetchPrescriptions();
      })
      .catch(error => {
        console.error('Error deleting prescription:', error);
        alert('Error deleting prescription');
      });
  };

  const fetchPrescriptions = () => {
    axios.get('http://localhost:3100/getPrescriptionsByDoctor/' + localStorage.getItem('userId'))
      .then(response => {
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const fetchPatients = () => {
    axios.get('http://localhost:3100/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
      });
  };

  const fetchMedicines = () => {
    axios.get('http://localhost:3000/medicines')
      .then(response => {
        setMedicines(response.data);
      })
      .catch(error => {
        console.error('Error fetching medicines:', error);
      });
  };

  const handleAddMedicine = () => {
    setMedicineList([...medicineList, { name: '', dosage: '' }]);
  };
  const handleRemoveMedicine = () => {
    if (medicineList.length > 1
    ) {
      setMedicineList(medicineList.slice(0, -1));
    }
  };

  const handleMedicineChange = (index, e) => {
    const newMedicineList = [...medicineList];
    newMedicineList[index][e.target.name] = e.target.value;
    setMedicineList(newMedicineList);
  };

  const handleAddPrescription = () => {
    const doctorId = localStorage.getItem('userId');
    const data = {
      medicines: medicineList,
      doctor_id: doctorId,
      patient_id: selectedPatient,
      date: new Date().toISOString().split('T')[0],
      status: 'not filled',
      file: '' // Assuming no file to attach
    };

    axios.post('http://localhost:3100/addPrescription', data)
      .then(response => {
        alert('Prescription created successfully!');
        setShowAddPrescriptionModal(false);
        // Refresh prescriptions list
        // fetchPrescriptions();
      })
      .catch(error => {
        console.error('Error adding prescription:', error);
        alert('Error adding prescription');
      });
  };

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
            <th>Medicines</th>
            <th>Patient</th>
            <th>Filled</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrescriptions.map((prescription, index) => (
            <tr key={index}>
              <td>{prescription.date}</td>
              <td>{prescription.medicines.map(med => (

                <div key={med._id}>
                  {med.name} - {med.dosage}
                </div>

              ))

              }</td>
              <td>{prescription.patient_id.name}</td>
              <td>{prescription.status === 'filled' ? 'Yes' : 'No'}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditPrescription(prescription)}>Edit</Button>
                <Button variant="danger" onClick={() => handleRemovePrescription(prescription._id)}>Delete</Button>
              </td>
              <td>
              <Button onClick={() => downloadPrescription(prescription)}>Download</Button>
            </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button onClick={() => setShowAddPrescriptionModal(true)}>Add Prescription</Button>




      {/* Add/Edit Prescription Modal */}
      <Modal show={showAddPrescriptionModal} onHide={() => setShowAddPrescriptionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingPrescription ? 'Edit Prescription' : 'Add Prescription'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Patient</Form.Label>
              <Form.Control as="select" onChange={e => setSelectedPatient(e.target.value)}>
                <option>Select Patient</option>
                {patients.map(patient => (
                  <option key={patient._id} value={patient._id}>{patient.name}</option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Medicines */}
            {medicineList.map((med, index) => (
              <Row key={index}>
                <Col>
                  <Form.Control as="select" name="name" value={med.name} onChange={e => handleMedicineChange(index, e)}>
                    <option value="">Select Medicine</option>
                    {medicines.map(medicine => (
                      <option key={medicine._id} value={medicine.name}>{medicine.name}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col>
                  <FormControl type="text" placeholder="Dosage" name="dosage" value={med.dosage} onChange={e => handleMedicineChange(index, e)} />
                </Col>
              </Row>
            ))}
            <Button onClick={handleAddMedicine}>Add Another Medicine</Button>
            <Button onClick={handleRemoveMedicine}>RemoveMedicine</Button>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddPrescriptionModal(false)}>Close</Button>
          {editingPrescription
            ? <Button variant="primary" onClick={handleUpdatePrescription}>Update Prescription</Button>
            : <Button variant="primary" onClick={handleAddPrescription}>Add Prescription</Button>}
        </Modal.Footer>
      </Modal>


    </div>
  );
}

export default DoctorPrescriptions;
