const express = require('express');
const Brevo = require('@getbrevo/brevo');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- BREVO CONFIG ---
let defaultClient = Brevo.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = 'Bsk9hnjVFoZPqm6y'; // <--- Jo key tumne di

const apiInstance = new Brevo.TransactionalEmailsApi();

app.get('/', (req, res) => {
    res.send('<h1 style="color: #0092ff; text-align: center; font-family: sans-serif;">PharmPro Brevo Server is Live! 🚀</h1>');
});

// 1. Welcome Email (Signup)
app.post('/api/welcome-email', async (req, res) => {
    const { email, userName } = req.body;
    
    let sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Welcome to PharmPro";
    sendSmtpEmail.htmlContent = `<html><body style="font-family: Arial;"><h1>Welcome ${userName}!</h1><p>Your Pharmacy Management account is now active.</p></body></html>`;
    sendSmtpEmail.sender = { "name": "PharmPro Support", "email": "sufiangsufiang15@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Welcome Email Sent to:", email);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Brevo Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Stock Alert (Inventory)
app.post('/api/stock-alert', async (req, res) => {
    const { email, itemName, currentQty } = req.body;

    let sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `⚠️ Low Stock Alert: ${itemName}`;
    sendSmtpEmail.htmlContent = `<html><body style="font-family: Arial;"><h2>Critical Stock Warning!</h2><p>Item: <b>${itemName}</b></p><p>Current Quantity: <b>${currentQty}</b></p><p>Please restock immediately.</p></body></html>`;
    sendSmtpEmail.sender = { "name": "PharmPro Alerts", "email": "sufiangsufiang15@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("⚠️ Stock Alert Sent for:", itemName);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Brevo Alert Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Brevo Server is running on port ${PORT}`));
