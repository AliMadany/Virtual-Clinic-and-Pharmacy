import React, { useState, useEffect } from 'react';
import { Form, Button, FormControl, Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function Chat() {
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    fetchReceivers();
  }, []);

  const fetchReceivers = () => {
    const endpoint = userType === 'patient' ? 'doctors' : 'patients';
    axios.get(`http://localhost:3100/${endpoint}`)
      .then(response => {
        setReceivers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchMessages = (receiverId) => {
    axios.get(`http://localhost:3100/getMessages/${userId}/${receiverId}`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSelectReceiver = (receiverId) => {
    setSelectedReceiverId(receiverId);
    fetchMessages(receiverId);
  };

  const handleSendMessage = () => {
    if (!selectedReceiverId) {
      alert('Please select a receiver first.');
      return;
    }

    const messageData = {
      message: newMessage,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toISOString().split('T')[1].split('.')[0]
    };

    axios.post(`http://localhost:3100/sendMessage/${userId}/${selectedReceiverId}`, messageData)
      .then(response => {
        setNewMessage('');
        fetchMessages(selectedReceiverId);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <DropdownButton title="Select Receiver">
            {receivers.map(receiver => (
              <Dropdown.Item key={receiver._id} onClick={() => handleSelectReceiver(receiver._id)}>
                Chat with {receiver.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender_id === userId ? 'You: ' : 'Them: '}</strong>
                {msg.message}
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormControl
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
