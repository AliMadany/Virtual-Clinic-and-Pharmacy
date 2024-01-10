import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, FormControl, Form } from 'react-bootstrap';
import axios from 'axios';

function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [files, setFiles] = useState([]);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    startTime: '',
    endTime: ''
  });


  useEffect(() => {
    fetchPatients();
  }, []);

  const handleScheduleClick = (patient) => {
    setSelectedPatient(patient);
    setShowScheduleModal(true);
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleAppointment = async () => {
    if (selectedPatient && appointmentDetails.startTime && appointmentDetails.endTime) {
      try {
        const response = await axios.post('http://localhost:3100/addAppointment', {
          patient_id: selectedPatient._id,
          doctor_id: localStorage.getItem('userId'),
          date: Date.now(),
          start_time: appointmentDetails.startTime,
          end_time: appointmentDetails.endTime,
          status: 'accepted'
        });
        console.log('Appointment scheduled:', response.data);
        setShowScheduleModal(false);
      } catch (error) {
        console.error('Error scheduling appointment:', error);
      }
    }
  };

  const fetchPatients = () => {
    axios.get('http://localhost:3100/getPatientsByAppointments/' + localStorage.getItem('userId'))
      .then(response => {
        //remove duplicate patient username
        
        setPatients(response.data.filter((patient, index, self) =>
          index === self.findIndex((t) => (
            t.username === patient.username
          ))
        ));
        setFilteredPatients(response.data.filter((patient, index, self) =>
          index === self.findIndex((t) => (
            t.username === patient.username
          ))
        ));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    if (searchTerm) {
      setFilteredPatients(patients.filter(patient =>
        patient.username.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredPatients(patients);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleDocumentsClick = async (patientId) => {
    setSelectedPatient(patientId);
    try {
      const response = await axios.get(`http://localhost:3100/getHealthRecords/${patientId}`);
      setFiles(response.data);
      setShowDocumentsModal(true);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fileToByteString = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);
        let byteString = '';
        for (let i = 0; i < byteArray.byteLength; i++) {
          byteString += String.fromCharCode(byteArray[i]);
        }
        resolve(byteString);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (selectedFile && fileName) {
      const byteString = await fileToByteString(selectedFile);

      try {
        await axios.post(`http://localhost:3100/uploadHealthRecord/${selectedPatient}`, {
          name: fileName,
          file: byteString
        });
        fetchDocuments(selectedPatient); // Refresh the list after upload
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleRemove = async (recordName) => {
    try {
      await axios.get(`http://localhost:3100/removeHealthRecords/${selectedPatient}/${recordName}`);
      fetchDocuments(selectedPatient); // Refresh the list after removal
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };


  const handleViewDocument = (file) => {
    // Assuming file.file is an array of byte values
    const byteArray = new Uint8Array(file.file.data);
    const blob = new Blob([byteArray], { type: "application/.jpeg" }); // Adjust MIME type based on your file type
    const blobUrl = URL.createObjectURL(blob);

    setModalContent(blobUrl);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setModalContent('');
  };

  const fetchDocuments = async (patientId) => {
    console.log(patientId);
    try {
      const response = await axios.get(`http://localhost:3100/getHealthRecords/${patientId}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const filterUpcomingAppointments = () => {
    axios.get('http://localhost:3100/getPatientsByUpcomingAppointments/' + localStorage.getItem('userId'))
      .then(response => {
        setFilteredPatients(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <FormControl
        type="text"
        placeholder="Search by username"
        onChange={handleSearchChange}
        style={{ marginBottom: '10px' }}
      />
      <Button onClick={filterUpcomingAppointments} style={{ marginBottom: '10px' }}>
        Filter by Upcoming Appointments
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient, index) => (
            <tr key={index}>
              <td>{patient.username}</td>
              <td>
                <Button onClick={() => handlePatientClick(patient)}>View Details</Button>
                <Button onClick={() => handleDocumentsClick(patient._id)} style={{ marginLeft: '10px' }}>
                  View Documents
                </Button>
                <Button onClick={() => handleScheduleClick(patient)} style={{ marginLeft: '10px' }}>
                  Schedule Follow Up
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <p><strong>Username:</strong> {selectedPatient.username}</p>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Date of Birth:</strong> {selectedPatient.date_of_birth}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Mobile Number:</strong> {selectedPatient.mobile_number}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Documents Modal */}
      <Modal show={showDocumentsModal} onHide={() => setShowDocumentsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPatient && `Documents for ${selectedPatient.username}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group controlId="fileName" className="mb-3">
              <Form.Control type="text" placeholder="Enter file name" onChange={(e) => setFileName(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={handleUpload}>Upload Document</Button>
          </Form>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleViewDocument(file)} className="me-2">
                      View
                    </Button>
                    <Button variant="danger" onClick={() => handleRemove(file.name)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDocumentsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      {/* View Document Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe src={modalContent} width="100%" height="500px" title="Document Viewer"></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

           {/* Schedule Follow-Up Modal */}
           <Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Follow-Up for {selectedPatient?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="datetime-local" name="startTime" onChange={handleScheduleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control type="datetime-local" name="endTime" onChange={handleScheduleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleScheduleAppointment}>Schedule</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorPatients;
