import React, { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function PatientPackages() {
  const [packages, setPackages] = useState([]);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3100/packages')
      .then(response => {
        setPackages(response.data);
      })
      .catch(error => {
        console.error('Error fetching packages:', error);
      });
  }, []);

  
  // This function is called when a package row is clicked
const handleSubscribe = (pkg) => {
    setSelectedPackage(pkg); // Set the selected package
    setShowSubscribeModal(true); // Show the subscribe modal
  };
  
  // This function is called when the "Subscribe" button in the subscribe modal is clicked
  const handleConfirmSubscription = () => {
    setShowSubscribeModal(false); // Hide the subscribe modal
    setShowPaymentModal(true); // Show the payment modal
  };
  
  // This function is called when a payment method is selected in the payment modal
  const handlePaymentMethod = (method) => {
    console.log(`Subscribed to ${selectedPackage.name} with ${method}`);
    setShowPaymentModal(false); // Hide the payment modal
    // Here you will handle the payment process
  };
  


  return (
    <div>
      <h2>Available Packages</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Session Discount</th>
            <th>Medicine Discount</th>
            <th>Family Discount</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={index} onClick={() => handleSubscribe(pkg)}>
              <td>{pkg.name}</td>
              <td>${pkg.price}</td>
              <td>{pkg.session_discount * 100}%</td>
              <td>{pkg.medicine_discount * 100}%</td>
              <td>{pkg.family_discount * 100}%</td>
            </tr>
          ))}
        </tbody>
      </Table>

     {/* Subscribe Confirmation Modal */}
<Modal show={showSubscribeModal} onHide={() => setShowSubscribeModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Subscribe to Package</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Do you want to subscribe to {selectedPackage?.name}?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowSubscribeModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirmSubscription}>
      Subscribe
    </Button>
  </Modal.Footer>
</Modal>

{/* Payment Method Modal */}
<Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Payment Method</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Please choose your payment method for {selectedPackage?.name}.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="info" onClick={() => handlePaymentMethod('Wallet')}>
      Wallet
    </Button>
    <Button variant="success" onClick={() => handlePaymentMethod('Credit Card')}>
      Credit Card
    </Button>
  </Modal.Footer>
</Modal>


      
    </div>
  );
}

export default PatientPackages;
//TESTfOrPUSH