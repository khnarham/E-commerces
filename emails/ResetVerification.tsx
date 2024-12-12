interface EmailProps {
    username: string;
     verifyToken: string;
     _id: string;
     email: string;
  }
  
  export const ResetVerificationEmail = ({ username , verifyToken , email , _id  }: EmailProps): string => {
    
    if (!username || !_id) {
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
   
            <p>Click the button to Reset Password</p>
            <p>
              <a href="http://localhost:3000/reset-password/${verifyToken}" class="btn">Verify here</a>
            </p>
          </div>
        </body>
      </html>
    `;
  };
  