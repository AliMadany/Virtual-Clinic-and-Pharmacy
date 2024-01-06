import React, { useState } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';

const FileManagement = () => {
  const [files, setFiles] = useState([
    { name: 'document1.pdf', size: '1MB', url: '/path/to/document1.pdf' },
    { name: 'image1.png', size: '2MB', url: '/path/to/image1.png' },
    // ... other files
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleView = (fileUrl) => {
    setModalContent(fileUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Implement the logic to handle the file upload to your server here
      // Then update the state with the new file
      const newFile = {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        url: '/path/to/' + file.name // Replace with actual path or URL after upload
      };
      setFiles([...files, newFile]);
    }
  };

  const handleRemove = (fileName) => {
    // Implement the logic to handle the file removal from your server here
    // Then update the state to remove the file from the list
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload"
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <label htmlFor="file-upload">
        <Button variant="primary" as="span" className="mb-2">
          Upload Document
        </Button>
      </label>

      <Table striped bordered hover className="mt-3">
        {/* ... table head */}
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.name}</td>
              <td>{file.size}</td>
              <td>
                <Button variant="primary" onClick={() => handleView(file.url)} className="me-2">
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

export default FileManagement;
