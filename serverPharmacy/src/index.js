const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("../../serverClinic/node_modules/dotenv/lib/main").config();
const MongoURI = process.env.MONGO_URI;
const {addPatient, addPharmacist, addAdmin, removePharmacist, removePatient, getPendingPharmacists, getMedicines, addMedicine, editMedicine, getMedicineByName, getMedicineByUse, getPatientById, getPharmacistById, getAdmins, getPatients, getPharmacists, acceptPharmacist, rejectPharmacist, getUserId, getUserType, login, checkOTP, changePassword, resetPassword, addMedicineToCart, removeMedicineFromCart, changeMedicineQuantityInCart, createOrder, getCart, addAddress, getAddresses, payWithWallet, payWithCard, payWithCash, getOrder, getOrders, cancelOrder, checkWallet, archiveMedicine, unarchiveMedicine, getSalesReport, getSalesReportByMedicine, getSalesReportByDate, getSalesReportByMedicineAndDate, addPerscriptionToCart, getOrdersByPatient, getAlternativeMedicines, checkMedicinesStockHelper, getNotifications, sendMessage, getMessages, getChats} = require("./routes/controller");
const bodyParser = require('body-parser');


const app = express();
const cors = require("cors");
app.use(cors());
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const port = process.env.PORT || "3000";

app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect(MongoURI)
.then(()=>{
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
            success_url: 'http://localhost:3001/patient/medicines',
            cancel_url: 'http://localhost:3001/',
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/addPatient", addPatient);
app.post("/addPharmacist", addPharmacist);
app.post("/addAdmin", addAdmin);
app.delete("/removePatient/:id", removePatient);
app.delete("/removePharmacist/:id", removePharmacist);
app.get("/getPendingPharmacists", getPendingPharmacists);
app.post("/addMedicine", addMedicine);
app.put("/editMedicine/:id", editMedicine);
app.get("/medicines", getMedicines);
app.get("/getMedicineByName/:name", getMedicineByName);
app.get("/getMedicineByUse/:use", getMedicineByUse);
app.get("/getPharmacistById/:id", getPharmacistById);
app.get("/admins", getAdmins );
app.get("/patients", getPatients );
app.get("/pharmacists", getPharmacists);
app.get("/patients/:id", getPatientById);
app.put("/acceptPharmacist/:id", acceptPharmacist);
app.put("/rejectPharmacist/:id", rejectPharmacist);
app.post("/checkOTP/:username", checkOTP);
app.put("/changePassword", changePassword);
app.put("/resetPassword", resetPassword);
app.post("/addMedicineToCart/:id", addMedicineToCart);
app.delete("/removeMedicineFromCart/:id", removeMedicineFromCart);
app.put("/changeMedicineQuantityInCart/:id", changeMedicineQuantityInCart);
app.get("/getCart/:id", getCart);
app.post("/addAddress/:id", addAddress);
app.get("/getAddresses/:id", getAddresses);
app.post("/createOrder/:id", createOrder);
app.get("/getOrder/:id", getOrder);
app.get("/getOrders/:id", getOrders);
app.put("/cancelOrder/:id", cancelOrder);
app.post("/payWithWallet/:id", payWithWallet);
app.post("/payWithCard/:id", payWithCard);
app.post("/payWithCash/:id", payWithCash);
app.get("/checkWallet/:id", checkWallet);
app.put("/archiveMedicine/:id", archiveMedicine);
app.put("/unarchiveMedicine/:id", unarchiveMedicine);
app.get("/getSalesReport/:month", getSalesReport);
app.get("/getSalesReportByMedicine/:month/:medicine", getSalesReportByMedicine);
app.get("/getSalesReportByDate/:month/:date", getSalesReportByDate);
app.get("/getSalesReportByMedicineAndDate/:month/:medicine/:date", getSalesReportByMedicineAndDate);
app.post("/addPerscriptionToCart/:id/:presc", addPerscriptionToCart);
app.get("/getOrdersByPatient/:id", getOrdersByPatient);
app.get("/getAlternativeMedicines/:id", getAlternativeMedicines);
app.post("/checkMedicinesStock", checkMedicinesStockHelper);
app.get("/getMedNotifications", getNotifications);
app.post("/sendMessage", sendMessage);
app.get("/getMessages", getMessages);
app.get("/getChats", getChats);