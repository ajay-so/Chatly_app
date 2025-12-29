const welcomeEmailTemplate = (name, email, clientURL) => {
    // Brand Colors
    const primaryColor = '#4F46E5'; // Modern Indigo
    const textColor = '#374151';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${textColor}; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
                .header { text-align: center; padding: 20px 0; }
                .logo { font-size: 24px; font-weight: bold; color: ${primaryColor}; text-decoration: none; }
                .content { padding: 20px; background-color: #ffffff; }
                .button { display: inline-block; padding: 12px 24px; background-color: ${primaryColor}; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
                .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 30px; }
                .highlight { color: ${primaryColor}; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <a href="${clientURL}" class="logo">💬 Chatly</a>
                </div>
                <div class="content">
                    <h1>Welcome aboard, ${name}!</h1>
                    <p>We're thrilled to have you here. You've joined <strong>Chatly</strong> with the email: <span class="highlight">${email}</span>.</p>
                    
                    <p>Chatly is built to help you connect instantly with your team, friends, and communities. Here’s what you can do right now:</p>
                    
                    <ul>
                        <li><strong>Set up your profile:</strong> Add a photo so people recognize you.</li>
                        <li><strong>Join Channels:</strong> Jump into public conversations.</li>
                        <li><strong>Invite Friends:</strong> Everything is better with company!</li>
                    </ul>

                    <center>
                        <a href="${clientURL}" class="button">Launch Chatly App</a>
                    </center>

                    <p>If you have any questions, just reply to this email. We're always here to help.</p>
                    <p>Cheers,<br>The Chatly Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Chatly Inc. | 123 Tech Lane, San Francisco, CA</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

module.exports = { welcomeEmailTemplate };