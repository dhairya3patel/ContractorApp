import {createRequire} from "module"

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Job from '../models/job.js';
import User from "../models/user.js";
import Manager from '../models/manager.js';
import Contractor from '../models/contractor.js';
import Image from '../models/image.js';
import Bid from '../models/bid.js';
import { decodeToken } from '../middleware/auth.js';
import contractor from "../models/contractor.js";
import { MAPS_KEY, MAPS_URL } from "../constants.js";


const require = createRequire(import.meta.url);

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const { createLogger, format, transports } = require('winston');

const request = require('request')

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

const createJob = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':'Create Job Request'}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    Manager.findOne({
        user: user, 
    })
    .then( manager => {
        
        logger.info(JSON.stringify({'user': user,'message':`Manager Identified: ${manager._id}`}))
        
        const pictures = req.body.pictures
        Image.find({
            "_id" : {"$in" : pictures}
        })
        .then( images => {
            const now = new Date().getTime()
            const bidEnd = new Date(now + req.body.bidWindow * 60000)
            let options = {
                provider: 'openstreetmap'
              };
               
            let url = `${MAPS_URL}${req.body.address1}, ${req.body.address2}, ${req.body.city}, ${req.body.state} - ${req.body.zip}&key=${MAPS_KEY}`
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    const resp = body
                    const coords = JSON.parse(resp).results[0].geometry.location
                    Job.create(({
                        _id: uuidv4(),
                        po: req.body.po,
                        // clientEmail: req.body.Email,
                        // location: req.body.location,
                        address1: req.body.address1,
                        address2: req.body.address2,
                        city: req.body.city,
                        state: req.body.state,
                        zip: req.body.zip,
                        jobType: req.body.jobType,
                        pictures: images,
                        // dateTime: req.body.dateTime,
                        dateOfCompletion: req.body.date,
                        bidLow: req.body.bidLow,
                        bidHigh: req.body.bidHigh,
                        bidWindow: req.body.bidWindow,
                        bidEnd: bidEnd,
                        // assignedTo: req.body.assignedTo,
                        // status: req.body.status,
                        estimatedHours: req.body.estimatedHours,
                        equipment: req.body.equipment,
                        notes: req.body.notes,
                        createdBy: manager,
                        latitude: coords.lat,
                        longitude: coords.lng
                    }))
                    .then(() => {
                        Image.find({
                            "_id" : {"$in" : pictures}
                        })
                        .deleteMany()
                        .then(() => {
                            logger.info(JSON.stringify({'user': user,'message':'Job Created'}))
                            return res.status(201).json({message: "Job created"});
                        })               
                    })
                    .catch(err => {
                        logger.error(JSON.stringify({'user': user,'message':`Error Creating Job: ${err}`}))
                        return res.status(502).json({message: "error while creating Job"});
                    });
                }
                else {
                    logger.error(JSON.stringify({'user': user,'message':`Error Creating Job: ${err}`}))
                    return res.status(502).json({message: `error while creating Job - ${err}`});
                }
            })
        })
    })
    .catch( err => {
        logger.error(JSON.stringify({'user': user,'message':`Error Creating Job: ${err}`}))
        console.log(err);
        return res.status(404).json({message: "Manager not found"});        
    })

};

