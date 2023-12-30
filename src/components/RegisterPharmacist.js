import { useState } from "react";

function RegisterPharmacist() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        date_of_birth: '',
        hourly_rate: '',
        affiliation: '',
        education: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Making a POST request to the server
        fetch('http://localhost:3000/addPharmacist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle response data as needed (e.g., set user data, redirect, etc.)
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded">
            <div className="mb-3">
                <label className="form-label">Username:</label>
                <input 
                    type="text" 
                    name="username" 
                    value={credentials.username} 
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Password:</label>
                <input 
                    type="password" 
                    name="password" 
                    value={credentials.password} 
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={credentials.name} 
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={credentials.email} 
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Date of Birth:</label>
                <input 
                    type="date" 
                    name="date_of_birth" 
                    value={credentials.date_of_birth} 
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Hourly Rate:</label>
                <input 
                    type="number" 
                    name="hourly_rate" 
                    value={credentials.hourly_rate} 
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Affiliation (Hospital):</label>
                <input 
                    type="text" 
                    name="affiliation" 
                    value={credentials.affiliation} 
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Educational Background:</label>
                <textarea 
                    name="education" 
                    value={credentials.education} 
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <button type="submit" className="btn btn-primary">Register as Pharmacist</button>
        </form>
    );
}

export default RegisterPharmacist;
