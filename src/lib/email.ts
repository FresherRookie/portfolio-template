import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 465);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const emailFrom = process.env.EMAIL_FROM ?? smtpUser;

if (!smtpHost || !smtpUser || !smtpPassword || !emailFrom) {
  throw new Error("Missing required SMTP environment variables.");
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

type SendPasswordResetEmailOptions = {
  to: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailOptions) {
  await transporter.sendMail({
    from: emailFrom,
    to,
    subject: "Reset your password",
    text: `You requested a password reset.

Use the following link to reset your password:

${resetUrl}

This link will expire after one hour.

If you did not request this, you can safely ignore this email.`,
    html: `
      <p>You requested a password reset.</p>

      <p>
        <a href="${resetUrl}">
          Reset your password
        </a>
      </p>

      <p>
        This link will expire after one hour.
      </p>

      <p>
        If you did not request this, you can safely ignore this email.
      </p>
    `,
  });
}
