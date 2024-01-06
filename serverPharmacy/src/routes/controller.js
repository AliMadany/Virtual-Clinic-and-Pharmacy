const patientModel = require('../models/Patient.js');
const pharmacistModel = require('../models/Pharmacist.js');
const adminModel = require('../models/Admin.js');
const medicineModel = require('../models/Medicine.js');
const OTPModel = require('../models/OTP.js');
const orderModel = require('../models/Order.js');
const { default: mongoose } = require('mongoose');
const nodemailer = require('nodemailer');

const addPatient = async (req, res) => {
    const { name, email, username, password, date_of_birth, gender, mobile_number } = req.body;
    const emergency_contact = {
        name: req.body.emergencyContactName,
        mobile_number: req.body.emergencyContactMobile,
        relation: req.body.emergencyContactRelation
    };
    try {
        const user = await patientModel.findOne({ username: username });
        const pharma = await pharmacistModel.findOne({ username: username });
        const admin = await adminModel.findOne({ username: username });
        if (user || pharma || admin) {
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

const getPatients = async (req, res) => {
    try {
        const patients = await patientModel.find();
        res.status(200).json(patients);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const addPharmacist = async (req, res) => {
    const { name, email, username, password, date_of_birth, hourly_rate, affiliation, education, pharmacist_id, pharmacy_degree, working_license } = req.body;
    try {
        const user = await pharmacistModel.findOne({ username: username });
        const patient = await patientModel.findOne({ username: username });
        const admin = await adminModel.findOne({ username: username });

        // Convert byte strings back to Buffers
        const pharmacistIdBuffer = Buffer.from(pharmacist_id, 'binary');
        const pharmacyDegreeBuffer = Buffer.from(pharmacy_degree, 'binary');
        const workingLicenseBuffer = Buffer.from(working_license, 'binary');



        if (user || patient || admin) {
            res.status(400).json("Pharmacist already exists!");
        } else {
            const user = await pharmacistModel.create({ name, email, username, password, date_of_birth, hourly_rate, affiliation, education, pharmacist_id: pharmacistIdBuffer, pharmacy_degree: pharmacyDegreeBuffer, working_license: workingLicenseBuffer });
            await user.save();
            res.status(200).json("Pharmacist created successfully!");
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const addAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await adminModel.findOne({ username: username });
        const patient = await pharmacistModel.findOne({ username: username });
        const pharmacist = await patientModel.findOne({ username: username });
        if (user || patient || pharmacist) {
            res.status(400).json("Admin already exists!");
        } else {
            const user = await adminModel.create({ username, password });
            await user.save();
            res.status(200).json("Admin created successfully!");
        }
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const removePharmacist = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pharmacistModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }
        await pharmacistModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Pharmacist deleted successfully" });
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

const getPendingPharmacists = async (req, res) => {
    try {
        const pharmacists = await pharmacistModel.find({ status: "pending" });
        res.status(200).json(pharmacists);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const addMedicine = async (req, res) => {
    const { name, price, picture, description, quantity, use, ingredients } = req.body;
    try {
        const pictureBuffer = Buffer.from(picture, 'binary');

        const medicine = await medicineModel.findOne({ name: name });
        if (medicine) {
            res.status(400).json("Medicine already exists!");
        } else {
            const medicine = await medicineModel.create({ name, price, picture: pictureBuffer, description, quantity, use, ingredients });
            await medicine.save();
            res.status(200).json("Medicine created successfully!");
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const editMedicine = async (req, res) => {
    const { id } = req.params;
    const { name, price, picture, description, quantity, sales, use, ingredients } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json(`No medicine with id: ${id}`);
        } else {
            const updatedMedicine = { name, price, picture, description, quantity, sales, use, ingredients, _id: id };
            await medicineModel.findByIdAndUpdate(id, updatedMedicine, { new: true });
            res.status(200).json(updatedMedicine);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getMedicines = async (req, res) => {
    try {
        const medicines = await medicineModel.find();
        res.status(200).json(medicines);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getMedicineByName = async (req, res) => {
    const { name } = req.params;
    try {
        const medicine = await medicineModel.findOne({ name: name });
        res.status(200).json(medicine);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getMedicineByUse = async (req, res) => {
    const { use } = req.params;
    try {
        const medicine = await medicineModel.findOne({ use: use });
        res.status(200).json(medicine);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await patientModel.findById(id);
        res.status(200).json(patient);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPharmacistById = async (req, res) => {
    const { id } = req.params;
    try {
        const pharmacist = await pharmacistModel.findById(id);
        res.status(200).json(pharmacist);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPharmacists = async (req, res) => {
    try {
        const pharmacists = await pharmacistModel.find({ status: "approved" });
        res.status(200).json(pharmacists);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
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

const acceptPharmacist = async (req, res) => {
    const { id } = req.params;
    try {
        const pharmacist = await pharmacistModel.findById(id);
        if (!pharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }
        pharmacist.status = "approved";
        await pharmacist.save();
        res.status(200).json({ message: "Pharmacist accepted successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const rejectPharmacist = async (req, res) => {
    const { id } = req.params;
    try {
        const pharmacist = await pharmacistModel.findById(id);
        if (!pharmacist) {
            return res.status(404).json({ message: "Pharmacist not found" });
        }
        pharmacist.status = "rejected";
        await pharmacist.save();
        res.status(200).json({ message: "Pharmacist rejected successfully" });
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
        } else if (userType === "pharmacist") {
            const pharmacist = await pharmacistModel.findOne({ username: username });
            return pharmacist._id;
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
            const pharmacist = await pharmacistModel.findOne({ username: username });
            if (pharmacist) {
                return "pharmacist";
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
        const pharmacist = await pharmacistModel.findOne({ username: username });
        const admin = await adminModel.findOne({ username: username });
        if (patient) {
            if (patient.password === password) {
                return true;
            } else {
                return false;
            }
        } else if (pharmacist) {
            if (pharmacist.password === password) {
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
        const pharmacist = await pharmacistModel.findOne({ username: username });
        if (pharmacist) {
            pharmacist.password = password;
            await pharmacist.save();
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
    // Generate OTP
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const tempOTP = await OTPModel.findOne({ username: username });
    if (tempOTP) {
        tempOTP.otp = OTP;
        await tempOTP.save();
    } else {
        await OTPModel.create({ username: username, otp: OTP });
    };
    // Create a transporter using your email service details
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    // Set up the email options
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset',
        text: 'To reset your password enter the following OTP: ' + OTP
    };
    // Send the email
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
        const pharmacist = await pharmacistModel.findOne({ username: username });
        if (pharmacist) {
            await resetPasswordEmail(pharmacist.email, pharmacist.username);
            res.status(200).json("Email sent successfully");
        }
        else {
            const patient = await patientModel.findOne({ username: username });
            if (patient) {
                await resetPasswordEmail(patient.email, patient.username);
                res.status(200).json("Email sent successfully");
            }
            else {
                const admin = await adminModel.findOne({ username: username });
                if (admin) {
                    await resetPasswordEmail(admin.email, admin.username);
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

const addMedicineToCart = async (req, res) => {
    const { id } = req.params;
    const { medicine, quantity } = req.body;
    try {
        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const existingMedicine = patient.cart.find(item => item.medicine.equals(medicine));
        if (existingMedicine) {
            existingMedicine.quantity += quantity;
        } else {
            patient.cart.push({ medicine, quantity });
        }
        await patient.save();
        res.status(200).json({ message: "Medicine added to cart successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const removeMedicineFromCart = async (req, res) => {
    const { id } = req.params;
    const { medicine } = req.body;
    try {
        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        patient.cart.splice(patient.cart.indexOf(medicine), 2);
        await patient.save();
        res.status(200).json({ message: "Medicine removed from cart successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const changeMedicineQuantityInCart = async (req, res) => {
    const { id } = req.params;
    const { medicine, quantity } = req.body;
    try {
        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const existingMedicine = patient.cart.find(item => item.medicine.equals(medicine));
        if (existingMedicine) {
            existingMedicine.quantity = quantity;
        }
        await patient.save();
        res.status(200).json({ message: "Medicine quantity changed successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const createOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { address, payment_method } = req.body;
        const patient = await patientModel.findById(id);
        var amount = 0;
        for (const item of patient.cart) {
            const medicine = await medicineModel.findById(item.medicine);
            if (medicine.quantity < item.quantity) {
                res.status(400).json("Insufficient quantity");
            } else {
                medicine.quantity -= item.quantity;
                amount += item.quantity * medicine.price;
            }
        }
        const items = patient.cart;
        const newItems = [];
        for (const item of items) {
            const tempItem = await medicineModel.findById(item.medicine);
            newItems.push({ name: tempItem.name, price: tempItem.price, quantity: item.quantity });
        }
        console.log(newItems);
        date = new Date().toISOString().slice(0, 10);
        const order = await orderModel.create({ patient_id: id, items: newItems, address, date, amount, payment_method });
        await order.save();
        patient.cart = [];
        await patient.save();
        res.status(200).json({ order_id: order._id });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getCart = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await patientModel.findById(id).populate('cart.medicine');
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient.cart);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const addAddress = async (req, res) => {
    const { id } = req.params;
    const { address } = req.body;
    try {
        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        patient.addresses.push({ address });
        await patient.save();
        res.status(200).json({ message: "Address added successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getAddresses = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await patientModel.findById(id);
        if (!patient) {
            res.status(404).json({ message: "Patient not found" });
        } else {
            res.status(200).json(patient.addresses);
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const payWithWallet = async (req, res) => {
    const { id } = req.params;
    const { order_id } = req.body;
    try {
        const order = await orderModel.findById(order_id);
        const amount = order.amount;
        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        if (patient.wallet < amount) {
            res.status(400).json("Insufficient funds");
        } else {
            patient.wallet -= amount;
            await patient.save();
            order.paid = true;
            await order.save();
            res.status(200).json({ message: "Payment successful" });
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const payWithCard = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderModel.findById(id);
        const items = order.items;

        fetch('http://localhost:3000/create-checkout-session', {
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
            // window.location = url;
            // console.log(url);
            res.status(200).json({ url: url });
            order.paid = true;
            await order.save();
        }).catch(e => {
            console.error(e)
        });

    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const payWithCash = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderModel.findById(id);
        order.paid = true;
        await order.save();
        res.status(200).json({ message: "Payment successful" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderModel.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        } else {
            const orders = await orderModel.find({ patient_id: id });
            return res.status(200).json(orders);
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const cancelOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderModel.findById(id);
        const patient = await patientModel.findById(order.patient_id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = "cancelled";
        await order.save();
        for (const item of patient.cart) {
            const medicine = await medicineModel.findById(item.medicine);
            medicine.quantity += item.quantity;
            await medicine.save();
        }
        res.status(200).json({ message: "Order cancelled successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const checkWallet = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await patientModel.findById(id);
        wallet = patient.wallet;
        res.status(200).json(wallet);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const archiveMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const medicine = await medicineModel.findById(id);
        medicine.archived = true;
        await medicine.save();
        res.status(200).json("Medicine archived successfully!");
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const unarchiveMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const medicine = await medicineModel.findById(id);
        medicine.archived = false;
        await medicine.save();
        res.status(200).json("Medicine unarchived successfully!");
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const getSalesReport = async (req, res) => {
    const { month } = req.params; // format = YYYY-MM
    try {
        const orders = await orderModel.find({ date: { $regex: month } });
        var sales = 0;
        for (const order of orders) {
            sales += order.amount;
        }
        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const getSalesReportByMedicine = async (req, res) => {
    const { month, medicine } = req.params; // format = YYYY-MM
    try {
        const orders = await orderModel.find({ date: { $regex: month } });
        var sales = 0;
        for (const order of orders) {
            for (const item of order.items) {
                if (item._id === medicine) {
                    sales += item.price * item.quantity;
                }
            }
        }
        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const getSalesReportByDate = async (req, res) => {
    const { month, date } = req.params; // format = YYYY-MM
    try {
        const orders = await orderModel.find({ date: { $regex: month } });
        var sales = 0;
        for (const order of orders) {
            if (order.date === date) {
                sales += order.amount;
            }
        }
        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const getSalesReportByMedicineAndDate = async (req, res) => {
    const { month, medicine, date } = req.params; // format = YYYY-MM
    try {
        const orders = await orderModel.find({ date: { $regex: month } });
        var sales = 0;
        for (const order of orders) {
            if (order.date === date) {
                for (const item of order.items) {
                    if (item._id === medicine) {
                        sales += item.price * item.quantity;
                    }
                }
            }
        }
        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ err: error.message });
    }
}

const addPerscriptionToCart = async (req, res) => {
    const { id, presc } = req.params;
    try {
        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        patient.cart.push({ presc });
        await patient.save();
        res.status(200).json({ message: "Perscription added to cart successfully" });
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getOrdersByPatient = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await orderModel.find({ patient_id: id });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getAlternativeMedicines = async (req, res) => {
    const { id } = req.params;
    try {
        const medicine = await medicineModel.findById(id);
        const medicines = await medicineModel.find();
        const alternatives = [];
        for (const item of medicines) {
            if (item.ingredients[0] === medicine.ingredients[0] && item._id !== medicine._id) {
                alternatives.push(item);
            }
        }
        res.status(200).json(alternatives);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const outOfStockEmail = async (medicine) => {
    try {
        // send email to all approved pharmacists
        const pharmacists = await pharmacistModel.find({ status: "approved" });
        for (const pharmacist of pharmacists) {
            // Create a transporter using your email service details
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            // Set up the email options
            const mailOptions = {
                from: process.env.EMAIL,
                to: pharmacist.email,
                subject: 'Medicine Out of Stock',
                text: 'The medicine ' + medicine.name + ' is out of stock!'
            };
            // Send the email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const checkMedicinesStock = async () => {
    try {
        const medicines = await medicineModel.find();
        const meds = [];
        for (const item of medicines) {
            if (item.quantity === 0 && item.in_stock) {
                item.in_stock = false;
                meds.push(item);
                await item.save();
                await outOfStockEmail(item);
            }
        }
        return meds;
    }
    catch (error) {
        console.log(error.message);
    }
}

const addMedNotification = async (medicine, date, time) => {
    try {
        const notification = await notificationModel.create({ medicine: medicine, date: date, time: time });
        await notification.save();
    }
    catch (error) {
        console.log(error.message);
    }
}

const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel.find();
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const checkMedicinesStockHelper = async (req, res) => {
    try {
        const medicines = await checkMedicinesStock();
        res.status(200).json(medicines);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
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

module.exports = { addPatient, addPharmacist, addAdmin, removePharmacist, removePatient, getPendingPharmacists, getMedicines, addMedicine, editMedicine, getMedicineByName, getMedicineByUse, getPatientById, getPharmacistById, getAdmins, getPatients, getPharmacists, acceptPharmacist, rejectPharmacist, getUserId, getUserType, login, checkOTP, changePassword, resetPassword, addMedicineToCart, removeMedicineFromCart, changeMedicineQuantityInCart, createOrder, getCart, addAddress, getAddresses, payWithWallet, payWithCard, payWithCash, getOrder, getOrders, cancelOrder, checkWallet, archiveMedicine, unarchiveMedicine, getSalesReport, getSalesReportByMedicine, getSalesReportByDate, getSalesReportByMedicineAndDate, addPerscriptionToCart, getOrdersByPatient, getAlternativeMedicines, checkMedicinesStockHelper, getNotifications, sendMessage, getMessages, getChats };