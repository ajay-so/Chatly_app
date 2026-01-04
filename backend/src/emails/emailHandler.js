const { resendClient, sender } = require('../utils/resend');
const { welcomeEmailTemplate } = require('./emailTemplates.js');

// Function to send welcome email
const sendWelcomeEmail = async (name, email, clientURL) => {
    const { data , error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: 'Welcome to Chatly!',
        html: welcomeEmailTemplate(name, email, clientURL)
    });
    if(error){
        throw new Error('Failed to send welcome email, Enter a valid email address.');
    }
}

module.exports = { sendWelcomeEmail };