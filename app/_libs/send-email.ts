
const nodemailer = require('nodemailer');
const senderEmail = process.env.SENDER_EMAIL;
const senderPassword = process.env.SENDER_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true, 
    auth: {
        user: senderEmail,
        pass: senderPassword
    }
});

export const sendEmail = async (subject: String, htmlContent: String, emailAddress: String) => {
    const mailOptions = {
        from: 'Workshop Monitor',
        to: emailAddress,
        subject: subject,
        html: htmlContent
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending email: ', error);
    }
}

export const sendAdminEmail = async (subject: String, htmlContent: String) => {
    const mailOptions = {
        from: 'Workshop Monitor',
        to: 'gaijianyi@gmail.com',
        subject: 'Workshop Monitor - No workshops available',
        html: 'No workshop available, or the API structure has changed. Please check the API response.'
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending email: ', error);
    }
}
