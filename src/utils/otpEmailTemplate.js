const otpEmailTemplate = (userName = "User", otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Login Verification Code</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f6f8;
  font-family: Arial, Helvetica, sans-serif;
">

  <div style="
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  ">

    <!-- Header -->
    <div style="
      background-color: #111827;
      padding: 25px;
      text-align: center;
    ">
      <h1 style="
        margin: 0;
        color: #ffffff;
        font-size: 24px;
      ">
        Secure Team Workspace
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 35px;">

      <h2 style="
        margin-top: 0;
        color: #111827;
        font-size: 22px;
      ">
        Login Verification
      </h2>

      <p style="
        color: #374151;
        font-size: 16px;
        line-height: 1.6;
      ">
        Hello <strong>${userName}</strong>,
      </p>

      <p style="
        color: #4b5563;
        font-size: 15px;
        line-height: 1.6;
      ">
        We received a request to log in to your
        <strong>Secure Team Workspace</strong> account.
        Use the verification code below to complete your login.
      </p>

      <!-- OTP -->
      <div style="
        margin: 30px 0;
        text-align: center;
      ">

        <div style="
          display: inline-block;
          padding: 18px 30px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          letter-spacing: 8px;
          font-size: 30px;
          font-weight: bold;
          color: #111827;
        ">
          ${otp}
        </div>

      </div>

      <p style="
        text-align: center;
        color: #6b7280;
        font-size: 14px;
      ">
        This code will expire in <strong>5 minutes</strong>.
      </p>

      <!-- Security Warning -->
      <div style="
        margin-top: 30px;
        padding: 15px;
        background-color: #fff7ed;
        border-left: 4px solid #f97316;
        border-radius: 5px;
      ">

        <p style="
          margin: 0;
          color: #9a3412;
          font-size: 13px;
          line-height: 1.6;
        ">
          <strong>Security notice:</strong><br>
          Never share this verification code with anyone.
          Our team will never ask you for this code.
        </p>

      </div>

      <p style="
        margin-top: 25px;
        color: #6b7280;
        font-size: 13px;
        line-height: 1.6;
      ">
        If you did not attempt to log in, you can safely ignore this email.
        We recommend changing your password if you believe someone else
        is trying to access your account.
      </p>

    </div>

    <!-- Footer -->
    <div style="
      padding: 20px;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    ">

      <p style="
        margin: 0;
        color: #9ca3af;
        font-size: 12px;
      ">
        This is an automated security email. Please do not reply.
      </p>

      <p style="
        margin: 8px 0 0;
        color: #9ca3af;
        font-size: 11px;
      ">
        © ${new Date().getFullYear()} Secure Team Workspace
      </p>

    </div>

  </div>

</body>
</html>
`;
};

module.exports = otpEmailTemplate;