const getJobs = (req, res, next) => {


    let token = decodeToken(req);
    let user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':'Get Jobs Request'}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    Contractor.findOne({
        user: user, 
    })
    .then( Contractor => {
        // console.log()
        logger.info(JSON.stringify({'user': user,'message':`Contractor identified: ${Contractor._id}`}))
        //     console.log(op)
        //     res.status(200).json({jobs: op});
        // }).catch(err => {console.log(err)})
        Bid.find({
            contractor: Contractor._id
        }).select({
            job:1,_id:0
        })
        .then(bids => {
            const bid = bids.map(item => {return item.job});
            // console.log(bid);
            logger.info(JSON.stringify({'user': user,'message':`Job Status: ${req.body.status}`}))
            switch(req.body.status){
                case 'Open':
                    return Job.find({
                        '_id':{'$nin': bid}, 
                        'status': req.body.status,
                    })
                    .then((jobList) => {
                        // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                        res.status(200).json({
                            message: "Success",
                            jobs: jobList
                        });
                    })
                    .catch(err => {
                        logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                        console.log(err);
                        res.status(500).json({message: "error while getting Jobs"});
                    });

                case 'Bids':
                    return Job.find({
                        _id:{'$in': bid}, 
                        // status: req.body.status,
                    })
                    .then((jobList) => {
                        // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                        res.status(200).json({
                            message: "Success",
                            jobs: jobList
                        });
                    })
                    .catch(err => {
                        logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                        console.log(err);
                        res.status(500).json({message: "error while getting Jobs"});
                    });

                case 'Assigned':
                    return Job.find({
                        assignedTo: Contractor,
                        status: req.body.status
                    })
                    .then((jobList) => {
                        // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                        res.status(200).json({
                            message: "Success",
                            jobs: jobList
                        });
                    })
                    .catch(err => {
                        logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                        console.log(err);
                        res.status(500).json({message: "error while getting Jobs"});
                    });

                case 'Active':
                    return Job.find({
                        status: req.body.status,
                        assignedTo: Contractor
                    })
                    .then((jobList) => {
                        // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                        res.status(200).json({
                            message: "Success",
                            jobs: jobList
                        });
                    })
                    .catch(err => {
                        logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                        console.log(err);
                        res.status(500).json({message: "error while getting Jobs"});
                    });
                
                case 'Completed':
                    return Job.find({
                        assignedTo: Contractor,
                        status: req.body.status,
                    })
                    .then((jobList) => {
                        // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                        res.status(200).json({
                            message: "Success",
                            jobs: jobList
                        });
                    })
                    .catch(err => {
                        logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                        console.log(err);
                        res.status(500).json({message: "error while getting Jobs"});
                    });
                
                default:
                    
                    return res.status(404).json({
                        message:"Status not Found",
                        jobs: ""
                    })
            }
        });
    })
    .catch( err => {
        logger.info(JSON.stringify({'user': user,'message':`Contractor not found getJobs, Checking for Manager`}))
        Manager.findOne({
            user: user
        })
        .then(manager => {
            // console.log(manager)
            logger.info(JSON.stringify({'user': user,'message':`Manager identified: ${manager._id}`}))
            logger.info(JSON.stringify({'user': user,'message':`Job Status: ${req.body.status}`}))            
            switch(req.body.status){
                case 'Bids':
                    return Job.find({
                        'status': "Bid Complete",
                    })
                    .then((jobList) => {
                        // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                        res.status(200).json({
                            message: "Success",
                            jobs: jobList
                        });
                    })
                    .catch(err => {
                        logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                        console.log(err);
                        res.status(500).json({message: "error while getting Jobs"});
                    });

                case 'Assigned':
                    return Job.find({
                        status: req.body.status,
                    })
                    .populate('assignedTo')
                    .then((jobList) => {
                        // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                        res.status(200).json({
                            message: "Success",
                            jobs: jobList
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                        res.status(500).json({message: "error while getting Jobs"});
                    });

                    case 'Active':
                        return Job.find({
                            status: req.body.status,
                        })
                        .then((jobList) => {
                            // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                            res.status(200).json({
                                message: "Success",
                                jobs: jobList
                            });
                        })
                        .catch(err => {
                            logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                            console.log(err);
                            res.status(500).json({message: "error while getting Jobs"});
                        });                    

                case 'Completed':
                    return Job.find({
                        status: req.body.status,
                    })
                    .then((jobList) => {
                        // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                        res.status(200).json({
                            message: "Success",
                            jobs: jobList
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                        res.status(500).json({message: "error while getting Jobs"});
                    });
                
                default:
                    return res.status(404).json({
                        message:"Status not Found",
                        jobs: ""
                    })
            }            
        })
        .catch( err => {
            logger.info(JSON.stringify({'user': user,'message':`Manager not found getJobs, Checking for Admin`}))
            User.findOne({
                _id: user,
                role: "Admin"
            })
            .then(manager => {
                // console.log(manager)
                logger.info(JSON.stringify({'user': user,'message':`Admin identified: ${manager._id}`}))
                logger.info(JSON.stringify({'user': user,'message':`Job Status: ${req.body.status}`}))            
                switch(req.body.status){
                    case 'Bids':
                        return Job.find({
                            'status': "Bid Complete",
                        })
                        .then((jobList) => {
                            // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                            res.status(200).json({
                                message: "Success",
                                jobs: jobList
                            });
                        })
                        .catch(err => {
                            logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                            console.log(err);
                            res.status(500).json({message: "error while getting Jobs"});
                        });
    
                    case 'Assigned':
                        return Job.find({
                            status: req.body.status,
                        })
                        .populate('assignedTo')
                        .then((jobList) => {
                            // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                            res.status(200).json({
                                message: "Success",
                                jobs: jobList
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                            res.status(500).json({message: "error while getting Jobs"});
                        });
    
                        case 'Active':
                            return Job.find({
                                status: req.body.status,
                            })
                            .then((jobList) => {
                                // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                                res.status(200).json({
                                    message: "Success",
                                    jobs: jobList
                                });
                            })
                            .catch(err => {
                                logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                                console.log(err);
                                res.status(500).json({message: "error while getting Jobs"});
                            });                    
    
                    case 'Completed':
                        return Job.find({
                            status: req.body.status,
                        })
                        .then((jobList) => {
                            // logger.info(JSON.stringify({'user': user,'message':JSON.stringify(jobList)}))
                            res.status(200).json({
                                message: "Success",
                                jobs: jobList
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            logger.error(JSON.stringify({'user': user,'message':`Error getJob ${err}`}))
                            res.status(500).json({message: "error while getting Jobs"});
                        });
                    
                    default:
                        return res.status(404).json({
                            message:"Status not Found",
                            jobs: ""
                        })
                }            
            })
        })        
    })   

}

