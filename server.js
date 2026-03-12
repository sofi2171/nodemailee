const express = require('express');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- BREVO CONFIG (Using Environment Variable) ---
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];

// Render par hum iska naam 'BREVO_API_KEY' rakhenge
apiKey.apiKey = process.env.BREVO_API_KEY; 

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

app.get('/', (req, res) => {
    res.send('<h1 style="color: #0092ff; text-align: center; font-family: sans-serif;">PharmPro Backend is Secure! ✅</h1>');
});

// Welcome Email API
app.post('/api/welcome-email', async (req, res) => {
    const { email, userName } = req.body;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Welcome to PharmPro";
    sendSmtpEmail.htmlContent = `<html><body><h2>Hello ${userName}!</h2><p>Welcome aboard.</p></body></html>`;
    sendSmtpEmail.sender = { "name": "PharmPro Support", "email": "sufiangsufiang15@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Stock Alert API
app.post('/api/stock-alert', async (req, res) => {
    const { email, itemName, currentQty } = req.body;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = `⚠️ Low Stock Alert: ${itemName}`;
    sendSmtpEmail.htmlContent = `<html><body><h2>Stock Warning!</h2><p>${itemName} is low: ${currentQty}</p></body></html>`;
    sendSmtpEmail.sender = { "name": "PharmPro Alerts", "email": "sufiangsufiang15@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Secure Server running on port ${PORT}`));
