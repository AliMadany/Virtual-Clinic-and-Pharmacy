import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ChangePassword = () => {
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async () => {
        const username = localStorage.getItem('username');
        const payload = {
            username,
            password
        };

        console.log(payload);

        try {
            const response = await fetch('http://localhost:3000/changePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.status === 200) {
                alert('Password changed successfully');
            } else {
                alert(data.message || 'Error changing password');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }

        handleClose();
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Change Password
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChangePassword;
