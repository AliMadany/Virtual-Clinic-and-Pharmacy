import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = () => {
    axios.get('http://localhost:3100/packages')
      .then(response => {
        setPackages(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const packageData = Object.fromEntries(formData.entries());

    if (isEdit) {
      axios.put(`http://localhost:3100/editPackage/${currentPackage._id}`, packageData)
        .then(() => {
          fetchPackages();
          setShowModal(false);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios.post('http://localhost:3100/addPackage', packageData)
        .then(() => {
          fetchPackages();
          setShowModal(false);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleDelete = (packageId) => {
    axios.delete(`http://localhost:3100/removePackage/${packageId}`)
      .then(() => {
        fetchPackages();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const openModal = (packageObj = null) => {
    setIsEdit(!!packageObj);
    setCurrentPackage(packageObj);
    setShowModal(true);
  };

  return (
    <div>
      <Button onClick={() => openModal()}>Add New Package</Button>
      <br /><br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Session Discount</th>
            <th>Medicine Discount</th>
            <th>Family Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={index}>
              <td>{pkg.name}</td>
              <td>{pkg.price}</td>
              <td>{pkg.session_discount}</td>
              <td>{pkg.medicine_discount}</td>
              <td>{pkg.family_discount}</td>
              <td>
                <Button variant="primary" onClick={() => openModal(pkg)} style={{marginRight:"10px"}}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(pkg._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Package */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Package' : 'Add Package'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                required
                defaultValue={currentPackage ? currentPackage.name : ''}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                required
                min="0"
                defaultValue={currentPackage ? currentPackage.price : ''}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Session Discount</Form.Label>
              <Form.Control
                type="number"
                name="session_discount"
                required
                min="0"
                max="1"
                step="0.01"
                defaultValue={currentPackage ? currentPackage.session_discount : ''}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Medicine Discount</Form.Label>
              <Form.Control
                type="number"
                name="medicine_discount"
                required
                min="0"
                max="1"
                step="0.01"
                defaultValue={currentPackage ? currentPackage.medicine_discount : ''}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Family Discount</Form.Label>
              <Form.Control
                type="number"
                name="family_discount"
                required
                min="0"
                max="1"
                step="0.01"
                defaultValue={currentPackage ? currentPackage.family_discount : ''}
              />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              {isEdit ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminPackages;
