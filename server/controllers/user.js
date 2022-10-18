import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import Manager from '../models/manager.js';

import {createRequire} from "module"
import Contractor from '../models/contractor.js';
import { decodeToken } from '../middleware/auth.js';

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

const getUserDetails = (req, res, next) => {
    const token = decodeToken(req);

    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':' getUserDetails Request'}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    Contractor.findOne({
        user: user, 
    })
    .then( Contractor => {
        User.findOne({
            _id: Contractor.user
        })
        .then( User => {
            return res.status(200).json({
                message: "Success",
                name: User.name,
                email: User.email,
                authPersonnel: Contractor.authPersonnel,
                services: Contractor.services,
                serviceLocation: Contractor.serviceLocation,
                rating: Contractor.rating,
                logo: Contractor.logo,
                contact: Contractor.contact,
            })
        })

    }).catch(err => {
        logger.error(JSON.stringify({'user': user,'message': `getUserDetails ${err}`}))
        console.log(err);
        return res.status(404).json({message: "Contractor not found"});
    })
}

const getUsers = (req, res, next) => {

    const token = decodeToken(req);
    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':' getUsers Request'}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    User.findOne({
        _id: user,
    })
    .then( user => {
        logger.info(JSON.stringify({'user': user,'message':`Role ${req.body.role}`}))
        if (user.role == "Admin") {

            if (req.body.role == 'Admin') {
                User.find({
                    role: req.body.role
                })
                .then( userList => {
                    logger.info(JSON.stringify({'user': user,'message':`UserList ${userList}`}))
                    return res.status(200).json({
                        message: "Success",
                        users: userList
                    })
                })
            }
            else if (req.body.role == 'Manager') {
                Manager.find()
                .populate('user','-password')
                .then(managerList => {
                    logger.info(JSON.stringify({'user': user,'message':`ManagerList ${managerList}`}))
                    return res.status(200).json({
                        message: "Success",
                        users: managerList
                    })
                })
            }
            else {
                Contractor.find()
                .populate('user', '-password')
                .then(contractorList => {
                    logger.info(JSON.stringify({'user': user,'message':`ContractorList ${contractorList}`}))
                    return res.status(200).json({
                        message: "Success",
                        users: contractorList
                    })
                })                
            }
        }
        else {
            return res.status(401).json({
                message: "Unauthorized",
            })
        }
    })
    .catch(err => {
        logger.error(JSON.stringify({'user': user,'message': `getUsers ERROR: ${err}`}))
        console.log(err);
        return res.status(404).json({message: "User not found"});
    })
}

const deleteUser = (req, res, next) => {
    const token = decodeToken(req);
    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':' deleteUsers Request'}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    User.findOne({
        _id: user,
    })
    .then( user => {
        if (user.role == "Admin") {
            if (req.body.role == 'Manager') {
                Manager.deleteOne({
                    _id: req.body.childId
                })
                .then(() => {
                    User.deleteOne({
                        _id: req.body.id
                    })
                    .then(() => {
                        logger.info(JSON.stringify({'user': user,'message': `User ${req.body.id} deleted`}))
                        return res.status(200).json({
                            message: "User Deleted"
                        })
                    })
                    .catch(err => {
                        return res.status(404).json({
                            message: "User not Found"
                        })                
                    })                    
                })
                .catch(err => {
                    return res.status(404).json({
                        message: "Manager not Found"
                    })                
                })
            }
            else if (req.body.role == 'Contractor') {
                Contractor.deleteOne({
                    _id: req.body.childId
                })
                .then(() => {
                    User.deleteOne({
                        _id: req.body.id
                    })
                    .then(() => {
                        logger.info(JSON.stringify({'user': user,'message': `User ${req.body.id} deleted`}))
                        return res.status(200).json({
                            message: "User Deleted"
                        })
                    })
                    .catch(err => {
                        return res.status(404).json({
                            message: "User not Found"
                        })                
                    })                    
                })
                .catch(err => {
                    return res.status(404).json({
                        message: "Contractor not Found"
                    })                
                })
            }
        }
        else {
            return res.status(401).json({
                message: "Unauthorized",
            })
        }
    })
    .catch(err => {
        logger.error(JSON.stringify({'user': user,'message': `deleteUsers ${err}`}))
        console.log(err);
        return res.status(404).json({message: "User not found"});
    })
}

const rateUser = (req, res, next) => {
    const token = decodeToken(req);
    const user = token["id"]

    logger.info(JSON.stringify({'user': user,'message':' rateUser Request'}))
    logger.info(JSON.stringify({'user': user,'message':JSON.stringify(req.body)}))

    User.findOne({
        _id: user,
    })
    .then( user => {
        if (user.role == "Admin" || user.role == 'Manager') {
            Contractor.findOne({
                _id: req.body.contractor
            })
            .then(contractor => {
                var availability = contractor.rating.availability
                var quality = contractor.rating.quality
                var jobs = contractor.rating.jobsCompleted

                var totalAvailability = (availability * jobs) + req.body.rating.availability
                var totalQuality = (quality * jobs)  + req.body.rating.quality
                var avgAvailability = (totalAvailability) / (jobs + 1)
                var avgQuality = (totalQuality) / (jobs + 1)
                var avg = (avgAvailability + avgQuality) / 2
                
                contractor.rating = {
                    "avg": avg, 
                    "jobsCompleted": jobs + 1,
                    "ongoing": contractor.rating.ongoing,
                    "availability": avgAvailability,
                    "quality": avgQuality
                }
                contractor.save()   
                return res.status(200).json({
                    message: "Rating Updated"
                })                    
            })
        }
    })
    .catch(err => {
        logger.error(JSON.stringify({'user': user,'message': `rateUser ${err}`}))
        console.log(err);
        return res.status(404).json({message: "User not found"});
    })
}

export {getUserDetails, getUsers, deleteUser, rateUser};