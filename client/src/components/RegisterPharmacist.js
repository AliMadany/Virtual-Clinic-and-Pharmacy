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

    const [files, setFiles] = useState({
        pharmacist_id: null,
        pharmacy_degree: null,
        working_license: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles(prevState => ({
            ...prevState,
            [name]: files[0] // Only the first file is considered
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Helper function to convert a file to a byte string
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
    
        // Process files and add them to credentials
        for (const key of Object.keys(files)) {
            if (files[key]) {
                credentials[key] = await fileToByteString(files[key]);
            }
        }

      
    
        // Send the request
        fetch('http://localhost:3000/addPharmacist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
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

                        {/* File Inputs for pharmacist_id, pharmacy_degree, working_license */}
                        <div className="mb-3">
                <label className="form-label">Pharmacist ID:</label>
                <input 
                    type="file" 
                    name="pharmacist_id" 
                    onChange={handleFileChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Pharmacy Degree:</label>
                <input 
                    type="file" 
                    name="pharmacy_degree" 
                    onChange={handleFileChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Working License:</label>
                <input 
                    type="file" 
                    name="working_license" 
                    onChange={handleFileChange}
                    className="form-control"
                />
            </div>
            <button type="submit" className="btn btn-primary">Register as Pharmacist</button>
        </form>
    );
}

export default RegisterPharmacist;
