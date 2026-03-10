import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTransactionalEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@krayavikrayam.com",
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
