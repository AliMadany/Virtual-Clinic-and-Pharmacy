import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';

const PatientMedicalHistory = () => {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const patientId = localStorage.getItem('userId');

  const fetchHealthRecords = async () => {
    try {
      const response = await fetch('http://localhost:3100/getHealthRecords/' + patientId); // Replace ':id' with actual patient ID
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching health records:', error);
    }
  };

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const handleView = (file) => {
    // Assuming file.file is an array of byte values
    const byteArray = new Uint8Array(file.file.data);
    const blob = new Blob([byteArray], {type: "application/.jpeg"}); // Adjust the MIME type based on your file type
    const blobUrl = URL.createObjectURL(blob);
  
    setModalContent(blobUrl);
    setShowModal(true);
  };
  

  const handleCloseModal = () => setShowModal(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Helper function to convert a file to a byte string
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
        await fetch('http://localhost:3100/uploadHealthRecord/' + patientId, { // Replace ':id' with actual patient ID
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fileName, file: byteString })
        });
        fetchHealthRecords(); // Refresh the list after upload
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleRemove = async (recordName) => {
    try {
      await fetch(`http://localhost:3100/removeHealthRecords/${patientId}/${recordName}`, { // Replace ':patientId' with actual patient ID
        method: 'GET',
      });
      fetchHealthRecords(); // Refresh the list after removal
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  return (
    <div>
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
        {/* ... table head */}
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.name}</td>
              <td>{/* File size, if available */}</td>
              <td>
                <Button variant="primary" onClick={() => handleView(file)} className="me-2">
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe src={modalContent} width="100%" height="500px" title="Document Viewer"></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientMedicalHistory;
