import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Modal, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';

const Medicines = ({ role }) => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [userRole, setUserRole] = useState(role);
  const [showModal, setShowModal] = useState(false);
  const [showModalCart, setShowModalCart] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [cart, setCart] = useState([]);
  const patientId = localStorage.getItem('userId'); // Replace with actual patient ID mechanism
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);



  useEffect(() => {
    fetchMedicines();
    fetchCart();
  }, []);

//handle archived files

const toggleArchived = () => {
  setShowArchived(prevShowArchived => !prevShowArchived);
};

// Modify the handleArchiveMedicine function to update the state
const handleArchiveMedicine = (medicineId) => {
  axios.put(`http://localhost:3000/archiveMedicine/${medicineId}`)
    .then(() => {
      setMedicines(prevMedicines =>
        prevMedicines.map(med => 
          med._id === medicineId ? { ...med, archived: true } : med
        )
      );
      alert('Medicine archived successfully!');
    })
    .catch(error => console.error('Error archiving medicine:', error));
};

// Modify the handleUnarchiveMedicine function to update the state
const handleUnarchiveMedicine = (medicineId) => {
  axios.put(`http://localhost:3000/unarchiveMedicine/${medicineId}`)
    .then(() => {
      setMedicines(prevMedicines =>
        prevMedicines.map(med => 
          med._id === medicineId ? { ...med, archived: false } : med
        )
      );
      alert('Medicine unarchived successfully!');
    })
    .catch(error => console.error('Error unarchiving medicine:', error));
};


  const fetchAddresses = () => {
    axios.get(`http://localhost:3000/getAddresses/${patientId}`)
      .then(response => {
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0].address); // Select the first address by default
        }
      })
      .catch(error => console.error('Error fetching addresses:', error));
  };

  const createOrder = () => {
    if (!selectedAddress) {
      alert('Please add an address first.');
      return;
    }
    axios.post(`http://localhost:3000/createOrder/${patientId}`, { address: selectedAddress, payment_method: paymentMethod })
      .then(response => {
        setOrderId(response.data.order_id);
        // Proceed to payment after order is created
      })
      .catch(error => console.error('Error creating order:', error));
  };

  const payWithWallet = () => {
    axios.post(`http://localhost:3000/payWithWallet/${patientId}`, { order_id: orderId })
      .then(response => {
        console.log(response.data.message);
        // Handle successful payment
      })
      .catch(error => console.error('Error paying with wallet:', error));
  };

  const payWithCard = () => {
    axios.post(`http://localhost:3000/payWithCard/${orderId}`)
      .then(response => {
        window.location = response.data.url; // Redirect to payment gateway
      })
      .catch(error => console.error('Error paying with card:', error));
  };

  const payWithCash = () => {
    axios.post(`http://localhost:3000/payWithCash/${orderId}`)
      .then(response => {
        console.log(response.data.message);
        // Handle successful payment
      })
      .catch(error => console.error('Error paying with cash:', error));
  };

  const handleCheckout = () => {
    if (!orderId) {
      alert('Please create an order first.');
      return;
    }
    if (!selectedAddress) {
      alert('Please add an address first.');
      return;
    }
    switch (paymentMethod) {
      case 'wallet':
        payWithWallet();
        break;
      case 'card':
        payWithCard();
        break;
      case 'cash':
        payWithCash();
        break;
      default:
        alert('Please select a payment method.');
    }

    fetchCart(); // Refresh the cart
  };

  // Adjust the fetchMedicines function to handle the 'archived' field, if necessary
