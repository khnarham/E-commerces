interface EmailProps {
  username: string;
  _id: string;
  otp: string;
}

export const generateVerificationEmail = ({ username, _id, otp }: EmailProps): string => {
  
  if (!username || !_id || !otp) {
    return `
      <html lang="en" dir="ltr">
        <head>
          <title>Error: Missing Information</title>
        </head>
        <body>
          <p>There was an error generating your verification email. Please try again later.</p>
        </body>
      </html>
    `;
  }

 
  return `
    <html lang="en" dir="ltr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verification Code</title>
        <style>
          body {
            font-family: 'Roboto', Verdana, sans-serif;
          }
          h2 {
            color: #333;
          }
          a {
            color: #61dafb;
            text-decoration: none;
          }
          .btn {
            background-color: #61dafb;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            text-decoration: none;
            font-size: 16px;
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div style="padding: 20px; font-size: 16px; color: #333;">
          <h2>Hello ${username},</h2>
          <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
          <h3>${otp}</h3>
          <p>If you did not request this code, please ignore this email.</p>
          <p>
            <a href="http://localhost:3000/verify/${_id}" class="btn">Verify here</a>
          </p>
        </div>
      </body>
    </html>
  `;
};
