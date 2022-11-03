const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
require("dotenv").config();
const cors = require("cors");

app.use(cors({
    origin:["http://localhost:5000","https://api.codium.pro"]
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const route = express.Router();

const port = process.env.PORT || 5000;

app.use('/zamki', route);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
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

    const mailData = {
        from: 'vitmm44@mail.ru',
        to: "vitalimangasaryan@gmail.com",
        subject: `Заказ от ${fullName} `,
        text: `${comment}`,
        html: `<div >
        <h6>email ${email} </h6>
        <h6>fulname ${fullName}</h6>
        <h6>phone ${phoneNumber}</h6>
        </div>`,
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