const fetchMedicines = () => {
  axios.get('http://localhost:3000/medicines')
    .then(response => {
      // Assuming the response will have a field 'archived' to indicate the status
      setMedicines(response.data.map(med => ({ ...med, archived: !!med.archived })));
    })
    .catch(error => console.error('Error fetching medicines:', error));
};

  const fetchCart = () => {
    axios.get(`http://localhost:3000/getCart/${patientId}`)
      .then(response => {
        setCart(response.data);
        calculateTotal(response.data);
      })
      .catch(error => console.error('Error fetching cart:', error));
  };

  const calculateTotal = (cartItems) => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.medicine.price * item.quantity; // Assuming item.medicine contains the price
    });
    setTotalAmount(total);
  };

  // Add to Cart
  const addToCart = (medicineId) => {
    const existingItem = cart.find(item => item.medicine._id === medicineId);
    if (existingItem) {
      // Update quantity if already in cart
      axios.post(`http://localhost:3000/updateCart/${patientId}`, { medicine: medicineId, quantity: existingItem.quantity + 1 })
        .then(() => fetchCart())
        .catch(error => console.error('Error updating cart:', error));
    } else {
      // Add new item to cart
      axios.post(`http://localhost:3000/addMedicineToCart/${patientId}`, { medicine: medicineId, quantity: 1 })
        .then(() => fetchCart())
        .catch(error => console.error('Error adding medicine to cart:', error));
    }
  };

  // Function to remove medicine from cart
  const removeFromCart = (medicineId) => {
    axios.delete(`http://localhost:3000/removeMedicineFromCart/${patientId}`, { data: { medicine: medicineId } })
      .then(() => fetchCart())
      .catch(error => console.error('Error removing medicine from cart:', error));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const fileToByteString = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
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

  const handleAddMedicine = (medicineData) => {
    axios.post('http://localhost:3000/addMedicine', medicineData)
      .then(() => {
        fetchMedicines();
        setShowModal(false);
      })
      .catch(error => console.error('Error adding medicine:', error));
  };

  const handleEditMedicine = (id, medicineData) => {
    axios.put(`http://localhost:3000/editMedicine/${id}`, medicineData)
      .then(() => {
        fetchMedicines();
        setShowModal(false);
      })
      .catch(error => console.error('Error editing medicine:', error));
  };

  const handleModalShow = (medicine = null) => {
    setEditingMedicine(medicine);
    // Reset or set ingredients state
    setIngredients(medicine?.ingredients || ['']);
    setShowModal(true);
  };

  const handleModalHide = () => {
    setEditingMedicine(null);
    setShowModal(false);
  };



  const handleIngredientChange = (e, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = e.target.value;
    setIngredients(newIngredients);
  };

  const handleAddIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredientField = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const medicineData = Object.fromEntries(formData.entries());
    medicineData.picture = await fileToByteString(medicineData.picture); // Convert file to byte string
    medicineData.ingredients = ingredients; // Include ingredients in the data
    // If 'use' is not already part of formData, you can manually add it
    // medicineData.use = formData.get('use'); 

    if (editingMedicine) {
      handleEditMedicine(editingMedicine._id, medicineData);
    } else {
      handleAddMedicine(medicineData);
    }
  };

  const handleCartChange = (medicineId, change) => {
    axios.put(`http://localhost:3000/changeMedicineQuantityInCart/${patientId}`, { medicine: medicineId, quantity: change })
      .then(() => fetchCart())
      .catch(error => console.error('Error updating cart:', error));
  };



  const renderCartItem = (item) => (
    <div key={item.medicine._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
      <span>{item.medicine.name} - Quantity: {item.quantity}</span>
      <div>
        <Button variant="primary" onClick={() => handleCartChange(item.medicine._id, item.quantity + 1)}>Increase</Button>
        <Button variant="secondary" onClick={() => handleCartChange(item.medicine._id, item.quantity - 1)} disabled={item.quantity === 1}>Decrease</Button>
        <Button variant="danger" onClick={() => removeFromCart(item.medicine._id)}>Remove</Button>
      </div>
    </div>
  );


  
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    medicine.use.toLowerCase().includes(filter.toLowerCase()) &&
    (showArchived ? medicine.archived : userRole === 'pharmacist' || !medicine.archived)
  );
  


  return (
    <div>
      {/* Search and Filter Inputs */}
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={handleSearchChange} />
        <br />
        <FormControl type="text" placeholder="Filter by Use" className="mr-sm-2" onChange={handleFilterChange} />
        <br />
        {userRole === 'pharmacist' && <Button variant="primary" onClick={() => handleModalShow()}>Add Medicine</Button>}

      </Form>
      <br />
{userRole === 'pharmacist' && (
  <div style={{ marginBottom: '1rem' }}>
    <Button variant="info" onClick={toggleArchived}>{showArchived ? 'Hide Archived' : 'Show Archived'}</Button>
  </div>
)}

      {/* Cart Icon and Modal */}
      {userRole === 'patient' && (
        <>
          <Button onClick={() => { setShowModalCart(true); fetchAddresses(); }}>Cart</Button>
          <Modal show={showModalCart} onHide={() => setShowModalCart(false)}>
            <Modal.Header closeButton>
              <Modal.Title>My Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {cart.length > 0 ? cart.map(renderCartItem) : <p>Your cart is empty.</p>}
              <p>Total Amount: ${totalAmount.toFixed(2)}</p>

              {cart.length > 0 && (
                <>
                  <DropdownButton id="dropdown-item-button" title={selectedAddress || "Select Address"}>
                    {addresses.map((addr, idx) => (
                      <Dropdown.Item key={idx} as="button" onClick={() => setSelectedAddress(addr.address)}>
                        {addr.address}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                  <br />

                  <br ></br>
                  <Form.Group>
                    <Form.Check
                      type="radio"
                      label="Wallet"
                      name="paymentMethod"
                      value="wallet"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      label="Credit Card"
                      name="paymentMethod"
                      value="card"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      label="Cash on Delivery"
                      name="paymentMethod"
                      value="cash"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                  </Form.Group>
                  <Button onClick={createOrder}>Checkout</Button>
                  <Button onClick={handleCheckout}>Pay</Button>
                </>
              )}
            </Modal.Body>
          </Modal>
        </>
      )}

      {/* Medicines List */}
      <div className="medicine-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        {filteredMedicines.filter(medicine =>
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          medicine.use.toLowerCase().includes(filter.toLowerCase())
        ).map(medicine => (
          <Card key={medicine._id} style={{ width: '18rem', flex: '0 0 auto' }}>
            <Card.Img variant="top" src={medicine.picture} />
            <Card.Body>
              <Card.Title>{medicine.name}</Card.Title>
              <Card.Text>Price: ${medicine.price}</Card.Text>
              <Card.Text>Description: {medicine.description}</Card.Text>
              {userRole === 'pharmacist' && (
        medicine.archived ?
          <Button variant="secondary" onClick={() => handleUnarchiveMedicine(medicine._id)}>Unarchive</Button> :
          <Button variant="warning" onClick={() => handleArchiveMedicine(medicine._id)}>Archive</Button>
      )}
              {userRole === 'patient' && (
                <>
                  <Button variant="primary" onClick={() => addToCart(medicine._id)}>Add to Cart</Button>
                </>
              )}
            </Card.Body>
          </Card>
        ))}

        
      </div>




      {/* Modal Form for Adding/Editing Medicine */}
      <Modal show={showModal} onHide={handleModalHide}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMedicine ? 'Edit Medicine' : 'Add Medicine'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={editingMedicine?.name} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" defaultValue={editingMedicine?.description} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Medical Use</Form.Label>
              <Form.Control type="text" name="use" defaultValue={editingMedicine?.use} required />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" defaultValue={editingMedicine?.price} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" name="quantity" defaultValue={editingMedicine?.quantity} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Medicine Picture</Form.Label>
              <Form.Control type="file" name="picture" />
            </Form.Group>

            {/* Ingredients Fields */}
            {ingredients.map((ingredient, index) => (
              <Form.Group key={index}>
                <Form.Label>Ingredient {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(e, index)}
                  required
                />
                <br />
                <Button variant="danger" onClick={() => handleRemoveIngredientField(index)}>
                  Remove
                </Button>
                <br /><br />
              </Form.Group>
            ))}
            <br />
            <Button variant="secondary" onClick={handleAddIngredientField}>
              Add Ingredient
            </Button>
            <br /><br />
            <Button variant="primary" type="submit">
              {editingMedicine ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <br />


    </div>
  );
};

export default Medicines;
