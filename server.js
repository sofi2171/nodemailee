const express = require('express'); // 'const' small hona chahiye
const SibApiV3Sdk = require('sib-api-v3-sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- BREVO CONFIG (Using Environment Variable) ---
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];

// Render par key 'BREVO_API_KEY' ke naam se honi chahiye
apiKey.apiKey = process.env.BREVO_API_KEY; 

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

app.get('/', (req, res) => {
    res.send('<h1 style="color: #0092ff; text-align: center; font-family: sans-serif; margin-top: 50px;">PharmPro Backend is Secure! ✅</h1>');
});

// 1. Welcome Email API
app.post('/api/welcome-email', async (req, res) => {
    const { email, userName } = req.body;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Welcome to PharmPro";
    sendSmtpEmail.htmlContent = `<html><body style="font-family: Arial;"><h2>Hello ${userName}!</h2><p>Welcome to PharmPro. Your account is ready.</p></body></html>`;
    sendSmtpEmail.sender = { "name": "PharmPro Support", "email": "sufiangsufiang15@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Welcome email sent to ${email}`);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Email Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Stock Alert API
app.post('/api/stock-alert', async (req, res) => {
    const { email, itemName, currentQty } = req.body;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = `⚠️ Low Stock Alert: ${itemName}`;
    sendSmtpEmail.htmlContent = `<html><body style="font-family: Arial;"><h2>Stock Warning!</h2><p>Item <b>${itemName}</b> is running low. Current Quantity: <b>${currentQty}</b></p></body></html>`;
    sendSmtpEmail.sender = { "name": "PharmPro Alerts", "email": "sufiangsufiang15@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`⚠️ Alert sent for ${itemName}`);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Alert Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Secure Server running on port ${PORT}`));
