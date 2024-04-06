import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export const sendEmail = async (subject: string, htmlContent: string, emailAddress: string) => {
    try {
        const { data, error } = await resend.emails.send({
          from: 'Workshop Monitor <@>',
          to: emailAddress,
          subject: subject,
          react: htmlContent,
        });

        if (error) {
          return Response.json({ error });
        }

        return Response.json({ data });
      } catch (error) {
        return Response.json({ error });
      }

}

export const sendAdminEmail = async (subject: string, htmlContent: string) => {
    try {
        const { data, error } = await resend.emails.send({
          from: 'Workshop Monitor <@>',
          to: 'gaijianyi@gmail.com',
          subject: subject,
          react: htmlContent,
        });

        if (error) {
          return Response.json({ error });
        }
        return Response.json({ data });
      } catch (error) {
        return Response.json({ error });
      }
}
