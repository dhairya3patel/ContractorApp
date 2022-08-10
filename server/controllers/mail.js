import {createRequire} from "module"

const require = createRequire(import.meta.url);

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword',
  },
});

const sendJobAssignedMail = (toUser) => {

    transporter.sendMail({
        from: '"Your Name" <youremail@gmail.com>', // sender address
        to: toUser, // list of receivers
        subject: "Medium @edigleyssonsilva ✔", // Subject line
        text: "There is a new article. It's about sending emails, check it out!", // plain text body
        html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
    }).then(info => {
        console.log({info});
    }).catch(console.error);
}

const sendJobReminderMail = (toUser) => {

    transporter.sendMail({
        from: '"Your Name" <youremail@gmail.com>', // sender address
        to: toUser, // list of receivers
        subject: "Medium @edigleyssonsilva ✔", // Subject line
        text: "There is a new article. It's about sending emails, check it out!", // plain text body
        html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
    }).then(info => {
        console.log({info});
    }).catch(console.error);
}

export {sendJobAssignedMail, sendJobReminderMail}