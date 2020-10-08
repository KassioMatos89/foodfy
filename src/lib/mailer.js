const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "91a5433cb6d550",
        pass: "432ef4f85089e4"
    }
});