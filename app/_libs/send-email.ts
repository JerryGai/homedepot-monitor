import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const senderEmail = 'Workshop Monitor <utilsuit@gmail.com>';

export const sendEmail = async (subject: string, htmlContent: string, emailAddress: string) => {
    try {
        const { data, error } = await resend.emails.send({
          from: senderEmail,
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
