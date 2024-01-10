const patientModel = require('../models/Patient.js');
const doctorModel = require('../models/Doctor.js');
const adminModel = require('../models/Admin.js');
const appointmentModel = require('../models/Appointment.js');
const perscriptionModel = require('../models/Prescription.js');
const packageModel = require('../models/Package.js');
const healthRecordsModel = require('../models/HealthRecords.js');
const notificationModel = require('../models/Notification.js');
const { default: mongoose, Mongoose } = require('mongoose');
const OTPModel = require('../models/OTP.js');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

const acceptContract = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await doctorModel.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        doctor.acceptedContract = true;
        await doctor.save();
        res.status(200).json({ message: "Contract accepted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const addPatient = async (req, res) => {
    const { name, email, username, password, date_of_birth, gender, mobile_number } = req.body;
    const emergency_contact = {
        name: req.body.emergencyContactName,
        mobile_number: req.body.emergencyContactMobile,
        relation: req.body.emergencyContactRelation
    };
    try {
        const user = await patientModel.findOne({ username: username });
        if (user) {
            res.status(400).json("Patient already exists!");
        } else {
            const user = await patientModel.create({ name, email, username, password, date_of_birth, gender, mobile_number, emergency_contact });
            await user.save();
            res.status(200).json("Patient created successfully!");
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const addDoctor = async (req, res) => {
    const { name, email, username, password, date_of_birth, hourly_rate, affiliation, education, specialty, doctor_id, medical_license, medical_degree } = req.body;
    try {
        const user = await doctorModel.findOne({ username: username });
        if (user) {
            res.status(400).json("Doctor already exists!");
        } else {
            const doctorIdBuffer = Buffer.from(doctor_id, 'binary');
            const doctorLiceseBuffer = Buffer.from(medical_license, 'binary');
            const doctorDegreeBuffer = Buffer.from(medical_degree, 'binary');

            const user = await doctorModel.create({ name, email, username, password, date_of_birth, hourly_rate, affiliation, education, specialty, doctor_id: doctorIdBuffer, medical_license: doctorLiceseBuffer, medical_degree: doctorDegreeBuffer });
            await user.save();
            res.status(200).json("Doctor created successfully!");
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const addAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await adminModel.findOne({ username: username });
        if (user) {
            res.status(400).json("Admin already exists!");
        } else {
            const user = await adminModel.create({ username, password });
            await user.save();
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find();
        res.status(200).json(admins);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" });
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const removeDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await doctorModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        await doctorModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Doctor deleted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const removePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await patientModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Patient not found" });
        }
        await patientModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Patient deleted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getPendingDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "pending" });
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const addPackage = async (req, res) => {
    const { name, price, session_discount, medicine_discount, family_discount } = req.body;
    try {
        const package = await packageModel.findOne({ name: name });
        if (package) {
            res.status(400).json("Package already exists!");
        } else {
            const package = await packageModel.create({ name, price, session_discount, medicine_discount, family_discount });
            await package.save();
            res.status(200).json("Package created successfully!");
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const editPackage = async (req, res) => {
    const { id } = req.params;
    const { name, price, session_discount, medicine_discount, family_discount } = req.body;
    try {
        const package = await packageModel.findById(id);
        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }
        await packageModel.findByIdAndUpdate(id, { name, price, session_discount, medicine_discount, family_discount });
        res.status(200).json({ message: "Package updated successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const removePackage = async (req, res) => {
    const { id } = req.params;
    try {
        const package = await packageModel.findById(id);
        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }
        await packageModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Package deleted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getPackages = async (req, res) => {
    try {
        const packages = await packageModel.find();
        res.status(200).json(packages);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const editDoctorDetails = async (req, res) => {
    const { id } = req.params;
    const { email, hourly_rate, affiliation } = req.body;
    try {
        const doctor = await doctorModel.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        await doctorModel.findByIdAndUpdate(id, { email, hourly_rate, affiliation });
        res.status(200).json({ message: "Doctor updated successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const addFamilyMember = async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, nationalId, relation } = req.body;

    try {
        const user = await patientModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Patient not found" });
        }
        user.family_members.push({ name, age, gender, nationalId, relation })
        await user.save();
        res.status(200).json("Family member added successfully!");
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const getFamilyMembers = async (req, res) => {
    const { id } = req.params;
    try {
        //populate family members health package
        const patient = await patientModel.findById(id).populate('family_members.health_package');
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient.family_members);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getAppointmentsByDate = async (req, res) => {
    const { date } = req.params;
    try {
        const appointments = await appointmentModel.find({ date: date });
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getAppointmentsByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const appointments = await appointmentModel.find({ status: status });
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getAppointmentsByPatient = async (req, res) => {
    const { id } = req.params;
    try {
        const appointments = await appointmentModel.find({ patient_id: id }).populate('doctor_id');
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }

}

const getAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ }).populate('doctor_id');
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }

}


const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await patientModel.findById(id).populate('health_package');
        res.status(200).json(patient);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getAllPatients = async (req, res) => {
    try {
        const patients = await patientModel.find();
        res.status(200).json(patients);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPatientByName = async (req, res) => {
    const { name } = req.params;
    try {
        const patients = await patientModel.find({ name: name });
        res.status(200).json(patients);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPatientsByAppointments = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await appointmentModel.find();
        const patientsByAppointments = [];
        for (let i = 0; i < appointments.length; i++) {
            if (appointments[i].doctor_id == id && appointments[i].patient_id != null) {
                const patient = await patientModel.findById(appointments[i].patient_id);
                patientsByAppointments.push(patient);
            }
        }
        res.status(200).json(patientsByAppointments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPatientsByUpcomingAppointments = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await appointmentModel.find();
        const patientsByAppointments = [];
        for (let i = 0; i < appointments.length; i++) {
            if (appointments[i].doctor_id == id && appointments[i].status == "approved") {
                const patient = await patientModel.findById(appointments[i].patient_id);
                patientsByAppointments.push(patient);
            }
        }
        res.status(200).json(patientsByAppointments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const getDoctorByName = async (req, res) => {
    const { name } = req.params;
    try {
        const doctors = await doctorModel.find({ name: name });
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getDoctorBySpecialty = async (req, res) => {
    const { specialty } = req.params;
    try {
        const doctors = await doctorModel.find({ specialty: specialty });
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getDoctorByDate = async (req, res) => {
    const { date } = req.params;
    try {
        const doctors = await doctorModel.find();
        const appointments = await appointmentModel.find({ status: "free" });
        const doctorsByDate = [];
        for (let i = 0; i < doctors.length; i++) {
            for (let j = 0; j < appointments.length; j++) {
                if (doctors[i]._id == appointments[j].doctor_id && appointments[j].date == date) {
                    if (doctors[i].status == "approved") {
                        doctorsByDate.push(doctors[i]);
                    }
                }
            }
        }
        res.status(200).json(doctorsByDate);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getDoctorBySpecialtyAndDate = async (req, res) => {
    const { specialty, date } = req.params;
    try {
        const doctors = await doctorModel.find({ specialty: specialty });
        const appointments = await appointmentModel.find({ status: "free" });
        const doctorsBySpecialtyAndDate = [];
        for (let i = 0; i < doctors.length; i++) {
            for (let j = 0; j < appointments.length; j++) {
                if (doctors[i]._id == appointments[j].doctor_id && appointments[j].date == date) {
                    doctorsBySpecialtyAndDate.push(doctors[i]);
                }
            }
        }
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getDoctorByDateTime = async (req, res) => {
    const { date, time } = req.params;
    try {
        const doctors = await doctorModel.find();
        const appointments = await appointmentModel.find({ status: "free" });
        const doctorsByDateTime = [];
        for (let i = 0; i < doctors.length; i++) {
            for (let j = 0; j < appointments.length; j++) {
                if (doctors[i]._id == appointments[j].doctor_id && appointments[j].date == date, appointments[j].start_time == time) {
                    if (doctors[i].status == "approved") {
                        doctorsByDateTime.push(doctors[i]);
                    }
                }
            }
        }
        res.status(200).json(doctorsByDateTime);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getDoctorBySpecialtyAndDateTime = async (req, res) => {
    const { specialty, date, time } = req.params;
    try {
        const doctors = await doctorModel.find({ specialty: specialty });
        const appointments = await appointmentModel.find({ status: "free" });
        const doctorsBySpecialtyAndDateTime = [];
        for (let i = 0; i < doctors.length; i++) {
            for (let j = 0; j < appointments.length; j++) {
                if (doctors[i]._id == appointments[j].doctor_id && appointments[j].time_slot.date == date, appointments[j].time_slot.start_time == time) {
                    doctorsBySpecialtyAndDateTime.push(doctors[i]);
                }
            }
        }
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getDoctorById = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await doctorModel.findById(id);
        res.status(200).json(doctor);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPrescriptionsByPatient = async (req, res) => {
    const { id } = req.params;
    try {
        const prescriptions = await perscriptionModel.find({ patient_id: id }).populate('doctor_id');
        res.status(200).json(prescriptions);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getAppointmentsByDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const appointments = await appointmentModel.find({ doctor_id: id }).populate('patient_id');
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPrescriptionsByDate = async (req, res) => {
    const { id, date } = req.params;
    try {
        const prescriptions = await perscriptionModel.find({ date: date, patient_id: id });
        res.status(200).json(prescriptions);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPrescriptionsByDoctor = async (req, res) => {
    const { id, doc_id } = req.params;
    try {
        const prescriptions = await perscriptionModel.find({ doctor_id: doc_id, patient_id: id });
        res.status(200).json(prescriptions);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPrescriptionByStatus = async (req, res) => {
    const { id, status } = req.params;
    try {
        const prescriptions = await perscriptionModel.find({ status: status, patient_id: id });
        res.status(200).json(prescriptions);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPrescription = async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await perscriptionModel.findById(id);
        res.status(200).json(prescription);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const addAppointment = async (req, res) => {
    const { patient_id, doctor_id, date, start_time, end_time } = req.body;
    try {
        const appointment = await appointmentModel.findOne({ patient_id: patient_id, doctor_id: doctor_id, date: date, start_time: start_time, end_time: end_time });
        if (appointment) {
            res.status(400).json("Appointment already exists!");
        } else {
            const appointment = await appointmentModel.create({ patient_id, doctor_id, date, start_time, end_time, status: req.body.status? req.body.status : "free" });
            await appointment.save();
            const notification = await notificationModel.create({ appointment_id: appointment._id, status: "created" });
            await notification.save();
            res.status(200).json("Appointment created successfully!");
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const editAppointment = async (req, res) => {
    const { id } = req.params;
    const { patient_id, doctor_id, date, start_time, end_time, status } = req.body;
    try {
        const appointment = await appointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        await appointmentModel.findByIdAndUpdate(id, { patient_id, doctor_id, date, start_time, end_time, status });
        await notificationModel.findOneAndUpdate({ appointment_id: id, status: "edited" });
        res.status(200).json({ message: "Appointment updated successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const removeAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await appointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        await appointmentModel.findByIdAndDelete(id);
        await notificationModel.findOneAndUpdate({ appointment_id: id, status: "deleted" });
        res.status(200).json({ message: "Appointment deleted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const addPrescription = async (req, res) => {
    const { medicines, doctor_id, patient_id, date, status, file } = req.body;
    try {
        const prescription = await perscriptionModel.findOne({ medicines: medicines, doctor_id: doctor_id, patient_id: patient_id, date: date, file: file });
        if (prescription) {
            res.status(400).json("Prescription already exists!");
        } else {
            const prescription = await perscriptionModel.create({ medicines, doctor_id, patient_id, date, status });
            await prescription.save();
            res.status(200).json("Prescription created successfully!");
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const editPrescription = async (req, res) => {
    const { id } = req.params;
    const { medicines, doctor_id, patient_id, date, status } = req.body;
    try {
        const prescription = await perscriptionModel.findById(id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        await perscriptionModel.findByIdAndUpdate(id, { medicines, doctor_id, patient_id, date, status });
        res.status(200).json({ message: "Prescription updated successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const removePrescription = async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await perscriptionModel.findById(id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        await perscriptionModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Prescription deleted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const removeAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await adminModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Admin not found" });
        }
        await adminModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Admin deleted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getPackageForPatient = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await patientModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const hPackage = await packageModel.findById(user.health_package)
        console.log(hPackage)
        res.status(200).json(hPackage);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const acceptDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await doctorModel.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        doctor.status = "approved";
        await doctor.save();
        res.status(200).json({ message: "Doctor accepted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const rejectDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await doctorModel.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        doctor.status = "rejected";
        await doctor.save();
        res.status(200).json({ message: "Doctor rejected successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getUserId = async (username, userType) => {
    try {
        if (userType === "patient") {
            const patient = await patientModel.findOne({ username: username });
            return patient._id;
        } else if (userType === "doctor") {
            const doctor = await doctorModel.findOne({ username: username });
            return doctor._id;
        } else if (userType === "admin") {
            const admin = await adminModel.findOne({ username: username });
            return admin._id;
        } else {
            return null;
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getUserType = async (username) => {
    try {
        const patient = await patientModel.findOne({ username: username });
        if (patient) {
            return "patient";
        } else {
            const doctor = await doctorModel.findOne({ username: username });
            if (doctor) {
                return "doctor";
            } else {
                const admin = await adminModel.findOne({ username: username });
                if (admin) {
                    return "admin";
                } else {
                    return null;
                }
            }
        }
    }
    catch (error) {
        return null;
    }
}

const login = async (username, password) => {
    try {
        const patient = await patientModel.findOne({ username: username });
        const doctor = await doctorModel.findOne({ username: username });
        const admin = await adminModel.findOne({ username: username });
        if (patient) {
            if (patient.password === password) {
                return true;
            } else {
                return false;
            }
        } else if (doctor) {
            if (doctor.password === password) {
                return true;
            } else {
                return false;
            }
        }
        else if (admin) {
            if (admin.password === password) {
                return true;
            } else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const changePassword = async (req, res) => {
    const { username, password } = req.body;
    try {
        const doctor = await doctorModel.findOne({ username: username });
        if (doctor) {
            doctor.password = password;
            await doctor.save();
            res.status(200).json("Password changed successfully");
        }
        else {
            const patient = await patientModel.findOne({ username: username });
            if (patient) {
                patient.password = password;
                await patient.save();
                res.status(200).json("Password changed successfully");
            }
            else {
                const admin = await adminModel.findOne({ username: username });
                if (admin) {
                    admin.password = password;
                    await admin.save();
                    res.status(200).json("Password changed successfully");
                }
                else {
                    res.status(400).json("User not found");
                }
            }
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const checkOTP = async (req, res) => {
    const { username } = req.params;
    const { otp } = req.body;
    try {
        const tempOTP = await OTPModel.findOne({ username: username });
        if (tempOTP) {
            if (tempOTP.otp === otp) {
                res.status(200).json({ "flag": true });
            }
            else {
                res.status(200).json({ "flag": false });
            }
        }
        else {
            res.status(400).json("OTP not found");
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const resetPasswordEmail = async (email, username) => {
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const tempOTP = await OTPModel.findOne({ username: username });
    if (tempOTP) {
        tempOTP.otp = OTP;
        await tempOTP.save();
    } else {
        await OTPModel.create({ username: username, otp: OTP });
    };
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset',
        text: 'To reset your password enter the following OTP: ' + OTP
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const resetPassword = async (req, res) => {
    const { username } = req.body;
    try {
        const doctor = await doctorModel.findOne({ username: username });
        if (doctor) {
            resetPasswordEmail(doctor.email, doctor.username);
            res.status(200).json("Email sent successfully");
        }
        else {
            const patient = await patientModel.findOne({ username: username });
            if (patient) {
                resetPasswordEmail(patient.email, patient.username);
                res.status(200).json("Email sent successfully");
            }
            else {
                const admin = await adminModel.findOne({ username: username });
                if (admin) {
                    resetPasswordEmail(admin.email, admin.username);
                    res.status(200).json("Email sent successfully");
                }
                else {
                    res.status(400).json("User not found");
                }
            }
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const uploadHealthRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, file } = req.body;

        const fileBuffer = Buffer.from(file, 'binary');

        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        patient.health_records.push({ name, file: fileBuffer });
        await patient.save();

        res.status(200).json({ message: "Health record uploaded successfully" });
    } catch (error) {
        console.error('Error uploading documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getHealthRecords = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await patientModel.findById(id).select('health_records');
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json(patient.health_records);
    } catch (error) {
        console.error('Error getting health records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const removeHealthRecord = async (req, res) => {
    try {
        const { patientId, recordName } = req.params;

        const patient = await patientModel.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        patient.health_records = patient.health_records.filter(record => record.name !== recordName);
        await patient.save();

        res.status(200).json({ message: "Health record removed successfully" });
    } catch (error) {
        console.error('Error removing health record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getPackage = async (req, res) => {
    const { id } = req.params;
    try {
        const package = await packageModel.findById(id);
        res.status(200).json(package);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const subscribePackage = async (req, res) => {
    const { id } = req.params;
    const { package_id, payment_type, family_member } = req.body;
    try {
        const tempPatient = await patientModel.findById(id);
        var patient = await patientModel.findById(id);
        if (family_member) {
            const index = patient.family_members.findIndex(member => member.nationalId === family_member);
            console.log(index);
            console.log(patient.family_members);
            patient = tempPatient.family_members[index];
        }
        const package = await packageModel.findById(package_id);
        if (payment_type === "wallet") {
            try {
                const amount = package.price;
                if (tempPatient.health_package) {
                    const fam_package = await packageModel.findById(tempPatient.health_package);
                    amount = amount - fam_package.family_discount;
                }
                var wallet = tempPatient.wallet;
                if (wallet >= amount) {
                    wallet = wallet - amount;
                    tempPatient.wallet = wallet;
                    patient.health_package = package_id;
                    patient.renewal_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
                    await tempPatient.save();
                    res.status(200).json("Package subscribed successfully!");
                }
                else {
                    res.status(400).json("Insufficient balance!");
                }
            }
            catch (error) {
                res.status(400).json({ err: error.message });
            }
        } else {
            try {
                var price = package.price;
                if (family_member && tempPatient.health_package) {
                    const fam_package = await packageModel.findById(tempPatient.health_package);
                    price = price - fam_package.family_discount;
                }
                const items = [];
                const item = {
                    name: "Health Package: " + package.name,
                    price: price,
                    quantity: 1
                };

                items.push(item);

                fetch('http://localhost:3100/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: items,
                    })
                }).then(res => {
                    if (res.ok) return res.json()
                    return res.json().then(json => Promise.reject(json))
                }).then(async ({ url }) => {
                    patient.health_package = package_id;
                    patient.renewal_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
                    await tempPatient.save();
                    res.status(200).json({ url: url });
                }).catch(e => {
                    console.error(e)
                });
            }
            catch (error) {
                res.status(400).json({ err: error.message });
            }
        }
        patient.health_package = package_id;
        await patient.save();
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const getCurrentPackage = async (req, res) => {
    const { id } = req.params;
    try {
        patient = await patientModel.findById(id);
        package = await packageModel.findById(patient.health_package);
        res.status(200).json(package);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const unsubscribePackage = async (req, res) => {
    const { id } = req.params;
    const { family_member } = req.body;
    try {
        var patient = await patientModel.findById(id);
        if (family_member) {
            const index = patient.family_members.findIndex(member => member.nationalId === family_member);
            family_members[index].health_package = null;
            family_members[index].cancel_date = new Date().toISOString().split('T')[0];
        } else {
            patient.health_package = null;
            patient.cancel_date = new Date().toISOString().split('T')[0];
        }
        await patient.save();
        res.status(200).json("Package unsubscribed successfully!");
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const selectAppointment = async (req, res) => {
    const { id } = req.params;
    const { appointment_id, payment_type } = req.body;
    try {
        const tempPatient = await patientModel.findById(id);
        var patient = await patientModel.findById(id);
        if (family_member) {
            const index = patient.family_members.findIndex(member => member.nationalId === family_member);
            console.log(index);
            console.log(patient.family_members);
            patient = patient.family_members[index];
        }
        const appointment = await appointmentModel.findById(appointment_id);
        const doctor = await doctorModel.findById(appointment.doctor_id);
        if (payment_type === "wallet") {
            try {
                const amount = doctor.hourly_rate * 1.1;
                if (family_member) {
                    const fam_package = await packageModel.findById(patient.health_package);
                    if (fam_package) {
                        amount = amount - fam_package.family_discount;
                    }
                } else if (tempPatient.health_package) {
                    const fam_package = await packageModel.findById(tempPatient.health_package);
                    if (fam_package) {
                        amount = amount - fam_package.family_discount;
                    }
                }
                var wallet = tempPatient.wallet;
                if (wallet >= amount) {
                    wallet = wallet - amount;
                    tempPatient.wallet = wallet;
                    await patient.save();
                    res.status(200).json("Appointment selected successfully!");
                }
                else {
                    res.status(400).json("Insufficient balance!");
                }
            }
            catch (error) {
                res.status(400).json({ err: error.message });
            }
        } else {
            try {
                var price = doctor.hourly_rate * 1.1
                if (family_member && patient.health_package) {
                    const fam_package = await packageModel.findById(patient.health_package);
                    if (fam_package) {
                        price = price - fam_package.family_discount;
                    }
                } else if (tempPatient.health_package) {
                    const fam_package = await packageModel.findById(tempPatient.health_package);
                    if (fam_package) {
                        price = price - fam_package.family_discount;
                    }
                }
                const items = [];
                const item = {
                    name: "Appointment with " + doctor.name + "- Date: " + appointment.date + " Time: " + appointment.start_time + " - " + appointment.end_time,
                    price: price,
                    quantity: 1
                };

                items.push(item);

                fetch('http://localhost:3100/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: items,
                    })
                }).then(res => {
                    if (res.ok) return res.json()
                    return res.json().then(json => Promise.reject(json))
                }).then(async ({ url }) => {
                    res.status(200).json({ url: url });
                }).catch(e => {
                    console.error(e)
                    res.status(400).json({ err: error.message });
                });
            }
            catch (error) {
                res.status(400).json({ err: error.message });
            }
        }
        if (appointment.patient_id === null) {
            appointment.patient_id = id;
        }
        if (appointment.status === "free") {
            appointment.status = "pending";
        }
        appointment.paid = true;
        await appointment.save();
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const scheduleFollowUpDoctor = async (req, res) => {
    const { patient_id, appointment_id } = req.body;
    try {
        appointment = await appointmentModel.findById(appointment_id);
        appointment.status = "confirmed";
        appointment.patient_id = patient_id;
        await appointment.save();
        res.status(200).json("Follow up scheduled successfully!");
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const scheduleFollowUpPatient = async (req, res) => {
    const { patient_id, appointment_id } = req.body;
    try {
        appointment = await appointmentModel.findById(appointment_id);
        appointment.status = "pending";
        appointment.patient_id = patient_id;
        await appointment.save();
        res.status(200).json("Follow up scheduled successfully!");
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const getPendingAppointments = async (req, res) => {
    const { id } = req.params;
    try {
        const appointments = await appointmentModel.find({ doctor_id: id, status: "pending" }).populate('patient_id');
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const acceptFollowUp = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await appointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        } else {
            appointment.status = "accepted";
            await appointment.save();
            res.status(200).json("Follow up accepted successfully!");
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const revokeFollowUp = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await appointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        } else {
            appointment.status = "revoked";
            await appointment.save();
            res.status(200).json("Follow up revoked successfully!");
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const checkWallet = async (req, res) => {
    const { id } = req.params;
    try {
        let user = await patientModel.findById(id);
        if(!user) {
            user = await doctorModel.findById(id);
        }
        if(!user) {
            user = await adminModel.findById(id);
        }
        
        wallet = user.wallet;
        res.status(200).json(wallet);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const cancelAppointment = async (req, res) => {
    const { id, user } = req.params;
    try {
        const appointment = await appointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        await appointmentModel.findByIdAndDelete(id);
        await notificationModel.findOneAndUpdate({ appointment_id: id, status: "canceled" });
        if (appointment.paid === true) {
            if (user === "patient") {
                if (appointment.date === now.date || (appointment.date === now.date + 1 && appointment.start_time < now.time)) {
                    // no refund
                    res.status(200).json({ message: "Appointment canceled successfully" });
                } else {
                    // refund
                    const patient = await patientModel.findById(appointment.patient_id);
                    const doctor = await doctorModel.findById(appointment.doctor_id);
                    const amount = doctor.hourly_rate * 1.1;
                    var wallet = patient.wallet;
                    wallet = wallet + amount;
                    patient.wallet = wallet;
                    await patient.save();
                    res.status(200).json({ message: "Appointment canceled successfully" });
                }
            } else {
                // refund
                const patient = await patientModel.findById(appointment.patient_id);
                const doctor = await doctorModel.findById(appointment.doctor_id);
                const amount = doctor.hourly_rate * 1.1;
                var wallet = patient.wallet;
                wallet = wallet + amount;
                patient.wallet = wallet;
                await patient.save();
                res.status(200).json({ message: "Appointment canceled successfully" });
            }
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const downloadPrescription = async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await perscriptionModel.findById(id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        } else {
            const file = prescription.file;
            res.status(200).json(file);
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const sendMessage = async (req, res) => {
    const { id, receiver_id } = req.params;
    const { message, date, time } = req.body;
    try {
        const chat = await chatModel.findOne({ user1_id: id, user2_id: receiver_id });
        if (!chat) {
            const chat = await chatModel.findOne({ user1_id: receiver_id, user2_id: id });
        }

        if (chat) {
            chat.messages.push({ sender_id: id, message, date, time });
            await chat.save();
        } else {
            const chat = await chatModel.create({ user1_id: id, user2_id: receiver_id });
            chat.messages.push({ sender_id: id, message, date, time });
            await chat.save();
        }

        res.status(200).json("Message sent successfully!");
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getMessages = async (req, res) => {
    const { id, receiver_id } = req.params;
    try {
        const chat = await chatModel.findOne({ user1_id: id, user2_id: receiver_id });
        if (!chat) {
            const chat = await chatModel.findOne({ user1_id: receiver_id, user2_id: id });
            res.status(200).json(chat.messages);
        } else {
            res.status(200).json(chat.messages);
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getChats = async (req, res) => {
    const { id } = req.params;
    try {
        const chats = await chatModel.find({ user1_id: id });
        const chats2 = await chatModel.find({ user2_id: id });
        const chats3 = chats.concat(chats2);
        res.status(200).json(chats3);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const checkPatientDoctorChat = async (req, res) => {
    const { id, doctor_id } = req.params;
    try {
        const appointments = await appointmentModel.find({ patient_id: id, doctor_id: doctor_id });
        if (appointments.length > 0) {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

module.exports = { getAppointments, acceptContract, addPatient, addDoctor, addAdmin, removeDoctor, removePatient, getPendingDoctors, addPackage, editPackage, removePackage, editDoctorDetails, addFamilyMember, getFamilyMembers, getAppointmentsByDate, getAppointmentsByStatus, getPatientById, getAllPatients, getPatientByName, getPatientsByAppointments, getDoctors, getDoctorByName, getDoctorBySpecialty, getDoctorByDateTime, getDoctorBySpecialtyAndDateTime, getDoctorByDate, getDoctorBySpecialtyAndDate, getDoctorById, getPrescriptionsByPatient, getPrescriptionsByDate, getPrescriptionsByDoctor, getPrescriptionByStatus, getPrescription, addAppointment, editAppointment, removeAppointment, addPrescription, editPrescription, removePrescription, getAdmins, removeAdmin, getPackages, getAppointmentsByPatient, getAppointmentsByDoctor, getPatientsByUpcomingAppointments, getPackageForPatient, acceptDoctor, rejectDoctor, getUserId, getUserType, login, changePassword, checkOTP, resetPassword, uploadHealthRecord, getHealthRecords, removeHealthRecord, getPackage, subscribePackage, getCurrentPackage, unsubscribePackage, selectAppointment, scheduleFollowUpDoctor, scheduleFollowUpPatient, getPendingAppointments, acceptFollowUp, revokeFollowUp, checkWallet, cancelAppointment, downloadPrescription, sendMessage, getMessages, getChats, checkPatientDoctorChat };