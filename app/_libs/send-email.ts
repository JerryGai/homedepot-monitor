import { Resend } from "resend";

const nodemailer = require('nodemailer');
const resend = new Resend(process.env.RESEND_API_KEY);
const resendSenderEmail = 'Workshop Monitor <no-replay@updates.realtoweb.ca>';

export const sendNoticeEmail = async (subject: String, htmlContent: String, emailAddress: String) => {
    const mailOptions = {
        from: process.env.SENDER_APP_EMAIL,
        to: emailAddress,
        subject: subject,
        html: htmlContent
    };
    
    try{
        await nodemailer
        .createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 465,
            secure: true, 
            auth: {
                user: process.env.SENDER_APP_EMAIL,
                pass: process.env.SENDER_APP_PASSWORD
            },
        })
        .sendMail(mailOptions);
        console.log('Email sent: ' + emailAddress);
    }
    catch(error){
        console.log('Error sending email: ' + error);
        sendAdminEmail(
            'Error sending email', 
            'Error sending email: ' + error, 
            process.env.ADMIN_EMAIL ?? 'gaijianyi@gmail.com'
        );
    }
}


export const sendAdminEmail = async (subject: string, htmlContent: string, emailAddress: string) => {
    try {
        const { data, error } = await resend.emails.send({
          from: resendSenderEmail,
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
