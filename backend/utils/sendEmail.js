const nodemailer = require("nodemailer");

/**
 * Utility function to send emails
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 */
const sendEmail = async (to, subject, text) => {
    try {
        // Log if credentials are missing
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("⚠️ nodeMailer: EMAIL_USER or EMAIL_PASS not found in .env. Email will not be sent.");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "gmail", // You can change this to your email service (e.g., outlook, hotmail)
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.response}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message);
    }
};

module.exports = sendEmail;
