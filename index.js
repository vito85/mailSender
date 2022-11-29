const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
require("dotenv").config();
const cors = require("cors");

const app = express();

//cors config
app.use(cors({
    origin:["http://localhost:3000","https://zamki.codium.pro"]
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const route = express.Router();

const port = process.env.PORT || 5000;

app.use('/zamki', route);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

const emailTemplateSource = fs.readFileSync(path.join(__dirname, "./template.hbs"), "utf8");

const template = handlebars.compile(emailTemplateSource);




const transporter = nodemailer.createTransport({
    port: process.env.HOST_PORT,
    host: process.env.HOST,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

route.post('/send-mail', (req, res) => {
    const  {fullName,email,phoneNumber,deliveryType,comment,totalAmount,card} = req.body;
   
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const htmlToSend = template({
        name: fullName,
        mail: email,
        phone: phoneNumber,
        total:totalAmount,
        delivery: deliveryType,
        text:comment,
        card:card 

    });
    
    const mailData = {
        from: 'vitmm44@mail.ru',
        to: ["vitalimangasaryan@gmail.com","zamkitest@gmail.com"],
        subject: `Заказ от ${fullName} IP addres is ${ip}`,
        text: `${comment}`,
        html: htmlToSend
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
       
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
       
    });
    
});


// route.post('/attachments-mail', (req, res) => {
//     const {to, subject, text } = req.body;
//     const mailData = {
//         from: 'vitmm44@mail.ru',
//         to: "vitalimangasaryan@gmail.com",
//         subject: "from Node JS",
//         text: "test text",
//         html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
//         attachments: [
//             {   // file on disk as an attachment
//                 filename: 'nodemailer.png',
//                 path: 'nodemailer.png'
//             },
//             {   // file on disk as an attachment
//                 filename: 'text_file.txt',
//                 path: 'text_file.txt'
//             }
//         ]
//     };

//     transporter.sendMail(mailData, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         res.status(200).send({ message: "Mail send", message_id: info.messageId });
//     });
// });