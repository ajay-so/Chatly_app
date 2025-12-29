const resend = require('resend');
require('dotenv').config();

const resendClient = new resend.Resend(process.env.RESEND_API_KEY);

const sender = {
    email : process.env.EMAIL_FROM,
    name  : process.env.EMAIL_FROM_NAME
}

module.exports = { resendClient, sender };