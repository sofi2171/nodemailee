const express = require('express'); // Fixed: 'const' must be lowercase
const SibApiV3Sdk = require('sib-api-v3-sdk');
const cors = require('cors');

const app = express();

// Middleware - Optimized for Netlify/Frontend connection
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// --- BREVO CONFIGURATION ---
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];

// Render Dashboard -> Environment Variables mein 'BREVO_API_KEY' set karein
apiKey.apiKey = process.env.BREVO_API_KEY; 

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Root Route - To check if backend is alive
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #0092ff;">PharmPro Backend is Secure! ✅</h1>
            <p style="color: #555;">Server is live and listening for requests.</p>
        </div>
    `);
});

/**
 * 1. Welcome Email API
 */
app.post('/api/welcome-email', async (req, res) => {
    const { email, userName } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, error: "Email is required" });
    }

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Welcome to PharmPro";
    sendSmtpEmail.htmlContent = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #2563eb;">Hello ${userName || 'User'}!</h2>
                    <p>Welcome to <b>PharmPro</b>. Your pharmacy management account has been created successfully.</p>
                    <p>Manage your inventory and track your sales with ease.</p>
                    <br>
                    <p style="font-size: 12px; color: #777;">Regards,<br>PharmPro Team</p>
                </div>
            </body>
        </html>`;
    sendSmtpEmail.sender = { "name": "PharmPro Support", "email": "sufiangsufiang15@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Welcome email sent to: ${email}`);
        res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("❌ Brevo Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * 2. Stock Alert API
 */
app.post('/api/stock-alert', async (req, res) => {
    const { email, itemName, currentQty } = req.body;

    if (!email || !itemName) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `⚠️ Low Stock Alert: ${itemName}`;
    sendSmtpEmail.htmlContent = `
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <div style="background-color: #fff5f5; border-left: 5px solid #c53030; padding: 20px;">
                    <h2 style="color: #c53030; margin-top: 0;">Stock Warning!</h2>
                    <p>Item: <b style="font-size: 18px;">${itemName}</b></p>
                    <p>Current Quantity: <b style="color: #c53030;">${currentQty}</b></p>
                    <p>Please restock immediately.</p>
                </div>
            </body>
        </html>`;
    sendSmtpEmail.sender = { "name": "PharmPro Alerts", "email": "sufiangsufiang15@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`⚠️ Alert sent for: ${itemName}`);
        res.status(200).json({ success: true, message: "Alert sent" });
    } catch (error) {
        console.error("❌ Brevo Alert Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Secure Server running on port ${PORT}`);
});
