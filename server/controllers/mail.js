import {createRequire} from "module"

import { MAIL_USERNAME, MAIL_PASSWORD } from "../constants.js";

const require = createRequire(import.meta.url);

const nodemailer = require('nodemailer');

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    transports:
        new transports.File({
        filename: 'logs/server.log',
        format:format.combine(
            format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
            format.align(),
            format.printf(info => {
                const message = JSON.parse(info.message)
                return `${info.level}: ${[info.timestamp]}: [${message.user}]: ${message.message}`
            }),
        )}),
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
});

const sendJobAssignedMail = (toUser, job) => {
    logger.info(JSON.stringify({'user': 'Mailer','message':`SENDING JOB ASSIGNED MAIL TO ${toUser.email}`}))
    transporter.sendMail({
        from: `"Bhild LLC" <${MAIL_USERNAME}>`, // sender address
        to: toUser.email, // list of receivers
        subject: "Job Assignment", // Subject line
        text: `Congratulations! The Job - ${job.po} has been assigned to you. Your bid of $ ${job.cost} has been accepted. One of our Project managers will be in touch with you shortly.`, // plain text body
        html: `<b>Dear ${toUser.name},</b>
                <br><br><b>Congratulations!</b> 
                The Job - <b>${job.po}</b> has been assigned to you. Your bid of <b>$ ${job.cost}</b> has been accepted.
                <br>One of our Project managers will be in touch with you shortly.` // html body
    }).then(info => {
        console.log({info});
        logger.info(JSON.stringify({'user': 'Mailer','message':`MAIL SENT TO ${toUser.email}`}))
    }).catch(err => {
        logger.error(JSON.stringify({'user': 'Mailer','message':`ERROR SENDING MAIL TO ${toUser.email}: ${err}`}))
    });
}

const sendJobReminderMail = (toUser) => {

    transporter.sendMail({
        from: '"Bhild LLC" <youremail@gmail.com>', // sender address
        to: toUser, // list of receivers
        subject: "Job Reminder", // Subject line
        text: "There is a new article. It's about sending emails, check it out!", // plain text body
        html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
    }).then(info => {
        console.log({info});
    }).catch(console.error);
}

export {sendJobAssignedMail, sendJobReminderMail}