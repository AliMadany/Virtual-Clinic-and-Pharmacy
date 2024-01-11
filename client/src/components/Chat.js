import React, { useState, useEffect } from 'react';
import { ChatEngine } from 'react-chat-engine';
import axios from 'axios';

function Chat() {
    const projectID = '20b1b9d0-9120-42ae-a4b6-3a3080d2c79a';
    const [userType, setUserType] = useState('');
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        // Determine user type
        const type = localStorage.getItem('userType'); // 'patient' or 'doctor'
        setUserType(type);
        fetchChatUsers(type);
    }, []);

    const fetchChatUsers = (type) => {
        // Placeholder URL - replace with your API endpoint to fetch users
        const url = type === 'doctor' ? 'http://localhost:3100/patients' : 'http://localhost:3100/doctors'

        axios.get(url)
            .then(response => {
                setChatUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    return (
        <div>
            <h1>Chat</h1>
            <select onChange={handleUserChange} value={selectedUser}>
                <option value="">Select a {userType === 'doctor' ? 'Patient' : 'Doctor'}</option>
                {chatUsers.map(user => (
                    <option key={user.id} value={user.username}>
                        {user.name}
                    </option>
                ))}
            </select>

            {selectedUser && (
                <ChatEngine
                    height="100vh"
                    projectID="20b1b9d0-9120-42ae-a4b6-3a3080d2c79a"
                    userName="seifelfayoumy"
                    userSecret="seif"
                    // chatID="seifelfayoumy"// Assuming chatID is the username of the selected user
                />
            )}
        </div>
    );
}

export default Chat;
