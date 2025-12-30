const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// Create reusable transporter object using the default SMTP transport
// For dev: using Ethereal Email which prints a URL to console
let transporter;

async function createTransporter() {
    if (transporter) return;

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    console.log('Email Service Initialized (Ethereal).');
}

// createTransporter();

const sendEmail = async (to, subject, html, attachments = []) => {
    try {
        if (!transporter) await createTransporter();

        let info = await transporter.sendMail({
            from: '"Event Booking System" <no-reply@example.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
            attachments: attachments
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendBookingConfirmation = async (booking, user, event) => {
    // Generate QR Code
    const qrText = `Booking ID: ${booking._id}\nEvent: ${event.title}\nUser: ${user.name}`;
    const qrDataURL = await QRCode.toDataURL(qrText);

    const html = `
        <h1>Booking Confirmed!</h1>
        <p>Hi ${user.name},</p>
        <p>Your booking for <strong>${event.title}</strong> has been confirmed.</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Tickets:</strong> ${booking.ticketCount}</p>
        <p><strong>Total Paid:</strong> $${booking.totalPrice}</p>
        <br>
        <p>Please present the attached QR code at the venue.</p>
    `;

    // Attach QR Code implementation:
    // Ideally we attach the base64 string as an image attachment or embed it (CID).
    // For simplicity, we'll try embedding or sending purely text details first.
    // Making proper attachment from Data URL:
    const base64Data = qrDataURL.split(';base64,').pop();

    await sendEmail(user.email, `Booking Confirmation: ${event.title}`, html, [
        {
            filename: 'ticket-qr.png',
            content: base64Data,
            encoding: 'base64'
        }
    ]);
};

const sendEventReminder = async (user, event) => {
    const html = `
        <h1>Event Reminder</h1>
        <p>Hi ${user.name},</p>
        <p>This is a reminder that <strong>${event.title}</strong> is happening tomorrow!</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <br>
        <p>See you there!</p>
    `;
    await sendEmail(user.email, `Reminder: ${event.title} is coming up!`, html);
};

module.exports = {
    sendEmail,
    sendBookingConfirmation,
    sendEventReminder
};
