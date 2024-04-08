import { Resend } from "resend";

const nodemailer = require('nodemailer');
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const adminSenderEmail = 'Workshop Monitor <no-replay@updates.realtoweb.ca>';
const noticeSenderEmail = process.env.SENDER_APP_EMAIL;
const noticeSenderPassword = process.env.SENDER_APP_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true, 
    auth: {
        user: noticeSenderEmail,
        pass: noticeSenderPassword
    }
});

export const sendNoticeEmail = async (subject: String, htmlContent: String, emailAddress: String) => {
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


export const sendAdminEmail = async (subject: string, htmlContent: string, emailAddress: string) => {
    try {
        const { data, error } = await resend.emails.send({
          from: adminSenderEmail,
          to: emailAddress,
          subject: subject,
          html: htmlContent,
        });

        if (error) {
          return Response.json({ error });
        }

        return Response.json({ data });
      } catch (error) {
        return Response.json({ error });
      }
}
