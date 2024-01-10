const express = require("express");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const MongoURI = process.env.MONGO_URI;
const { addPatient, addDoctor, addAdmin, removeDoctor, removePatient, getPendingDoctors, addPackage, editPackage, removePackage, editDoctorDetails, addFamilyMember, getFamilyMembers, getAppointmentsByDate, getAppointmentsByStatus, getPatientById, getAllPatients, getPatientByName, getPatientsByAppointments, getDoctors, getDoctorByName, getDoctorBySpecialty, getDoctorByDateTime, getDoctorBySpecialtyAndDateTime, getDoctorByDate, getDoctorBySpecialtyAndDate, getDoctorById, getPrescriptionsByPatient, getPrescriptionsByDate, getPrescriptionsByDoctor, getPrescriptionByStatus, getPrescription, addAppointment, editAppointment, removeAppointment, addPrescription, editPrescription, removePrescription, getAdmins, removeAdmin, getPackages, getAppointmentsByPatient, getAppointmentsByDoctor, getPatientsByUpcomingAppointments, getPackageForPatient, acceptDoctor, rejectDoctor, getUserId, getUserType, login, changePassword, checkOTP, resetPassword, uploadHealthRecord, getHealthRecords, getPackage, subscribePackage, getCurrentPackage, unsubscribePackage, selectAppointment, scheduleFollowUpDoctor, scheduleFollowUpPatient, getPendingAppointments, acceptFollowUp, revokeFollowUp, checkWallet, cancelAppointment, downloadPrescription, sendMessage, getMessages, getChats, checkPatientDoctorChat, removeHealthRecord, acceptContract, getAppointments, subscribePres } = require('./routes/controller');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const port = process.env.PORT || "3000";

app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!")
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    })
  })
  .catch(err => console.log(err));
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

app.use(express.json())

const secretKey = 'secretKey';

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const loggedIn = await login(username, password);
    if (loggedIn) {
        const userType = await getUserType(username);
        const userId = await getUserId(username, userType);
        const userPayload = {
            userId: userId,
            username: username,
            type: userType
        };
        const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
        res.json({ token, username, userId, userType });
    } else {
        res.status(401).json({ message: "Incorrect username or password." });
    }
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        const lineItems = await Promise.all(req.body.items.map(async item => {
            const storeItem = {
                priceInCents: item.price * 100,
                name: item.name,
                quantity: item.quantity
            };

            const price = await stripe.prices.create({
                currency: 'egp',
                product_data: {
                    name: storeItem.name,
                },
                unit_amount: storeItem.priceInCents,
            });

            return {
                price: price.id,
                quantity: storeItem.quantity,
            };
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: 'http://localhost:3001/patient-clinic/appointments',
            cancel_url: 'http://localhost:3001/patient-clinic/appointments',
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/addPatient", addPatient);
app.post('/addDoctor', addDoctor);
app.post('/addAdmin', addAdmin);
app.delete('/removeDoctor/:id', removeDoctor);
app.delete('/removePatient/:id', removePatient);
app.delete('/removeAdmin/:id', removeAdmin);
app.get('/getPendingDoctors', getPendingDoctors);
app.post('/addPackage', addPackage);
app.put('/editPackage/:id', editPackage);
app.delete('/removePackage/:id', removePackage);
app.put('/editDoctorDetails/:id', editDoctorDetails);
app.post('/addFamilyMember/:id', addFamilyMember);
app.get('/getFamilyMembers/:id', getFamilyMembers);
app.post('/addAppointment', addAppointment);
app.put('/editAppointment/:id', editAppointment);
app.delete('/removeAppointment/:id', removeAppointment);
app.get('/getAppointmentsByDate/:date', getAppointmentsByDate);
app.get('/getAppointmentsByStatus/:status', getAppointmentsByStatus);
app.get('/getAppointmentsByPatient/:id', getAppointmentsByPatient);
app.get('/getAppointmentsByDoctor/:id', getAppointmentsByDoctor);
app.get('/getAppointments', getAppointments);
app.get('/getPatientById/:id', getPatientById);
app.get('/patients', getAllPatients);
app.get('/getPatientByName/:name', getPatientByName);
app.get('/getPatientsByAppointments/:id', getPatientsByAppointments);
app.get('/getPatientsByUpcomingAppointments/:id', getPatientsByUpcomingAppointments);
app.get('/doctors', getDoctors);
app.get('/getDoctorByName/:name', getDoctorByName);
app.get('/getDoctorBySpecialty/:specialty', getDoctorBySpecialty);
app.get('/getDoctorByDateTime/:datetime', getDoctorByDateTime);
app.get('/getDoctorBySpecialtyAndDateTime/:specialty/:datetime', getDoctorBySpecialtyAndDateTime);
app.get('/getDoctorByDate/:date', getDoctorByDate);
app.get('/getDoctorBySpecialtyAndDate/:specialty/:date', getDoctorBySpecialtyAndDate);
app.get('/getDoctorById/:id', getDoctorById);
app.post('/addPrescription', addPrescription);
app.put('/editPrescription/:id', editPrescription);
app.delete('/removePrescription/:id', removePrescription);
app.get('/getPrescriptionsByPatient/:id', getPrescriptionsByPatient);
app.get('/getPrescriptionsByDate/:id/:date', getPrescriptionsByDate);
app.get('/getPrescriptionsByDoctor/:doc_id', getPrescriptionsByDoctor);
app.get('/getPrescriptionByStatus/:id/:status', getPrescriptionByStatus);
app.get('/getPrescription/:id', getPrescription);
app.get('/admins', getAdmins);
app.get('/packages', getPackages);
app.get('/getPackageForPatient/:id', getPackageForPatient)
app.put("/acceptDoctor/:id", acceptDoctor);
app.put("/rejectDoctor/:id", rejectDoctor);
app.put("/changePassword", changePassword);
app.post("/checkOTP/:username", checkOTP);
app.put("/resetPassword", resetPassword);
app.post("/uploadHealthRecord/:id", uploadHealthRecord);
app.get("/getHealthRecords/:id", getHealthRecords);
app.get("/removeHealthRecords/:patientId/:recordName", removeHealthRecord);
app.get("/getPackage/:id", getPackage);
app.put("/subscribePackage/:id", subscribePackage);
app.put("/subscribePrescription/:id", subscribePres);
app.get("/getCurrentPackage/:id", getCurrentPackage);
app.put("/unsubscribePackage/:id", unsubscribePackage);
app.put("/selectAppointment/:id", selectAppointment);
app.post("/scheduleFollowUpDoctor", scheduleFollowUpDoctor);
app.post("/scheduleFollowUpPatient", scheduleFollowUpPatient);
app.get("/checkWallet/:id", checkWallet);
app.post("/cancelAppointment/:id", cancelAppointment);
app.get("/downloadPrescription/:id", downloadPrescription);
app.post("/sendMessage/:id/:receiver_id", sendMessage);
app.get("/getMessages/:id", getMessages);
app.get("/getChats/:id", getChats);
app.get("/checkPatientDoctorChat/:id/:receiver_id", checkPatientDoctorChat);
app.put("/acceptFollowUp/:id", acceptFollowUp);
app.put("/revokeFollowUp/:id", revokeFollowUp);
app.get("/getPendingAppointments", getPendingAppointments);
app.post("/acceptContract/:id", acceptContract);