import React, { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function PatientPackages() {
  const [packages, setPackages] = useState([]);
  const [myPackage, setMyPackage] = useState([]);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [renewalDate , setRenewalDate] = useState(null);
  const [canceelledOn , setCancelledOn] = useState(null);


  useEffect(() => {
    fetchPackages();
    fetchMyPackage();
    fetchFamilyMembers();
  }, []);

  const fetchPackages = () => {
    axios.get('http://localhost:3100/packages')
      .then(response => {
        setPackages(response.data);
      })
      .catch(error => {
        console.error('Error fetching packages:', error);
      });
  };

  const fetchMyPackage = () => {
    axios.get('http://localhost:3100/getPatientById/' + localStorage.getItem('userId'))
      .then(response => {
        if(response.data.renewal_date){
          setRenewalDate(response.data.renewal_date);
        }
        if(response.data.cancel_date){
          setCancelledOn(response.data.cancel_date);
        }
        if(response.data.health_package){
          setMyPackage([response.data.health_package]);
        }else{
          setMyPackage([]);
        }
      })
      .catch(error => {
        console.error('Error fetching my package:', error);
      });
  };

  const fetchFamilyMembers = () => {
    // Replace with your actual API endpoint
    axios.get('http://localhost:3100/getFamilyMembers/' + localStorage.getItem('userId'))
      .then(response => {
        setFamilyMembers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };


  const handleSubscribe = (pkg) => {
    setSelectedPackage(pkg);
    setShowSubscribeModal(true);
  };

  const handleConfirmSubscription = () => {
    setShowSubscribeModal(false);
    setShowModal(false);
    setShowPaymentModal(true);
  };


  const handleConfirmMember = (member) => {
    setShowModal(false);
    setSelectedMember(member);
    setShowPaymentModal(true);
  }

  const handlePaymentMethod = (method) => {
    let patientId = localStorage.getItem('userId'); // Assuming patient ID is stored in local storage
    const packageId = selectedPackage._id;


    let family_member = null;
    if (selectedMember) {
      family_member = selectedMember.nationalId;

    }



    axios.put(`http://localhost:3100/subscribePackage/${patientId}/`, {
      package_id: packageId,
      payment_type: method,
      family_member: family_member
    })
      .then(response => {
        if (method === 'Credit Card') {
          window.location.href = response.data.url; // Redirect to payment URL for card payments
        } else {
          alert("Subscribed using Wallet");
          setShowPaymentModal(false);
        }

        axios.get('http://localhost:3100/getPatientById/' + localStorage.getItem('userId'))
          .then(response => {
            setMyPackage([response.data.health_package]);
          })
          .catch(error => {
            console.error('Error fetching packages:', error);
          });

      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error processing payment");
      });


  };

  const unsubscribe = async (familyMemberNationalId = null) => {
    const patientId = localStorage.getItem('userId');
    try {
      await axios.put(`http://localhost:3100/unsubscribePackage/${patientId}`, {
        family_member: familyMemberNationalId
      });
      alert('Unsubscribed successfully');
      // Refresh data after unsubscribe
      fetchMyPackage();
      fetchFamilyMembers();
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Error unsubscribing');
    }
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


      <h2>Your Package</h2>
      <h4>renews on {renewalDate}</h4>
      <h4>last cancelled on {canceelledOn}</h4>
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
          {myPackage.map((pkg, index) => (
            <tr key={index}>
              <td>{pkg.name}</td>
              <td>${pkg.price}</td>
              <td>{pkg.session_discount * 100}%</td>
              <td>{pkg.medicine_discount * 100}%</td>
              <td>{pkg.family_discount * 100}%</td>
              <td>
                {pkg && <Button variant="danger" onClick={() => unsubscribe()}>Unsubscribe</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2>Family Members Packages</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Package Name</th>

            <th>Renews on</th>
            <th>last cancelled on</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {familyMembers.map((member, index) => (
            <tr key={index}>
              <td>{member.name}</td>
              <td>{member.health_package ? member.health_package.name : 'No Package'}</td>

              <td>{member.renewal_date}</td>
              <td>{member.cancel_date}</td>
              <td>
                {member.health_package && (
                  <Button variant="danger" onClick={() => unsubscribe(member.nationalId)}>
                    Unsubscribe
                  </Button>
                )}
              </td>
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
          <Button variant="secondary" onClick={() => setShowModal(true)}>
            Subscribe for family member
          </Button>
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
          <Button variant="info" onClick={() => handlePaymentMethod('wallet')}>
            Wallet
          </Button>
          <Button variant="success" onClick={() => handlePaymentMethod('Credit Card')}>
            Credit Card
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Method Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Family Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {familyMembers.map((member, index) => (
                <tr key={index} onClick={() => handleConfirmMember(member)}>
                  <td>{member.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>



    </div>
  );
}

export default PatientPackages;
//TESTfOrPUSH