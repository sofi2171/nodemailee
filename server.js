const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors()); // Ye zaroori hai taake tumhara frontend backend se baat kar sakay
app.use(express.json());

// --- Tumhara Gmail Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sufiangsufiang15@gmail.com',
        pass: 'hohn uvzi crrn lhxi' // Maine wahi password daal diya jo tumne likha tha
    }
});

// --- API 1: Welcome Email (Signup) ---
app.post('/api/welcome-email', (req, res) => {
    const { email, userName } = req.body;

    const mailOptions = {
        from: '"PharmPro Enterprise" <sufiangsufiang15@gmail.com>',
        to: email,
        subject: 'Welcome to PharmPro - Workspace Activated',
        html: `
        <div style="max-width: 600px; margin: auto; font-family: sans-serif; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #0f172a; padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">Welcome to PharmPro</h1>
            </div>
            <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                <p style="font-size: 18px;">Hello <b>${userName}</b>,</p>
                <p>Your professional pharmacy management workspace is now active. We are excited to help you manage your business.</p>
                <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold; color: #2563eb;">Your account is now linked to our Real-time Alert System.</p>
                </div>
                <p>You will now receive automated notifications for inventory and system updates.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; text-align: center;">© 2026 PharmPro Enterprise Edition</p>
            </div>
        </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        res.status(200).json({ success: true, message: 'Welcome email sent!' });
    });
});

// --- API 2: Low Stock Alert ---
app.post('/api/stock-alert', (req, res) => {
    const { email, itemName, currentQty } = req.body;

    const mailOptions = {
        from: '"PharmPro Alerts" <sufiangsufiang15@gmail.com>',
        to: email,
        subject: `⚠️ Low Stock Alert: ${itemName}`,
        html: `
        <div style="max-width: 600px; margin: auto; font-family: sans-serif; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #ef4444; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">Inventory Safety Alert</h2>
            </div>
            <div style="padding: 40px; line-height: 1.6;">
                <p>This is an automated notification that your stock for <b>${itemName}</b> is running low.</p>
                <div style="margin: 20px 0; padding: 20px; background: #fff1f2; border-radius: 12px; border: 1px dashed #f87171; text-align: center;">
                    <span style="font-size: 14px; color: #991b1b;">Current Inventory:</span><br>
                    <span style="font-size: 32px; font-weight: 800; color: #ef4444;">${currentQty} Units</span>
                </div>
                <p>Please restock this item immediately to ensure uninterrupted service to your customers.</p>
            </div>
        </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        res.status(200).json({ success: true, message: 'Stock alert sent!' });
    });
});

// Render/Heroku support
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PharmPro Backend Live on Port ${PORT}`));
