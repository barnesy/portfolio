#! /usr/bin/env node

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'chris@barnesy.me',
    from: 'chris@barnesy.me',
    subject: 'Email via Github Actions',
    text: 'Email bot says hello.',
    html: 'Email bot says hello.',
};

sgMail
    .send(msg)
    .then(() => console.log('Mail sent successfully'))
    .catch(error => console.error(error.toString()));
