const welcomeMailTemplate = ({
  participantName,
}: {
  participantName: string | undefined;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Phoenix - The Official Tech Club of NSEC</title>
    </head>
    <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <img src="https://res.cloudinary.com/dlbiliyzy/image/upload/v1715175625/Letterhead-Mail_x5d9jv.png" alt="Phoenix Logo" style="max-width: 100%; height: auto; display: block; margin: 0 auto 20px;">
            <h1>Welcome to Phoenix!</h1>
            
            <p>Dear ${participantName},</p>
            
            <p>We are excited to welcome you as the newest member of Phoenix, the official tech club of NSEC. Congratulations on joining a community of passionate and innovative individuals dedicated to technology and excellence.</p>
            
            <h2>Welcome Aboard:</h2>
            <p>As a member of Phoenix, you will have the opportunity to participate in a variety of events, workshops, and projects that will enhance your skills and knowledge in the tech field. Our club is committed to providing a supportive and engaging environment for all its members.</p>
            
            <p>Please make sure to download your membership card from the portal</p>
            
            
            <p>If you have any questions or need assistance, please feel free to reach out to us. We are here to help and ensure that you have a great experience as part of our community.</p>
            
            <p>Once again, welcome to Phoenix! We look forward to seeing you grow and succeed with us.</p>
            
            <p>Best regards,<br>
            The Phoenix Team</p>
            
            <p>For inquiries please contact:</p>
            <ul>
                <li>Alex Johnson: 555-1234</li>
                <li>Emily Brown: 555-5678</li>
            </ul>
        </div>
    </body>
    </html>
    `;
};

export default welcomeMailTemplate;
