const sgMail = require('@sendgrid/mail')

const sendGridApiKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridApiKey)

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ahmet.koca@hotmail.com',
        subject: 'Welcome To Task Manager App',
        text: `Welcome To Task Manager App ${name}`
    })
}

const sendDeleteAccountMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ahmet.koca@hotmail.com',
        subject: 'See you soon',
        text: `Thanks for using Task Manager App ${name}`
    })
}

module.exports = {
    sendWelcomeMail,
    sendDeleteAccountMail
}