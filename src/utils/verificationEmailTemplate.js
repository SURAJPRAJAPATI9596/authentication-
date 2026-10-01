const verificationEmailTemplate = (name, verificationUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#111827; padding:25px; text-align:center;">
      <h1 style="color:#ffffff; margin:0;">
        Secure Team Workspace
      </h1>
    </div>

    <!-- Content -->
    <div style="padding:35px;">

      <h2 style="color:#111827;">
        Verify Your Email
      </h2>

      <p style="color:#374151; font-size:16px;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="color:#4b5563; font-size:15px; line-height:1.6;">
        Thank you for creating an account with Secure Team Workspace.
        Please click the button below to verify your email address.
      </p>

      <!-- Button -->
      <div style="text-align:center; margin:30px 0;">

        <a
          href="${verificationUrl}"
          target="_blank"
          style="
            display:inline-block;
            padding:14px 28px;
            background:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:7px;
            font-weight:bold;
          "
        >
          Verify My Email
        </a>

      </div>

      <p style="color:#6b7280; font-size:14px;">
        This verification link will expire in 15 minutes.
      </p>

      <p style="color:#6b7280; font-size:13px;">
        If you did not create this account, you can safely ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">

      <p style="color:#9ca3af; font-size:12px;">
        If the button does not work, copy and paste this URL into your browser:
      </p>

      <p
        style="
          color:#374151;
          font-size:12px;
          word-break:break-all;
          background:#f3f4f6;
          padding:10px;
          border-radius:5px;
        "
      >
        ${verificationUrl}
      </p>

    </div>

    <!-- Footer -->
    <div style="background:#f9fafb; padding:20px; text-align:center;">
      <p style="margin:0; color:#9ca3af; font-size:12px;">
        This is an automated email. Please do not reply.
      </p>

      <p style="margin:8px 0 0; color:#9ca3af; font-size:11px;">
        © ${new Date().getFullYear()} Secure Team Workspace
      </p>
    </div>

  </div>

</body>
</html>
`;
};

module.exports = verificationEmailTemplate;
