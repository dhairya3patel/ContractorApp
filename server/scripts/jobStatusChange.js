import Job from "../models/job.js";

import {createRequire} from "module"

const require = createRequire(import.meta.url);


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

const changeStatus = () => {
    logger.info(JSON.stringify({'user': 'Change Job Status CronJob','message':`Begin`}))
    Job.find({
        status: 'open'
    })
    .then(jobList => {

        for (var index in jobList) {
            logger.info(JSON.stringify({'user': 'Change Job Status CronJob','message':`JOB: ${jobList[index]._id} status: ${jobList[index].status}`}))
            now = new Date();
            if (now >= jobList[index].bidEnd) {

                try {

                    jobList[index].status = 'Bid Complete'
                    jobList[index].save()
                    logger.info(JSON.stringify({'user': 'Change Job Status CronJob','message':`NEW STATUS: ${jobList[index].status}`}))
    
                }
                catch(e) {
                    logger.error(JSON.stringify({'user': 'Change Job Status CronJob','message':`STATUS CHANGE ERROR: ${e}`}))
                    continue
                }
            } 

        }

    })

}