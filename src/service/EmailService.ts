import nodemailer from "nodemailer";

export default class EmailService {
  private static getTransporter() {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      throw new Error(
        "SMTP credentials are missing. Please set SMTP_USER and SMTP_PASS in your .env file."
      );
    }


    const cleanedPass = smtpPass.replace(/\s/g, '');
    const cleanedUser = smtpUser.trim();


    console.log(`[EmailService] Using SMTP user: ${cleanedUser}`);
    console.log(`[EmailService] App password length: ${cleanedPass.length} characters`);

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: cleanedUser,
        pass: cleanedPass,
      },
    });
  }

  public static async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    userName?: string
  ): Promise<void> {
    try {
      const transporter = this.getTransporter();

      // Verify connection before sending
      await transporter.verify();
      console.log("[EmailService] SMTP connection verified successfully");

      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Password Reset Request - MovieMitra",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>MovieMitra</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello ${userName || "User"},</p>
            <p>We received a request to reset your password for your MovieMitra account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4CAF50;">${resetUrl}</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} MovieMitra. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `
      Password Reset Request - MovieMitra
      
      Hello ${userName || "User"},
      
      We received a request to reset your password for your MovieMitra account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
      
      This is an automated message, please do not reply to this email.
    `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Password reset email sent successfully to ${email}`);
    } catch (error: any) {
      console.error("[EmailService] Error sending email:", error);

      // Provide more helpful error messages
      if (error.code === 'EAUTH') {
        throw new Error(
          "Gmail authentication failed. Please check:\n" +
          "1. 2-Step Verification is enabled on your Google account\n" +
          "2. You're using an App Password (not your regular password)\n" +
          "3. SMTP_USER and SMTP_PASS in .env are correct\n" +
          "4. Generate a new App Password at: https://myaccount.google.com/apppasswords"
        );
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to send password reset email");
    }
  }

  public static async verifyConnection(): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      await transporter.verify();
      return true;
    } catch (error) {
      console.error("Email service connection error:", error);
      return false;
    }
  }
}

