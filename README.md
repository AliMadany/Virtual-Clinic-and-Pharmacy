# Virtual Clinic System

## Motivation
This project aims to create a virtual clinic system, facilitating seamless interaction between patients, doctors, pharmacists, and admins. The system includes functionalities like appointment scheduling, medicine ordering, chat communication, and more, aiming to streamline the healthcare process.

## Build Status
As of now, the project is in a functional state. However, real-time features like instant messaging or notification systems are not implemented.

## Code Style
Standard - This project follows standard coding conventions for clarity and maintainability.

## Screenshots
<img width="1046" alt="Screenshot 2024-01-11 at 12 15 21 AM" src="https://github.com/seifelfayoumy/ClinicPharmacy_Team04/assets/49912407/621759ec-b7a1-44fe-bdbe-069a6bf0e74f">
<img width="1061" alt="Screenshot 2024-01-11 at 12 15 28 AM" src="https://github.com/seifelfayoumy/ClinicPharmacy_Team04/assets/49912407/5d200162-94e1-4d1a-b22f-81e3eff75abf">
<img width="1052" alt="Screenshot 2024-01-11 at 12 15 57 AM" src="https://github.com/seifelfayoumy/ClinicPharmacy_Team04/assets/49912407/0b407424-1a65-4ab3-a1b0-ce043d21a48c">


## Tech/Framework Used
- React
- Node.js
- Express
- MongoDB
- Bootstrap for React
- Axios

## Features
- User Authentication for Patients, Doctors, Pharmacists, and Admins.
- Appointment scheduling and management.
- Medicine ordering and management.
- Chat functionality for communication between different user types.
- Management of patient health records and prescriptions.
- Wallet system for transactions.

## Code Examples
Example of Chat functionality in React:
```
import React, { useState } from 'react';
import { Form, Button, FormControl } from 'react-bootstrap';

function Chat() {
  const [message, setMessage] = useState('');
  const sendMessage = () => {
    // API call to send message
    console.log("Sending message:", message);
  };

  return (
    <div>
      <FormControl
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
}
export default Chat;
```
## Installation
To install this project, clone the repository and install the required npm packages:
git clone <repository-url>
cd virtual-clinic
npm install

# Virtual Clinic System APIs

## Patient APIs
- `POST /addPatient` - Add a new patient
- `DELETE /removePatient/:id` - Remove a patient
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get patient by ID
- `GET /getPatientByName/:name` - Get patient by name
- `GET /getPatientsByAppointments/:id` - Get patients by appointments
- `GET /getPatientsByUpcomingAppointments/:id` - Get patients by upcoming appointments
- `GET /checkWallet/:id` - Check wallet balance of a patient
- `PUT /changePassword` - Change password of a patient

## Doctor APIs
- `POST /addDoctor` - Add a new doctor
- `DELETE /removeDoctor/:id` - Remove a doctor
- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get doctor by ID
- `PUT /editDoctorDetails/:id` - Edit doctor details
- `GET /getDoctorByName/:name` - Get doctor by name
- `GET /getDoctorBySpecialty/:specialty` - Get doctors by specialty
- `GET /getDoctorByDateTime/:datetime` - Get doctor by date and time
- `GET /getDoctorBySpecialtyAndDateTime/:specialty/:datetime` - Get doctor by specialty and date/time
- `GET /getDoctorByDate/:date` - Get doctor by date
- `GET /getDoctorBySpecialtyAndDate/:specialty/:date` - Get doctor by specialty and date

## Appointment APIs
- `POST /addAppointment` - Add a new appointment
- `PUT /editAppointment/:id` - Edit an appointment
- `DELETE /removeAppointment/:id` - Remove an appointment
- `GET /getAppointmentsByDate/:date` - Get appointments by date
- `GET /getAppointmentsByStatus/:status` - Get appointments by status
- `GET /getAppointmentsByPatient/:id` - Get appointments by patient ID
- `GET /getAppointmentsByDoctor/:id` - Get appointments by doctor ID
- `GET /getAppointments` - Get all appointments
- `POST /scheduleFollowUpDoctor` - Schedule a follow-up appointment by doctor
- `POST /scheduleFollowUpPatient` - Schedule a follow-up appointment by patient
- `POST /cancelAppointment/:id` - Cancel an appointment

## Prescription APIs
- `POST /addPrescription` - Add a new prescription
- `PUT /editPrescription/:id` - Edit a prescription
- `DELETE /removePrescription/:id` - Remove a prescription
- `GET /getPrescriptionsByPatient/:id` - Get prescriptions by patient ID
- `GET /getPrescriptionsByDate/:id/:date` - Get prescriptions by date
- `GET /getPrescriptionsByDoctor/:doc_id` - Get prescriptions by doctor ID
- `GET /getPrescriptionByStatus/:id/:status` - Get prescription by status
- `GET /getPrescription/:id` - Get a specific prescription
- `GET /downloadPrescription/:id` - Download a prescription

## Admin APIs
- `POST /addAdmin` - Add a new admin
- `DELETE /removeAdmin/:id` - Remove an admin
- `GET /admins` - Get all admins

## Package APIs
- `POST /addPackage` - Add a new package
- `PUT /editPackage/:id` - Edit a package
- `DELETE /removePackage/:id` - Remove a package
- `GET /packages` - Get all packages
- `GET /getPackageForPatient/:id` - Get package for a specific patient
- `PUT /subscribePackage/:id` - Subscribe to a package
- `PUT /unsubscribePackage/:id` - Unsubscribe from a package
- `GET /getCurrentPackage/:id` - Get current package of a patient

## Chat APIs
- `POST /sendMessage/:id/:receiver_id` - Send a message
- `GET /getMessages/:id` - Get messages
- `GET /getChats/:id` - Get all chats for a user
- `GET /checkPatientDoctorChat/:id/:receiver_id` - Check if a chat exists between a patient and a doctor

## Health Record APIs
- `POST /uploadHealthRecord/:id` - Upload a health record
- `GET /getHealthRecords/:id` - Get health records
- `GET /removeHealthRecords/:patientId/:recordName` - Remove a health record

## Additional APIs
- `POST /checkOTP/:username` - Check OTP
- `PUT /resetPassword` - Reset password
- `PUT /acceptDoctor/:id` - Accept a doctor
- `PUT /rejectDoctor/:id` - Reject a doctor
- `PUT /acceptFollowUp/:id` - Accept a follow-up
- `PUT /revokeFollowUp/:id` - Revoke a follow-up
- `GET /getPendingAppointments` - Get pending appointments
- `POST /acceptContract/:id` - Accept a contract



## Tests
Testing is done using Postman for API routes. Jest is used for unit testing components.

## How to Use
To use the system:
1. Start the server: `npm start`
2. Navigate to `http://localhost:3000` in your web browser.
3. Register or login as a patient, doctor, or pharmacist.
4. ... (Provide step-by-step instructions)

## Contribute
Contributions to the project are welcome. Please fork the repository and submit pull requests.

## Credits
Credits go to all libraries and frameworks used. Special thanks to tutorials and guides from sources like [React Documentation](https://reactjs.org/docs/getting-started.html) and [MongoDB Docs](https://docs.mongodb.com/).

## License
This project is licensed under the MIT License - see the LICENSE file for details.
Additional licenses include Apache 2.0 for Stripe integration.
