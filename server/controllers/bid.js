import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Bid from '../models/bid.js';
import Manager from '../models/manager.js';
import Contractor from '../models/contractor.js';
import User from '../models/user.js';
import { decodeToken } from '../middleware/auth.js';
import Job from '../models/job.js';
import AcceptedBid from '../models/acceptedBids.js';

import {createRequire} from "module"
import contractor from '../models/contractor.js';
import { sendJobAssignedMail } from './mail.js';

const require = createRequire(import.meta.url);

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

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

const createBid = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':`createBid Request`}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    Contractor.findOne({
        user: user, 
    })
    .then( contractor => {
        Job.findOne({
            _id: req.body.id
        })
        .then( job =>{
            return Bid.create(({
                _id: uuidv4(),
                job: job,
                contractor: contractor,
                amount: req.body.amount
            }))
            .then((bid) => {
                logger.info(JSON.stringify({'user': user,'message': `Bid Created ${bid}`}))
                res.status(201).json({message: "Bid created"});
            })
            .catch(err => {
                logger.error(JSON.stringify({'user': user,'message':`createBid ${err}`}));
                console.log(err);
                res.status(502).json({message: "error while creating Bid"});
            });    
        })
    })
    .catch( err => {
        logger.error(JSON.stringify({'user': user,'message':`createBid ${err}`}));
        console.log(err);
        return res.status(404).json({message: "Contractor not found"});        
    })

};

const getBidsByUser = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':`getBidsByUser Request`}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    User.findOne({
        _id: user, 
    })
    .then( user => {

        if (user.role == 'PM') {
            return Bid.find({
                status: req.body.status
            })
            .then((bids) => {
                logger.info(JSON.stringify({'user': user,'message':`Bids: ${bids}`}))
                res.status(200).json({
                    message: "Success",
                    bids: bids
                })
            })
            .catch(err => {
                console.log(err);
                logger.error(JSON.stringify({'user': user,'message':`getBidsByUser ${err}`}))
                res.status(500).json({message: "error while getting Bids"});
            });            
        }
        else {
            Contractor.findOne({
                user: user
            })
            .then(contractor => {
                return Bid.find({
                    contractor: contractor,
                })
                .then((bids) => {
                    logger.info(JSON.stringify({'user': user,'message':`Bids: ${bids}`}))
                    res.status(200).json({
                        message: "Success",
                        bids: bids
                    })
                })
                .catch(err => {
                    logger.error(JSON.stringify({'user': user,'message':`getBidsByUser ${err}`}))
                    console.log(err);
                    res.status(500).json({message: "error while getting Bids"});
                });            
    
            })

        }
    });
}

const getBidsByJob = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':`getBidsByJob Request`}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    Manager.findOne({
        user: user, 
    })
    .then( Manager => {

        logger.info(JSON.stringify({'user': user,'message': ` Job ID: ${req.body.job}`}))
        return Bid.find({
            job: req.body.job
        })
        .populate('contractor')
        .then((Bid) => {
            logger.info(JSON.stringify({'user': user,'message':`Bids: ${Bid}`}))
            res.status(200).json({
                message: "Success",
                bids: Bid
            })
        })
        .catch(err => {
            logger.error(JSON.stringify({'user': user,'message':`getBidsByUser ${err}`}))
            console.log(err);
            res.status(500).json({message: "error while getting Bids"});
        });            
    });
}

const acceptBid = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message': `acceptBid Request`}))
    logger.info(JSON.stringify({'user': user,'message': JSON.stringify(req.body)}))

    Manager.findOne({
        user: user, 
    })
    .then( Manager => {
        Job.findOne({
            _id: req.body.job
        })
        .then( job => {

            logger.info(JSON.stringify({'user': user,'message': `JOB ID: ${job}`}))
            logger.info(JSON.stringify({'user': user,'message': `ASSIGNED TO: ${req.body.contractor}`}))
            logger.info(JSON.stringify({'user': user,'message': `AMOUNT: ${req.body.amount}`}))

            job.status = "Assigned"
            job.assignedTo = req.body.contractor
            job.cost = req.body.amount
            job.save()
            .then( () => {
                AcceptedBid.create({
                    _id: uuidv4(),
                    job: req.body.job,
                    contractor: req.body.contractor,
                    amount: req.body.amount,
                    bid: req.body.bid
                })
                .then( () => {
                    Contractor.findOne({
                        _id: req.body.contractor
                    })
                    .populate('user')
                    .then( toUser => {
                        sendJobAssignedMail(toUser.user, job)
                    })
                    res.status(201).json({
                        status: "201",
                        message: "Job Assigned"
                    })
                })
                .catch ( err => {
                    logger.error(JSON.stringify({'user': user,'message': `AcceptBid ${err}`}))
                    res.status(500).json({
                        message: err
                    })
                })
            })    
        })
    
    })

}

const getYourBid = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message': `GetYourBid Request`}))
    logger.info(JSON.stringify({'user': user,'message': JSON.stringify(req.body)}))    

    Contractor.findOne({
        user: user, 
    })
    .then( Contractor => {

        AcceptedBid.findOne({
            contractor: Contractor,
            job: req.body.job
        })
        .then( bid => {
            logger.info(JSON.stringify({'user': user,'message': `BID:  ${bid.bid}`}))
            res.status(200).json({
                status: "200",
                bid: bid
            })
        })
        .catch ( err => {
            logger.error(JSON.stringify({'user': user,'message': `GetYourBid ${err}`}))
            res.status(500).json({
                message: err
            })
        })    
    })    
}
// const getJobById = (req, res, next) => {

//     const token = decodeToken(req);

//     const user = token["id"]

//     Contractor.findOne({
//         user: user, 
//     })
//     .then( Contractor => {

//         return Job.findOne({_id: req.body.id})
//         .then((job) => {
//             if (job)
//                 res.status(200).json({
//                     message: "Success",
//                     job: job
//                 });
//             else
//                 res.status(404).json({message: `Job with id ${req.body.id} not found`});    
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({message: "Internal Server Error"});
//         });
//     })
//     .catch( err => {
//         console.log(err);
//         return res.status(404).json({message: "Contractor not found"});        
//     })    

// }

export {createBid, getBidsByUser, getBidsByJob, acceptBid, getYourBid};