const getJobById = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':'Get JobById Request'}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    Contractor.findOne({
        user: user, 
    })
    .then( Contractor => {

        return Job.findOne({_id: req.body.id})
        .then((job) => {
            if (job) {
                // logger.info(JSON.stringify({'user': user,'message': job}))
                res.status(200).json({
                    message: "Success",
                    job: job
                });
            }
            else {
                logger.error(JSON.stringify({'user': user,'message': `Job with id ${req.body.id} not found`}))
                res.status(404).json({message: `Job with id ${req.body.id} not found`});    
            }
        })
        .catch(err => {
            logger.error(JSON.stringify({'user': user,'message': `GetJobById ${err}`}))
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
    })
    .catch( err => {
        logger.error(JSON.stringify({'user': user,'message': `GetJobById ${err}`}))
        console.log(err);
        return res.status(404).json({message: "Contractor not found"});        
    })    

}

const changeJobStatus = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':'Get changeJobStatus Request'}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    Contractor.findOne({
        user: user, 
    })
    .then( Contractor => {

        Job.findOne({
            _id: req.body.id
        })
        .then((job) => {
            if (job) {

                job.status = req.body.status;
                job.save();
                logger.info(JSON.stringify({'user': user,'message': `New Status: ${req.body.status}`}))
                res.status(200).json({
                    status: "200",
                    message: "Job Status Changed",
                });
            }
            else {
                logger.error(JSON.stringify({'user': user,'message': `Job with id ${req.body.id} not found`}))
                res.status(404).json({message: `Job with id ${req.body.id} not found`});    
            }
        })
        .catch(err => {
            logger.error(JSON.stringify({'user': user,'message': `changeJobStatus ${err}`}))
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
    })
    .catch( err => {
        logger.error(JSON.stringify({'user': user,'message': `changeJobStatus ${err}`}))        
        console.log(err);
        return res.status(404).json({message: "Contractor not found"});        
    })    

}

export {createJob, getJobs, getJobById, changeJobStatus};