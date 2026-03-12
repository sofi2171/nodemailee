const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors({ origin: '*' })); // Taake har jagah se request accept ho
app.use(express.json());

// --- Home Route: Check karne ke liye ke server live hai ---
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #2563eb;">PharmPro Backend is Live! ✅</h1>
            <p>Ready to send Professional Emails for <b>sufiangsufiang15@gmail.com</b></p>
        </div>
    `);
});

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sufiangsufiang15@gmail.com',
        pass: 'dltcqvgmkrjdgm' // Aapka naya 16-digit App Password (no spaces)
    }
});

// --- Connection Verification (Server start hote hi logs mein batayega) ---
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Gmail Connection Error:", error.message);
    } else {
        console.log("✅ Server is ready to send professional emails!");
    }
});

// --- API 1: Welcome Email (Signup Trigger) ---
app.post('/api/welcome-email', (req, res) => {
    const { email, userName } = req.body;

    const welcomeHTML = `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to PharmPro</h1>
        </div>
        <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
            <p style="font-size: 18px;">Hello <b>${userName}</b>,</p>
            <p>Your professional pharmacy management workspace has been successfully activated.</p>
            <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #2563eb;">Your account is now linked to our automated alert system.</p>
            </div>
            <p>You can now manage your inventory, track sales, and receive real-time stock notifications.</p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; text-align: center;">© 2026 PharmPro Enterprise Edition</p>
        </div>
    </div>`;

    const mailOptions = {
        from: '"PharmPro Support" <sufiangsufiang15@gmail.com>',
        to: email,
        subject: 'Welcome to PharmPro - Account Activated',
        html: welcomeHTML
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("❌ Signup Email Error:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        console.log("✅ Welcome Email sent to:", email);
        res.status(200).json({ success: true, message: 'Email Sent!' });
    });
});

// --- API 2: Low Stock Alert (Inventory Trigger) ---
app.post('/api/stock-alert', (req, res) => {
    const { email, itemName, currentQty } = req.body;

    const alertHTML = `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #ef4444; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">CRITICAL STOCK ALERT</h2>
        </div>
        <div style="padding: 40px; line-height: 1.6;">
            <p>This is an automated notification from your <b>PharmPro Inventory Monitor</b>.</p>
            <div style="margin: 20px 0; padding: 20px; background: #fff1f2; border-radius: 12px; border: 1px dashed #f87171; text-align: center;">
                <p style="margin: 0; color: #991b1b; font-weight: bold;">Product: ${itemName}</p>
                <p style="margin: 5px 0; font-size: 24px; font-weight: 800; color: #ef4444;">Remaining: ${currentQty} Units</p>
            </div>
            <p>Please restock this item immediately to avoid any business interruption.</p>
        </div>
    </div>`;

    const mailOptions = {
        from: '"PharmPro Alerts" <sufiangsufiang15@gmail.com>',
        to: email,
        subject: `⚠️ Low Stock Alert: ${itemName}`,
        html: alertHTML
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("❌ Stock Alert Error:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        console.log("✅ Stock Alert sent for:", itemName);
        res.status(200).json({ success: true });
    });
});

// --- Port Configuration ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 PharmPro Backend is running on port ${PORT}`);
});
