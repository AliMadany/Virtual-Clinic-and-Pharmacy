import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ForgetPassword = () => {
    const [show, setShow] = useState(false);
    const [stage, setStage] = useState(1); // 1 for username, 2 for OTP, 3 for new password
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleClose = () => {
        setShow(false);
        setStage(1); // Reset to initial stage when modal is closed
    };
    const handleShow = () => setShow(true);

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleOtpChange = (e) => setOtp(e.target.value);
    const handlePasswordChange = (e) => setNewPassword(e.target.value);

    const requestOTP = async () => {
        try {
            const response = await fetch('http://localhost:3000/resetPassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();
            if (response.status === 200) {
                alert('OTP sent to your email');
                setStage(2); // Move to next stage
            } else {
                alert(data.message || 'Error sending OTP');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const verifyOTP = async () => {
        try {
            const response = await fetch(`http://localhost:3000/checkOTP/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp: otp + '' }),
            });

            const data = await response.json();
            if (data.flag) {
                setStage(3); // Move to next stage
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const changePassword = async () => {
        try {
            const response = await fetch('http://localhost:3000/changePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password: newPassword }),
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
                Forget Password
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {stage === 1 && (
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </Form.Group>
                    )}
                    {stage === 2 && (
                        <Form.Group>
                            <Form.Label>OTP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the OTP"
                                value={otp}
                                onChange={handleOtpChange}
                            />
                        </Form.Group>
                    )}
                    {stage === 3 && (
                        <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={handlePasswordChange}
                            />
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {stage === 1 && <Button variant="primary" onClick={requestOTP}>Request OTP</Button>}
                    {stage === 2 && <Button variant="primary" onClick={verifyOTP}>Verify OTP</Button>}
                    {stage === 3 && <Button variant="primary" onClick={changePassword}>Change Password</Button>}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ForgetPassword;
