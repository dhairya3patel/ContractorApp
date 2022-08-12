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

  
const signup = async(req, res, next) => {
    // checks if email already exists
    logger.info(JSON.stringify({'user': '','message':`SignUp Req`}))
    logger.info(JSON.stringify({'user': '','message': JSON.stringify(req.body)}))

    User.findOne({
        email: req.body.email, 
    })
    .then(dbUser => {
        // console.log(dbUser);
        if (dbUser) {
            logger.error(JSON.stringify({'user': '','message':`User with email ${req.body.email} already exists`}))
            return res.status(409).json({message: "email already exists"});
        } else if (req.body.email && req.body.password) {
            // password hash
            bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                if (err) {
                    logger.error(JSON.stringify({'user': '','message':`Password hash error: ${err}`}))
                    return res.status(500).json({message: "couldnt hash the password"}); 
                } else if (passwordHash) {
                    User.create(({
                        _id: uuidv4(),
                        email: req.body.email,
                        name: req.body.name,
                        password: passwordHash,
                        role: req.body.role
                    }))
                    .then((newUser) => {
                        logger.info(JSON.stringify({'user': '','message':`User Created: ${newUser}`}))
                        if (req.body.role === "PM")
                            Manager.create(({
                                _id: uuidv4(),
                                user: newUser
                            }))
                            .then((manager) => {
                                logger.info(JSON.stringify({'user': '','message':`Manager Created: ${manager}`}))
                                return res.status(201).json({message: "user created"});
                            })
                            .catch(err => {
                                logger.error(JSON.stringify({'user': '','message':`Error creating manager object: ${err}`}));
                                return res.status(502).json({message: "error while creating manager"});
                            })
                        else if (req.body.role === "Contractor"){
                            var services = [];
                            for (var index in req.body.services){
                                services.push({id:uuidv4(),name:req.body.services[index]})
                            } 
                            Contractor.create(({
                                _id: uuidv4(),
                                user: newUser,
                                name: newUser.name,
                                services: services,
                                authPersonnel: req.body.authPersonnel,
                                logo: req.body.logo,
                                serviceLocation: req.body.serviceLocation,
                                contact: req.body.contact,
                                rating: req.body.rating
                            }))
                            .then((contractor) => {
                                logger.info(JSON.stringify({'user': '','message':`Contractor Created: ${contractor}`}))
                                return res.status(201).json({message: "user created"});
                            })
                            .catch(err => {
                                logger.error(JSON.stringify({'user': '','message':`Error creating contractor object: ${err}`}));
                                console.log(err);
                                return res.status(502).json({message: "error while creating Contractor"});
                            })
                        }
                        else if (req.body.role === "Admin") {
                            return res.status(201).json({message: "user created"});
                        }        
                    })
                    .catch(err => {
                        logger.error(JSON.stringify({'user': '','message':`Error creating user object: ${err}`}));
                        console.log(err);
                        return res.status(502).json({message: "error while creating user"});
                    });
                };
            });
        } else if (!req.body.password) {
            return res.status(400).json({message: "password not provided"});
        } else if (!req.body.email) {
            return res.status(400).json({message: "email not provided"});
        };
    })
    .catch(err => {
        logger.error(JSON.stringify({'user': '','message':`SignUp Error: ${err}`}));
        console.log('error', err);
    });
};

const login = (req, res, next) => {
    // checks if email exists
    logger.info(JSON.stringify({'user': '','message':`Login Req`}))
    logger.info(JSON.stringify({'user': '', 'message': JSON.stringify(req.body)}))

    User.findOne({
        email: req.body.email, 
    })
    .then(dbUser => {
        if (!dbUser) {
            logger.error(JSON.stringify({'user': '','message':`User ${req.body.email} not found`}))
            return res.status(404).json({message: "user not found"});
        } else {
            // password hash
            bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) => {
                if (err) { // error while comparing
                    logger.error(JSON.stringify({'user': '','message':`password check error: ${err}`}))
                    res.status(502).json({message: "error while checking user password"});
                } else if (compareRes) { // password match
                    const token = jwt.sign({id: dbUser.id, role: dbUser.role}, 'secret', { expiresIn: '1h' });
                    logger.info(JSON.stringify({'user': dbUser._id,'message':`Status 200`}))                    
                    logger.info(JSON.stringify({'user': dbUser._id,'message':`Login Token: ${token}`}))
                    logger.info(JSON.stringify({'user': dbUser._id,'message':`Role: ${dbUser.role}`}))
                    res.status(200).json({
                        message: "user logged in",
                        "token": token,
                        "role": dbUser.role
                    });
                } else { // password doesnt match
                    logger.error(JSON.stringify({'user': '','message':'Passwords dont match'}))
                    res.status(401).json({message: "invalid credentials"});
                };
            });
        };
    })
    .catch(err => {
        logger.error(JSON.stringify({'user': '','message':`Login error: ${err}`}))
        console.log('error', err);
    });
};


const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
};

export { signup, login, isAuth };