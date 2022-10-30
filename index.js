const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
require("dotenv").config();
// Parse incoming requests data (https://github.com/expressjs/body-parser)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = process.env.PORT || 5000;

app.use('/zamki', route);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


const transporter = nodemailer.createTransport({
    port: process.env.HOST_PORT,
    host: process.env.HOST,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

route.get('/send-mail', (req, res) => {
    let {fullName,email,phoneNumber,deliveryType,comment, subject, text } = req.body;
    
    if(!(fullName && email && phoneNumber && comment)){
       fullName = "vito";
       email = "zamki@mail.ru";
       phoneNumber = "234235235"
       comment = `sdfsdfdsfdsfgdfgdfgdfgfdgdfhdgfgjhghkjg
       dfgdfgdfgdfgfdhfghfg  hfghgfh hfghfghfgh`
     
    }
  console.log(req.body)
    const mailData = {
        from: 'vitmm44@mail.ru',
        to: "vitalimangasaryan@gmail.com",
        subject: `zakaz `,
        text: `zakaz from ${fullName}`,
        html: `<b>${fullName}</b><br> email ${email}  phone ${phoneNumber}  comment ${comment}<br/>`,
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
       
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
       
    });
    
});


route.post('/attachments-mail', (req, res) => {
    const {to, subject, text } = req.body;
    const mailData = {
        from: 'vitmm44@mail.ru',
        to: "vitalimangasaryan@gmail.com",
        subject: "from Node JS",
        text: "test text",
        html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
        attachments: [
            {   // file on disk as an attachment
                filename: 'nodemailer.png',
                path: 'nodemailer.png'
            },
            {   // file on disk as an attachment
                filename: 'text_file.txt',
                path: 'text_file.txt'
            }
        ]
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});