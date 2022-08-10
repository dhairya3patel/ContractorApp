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

const getUserDetails = (req, res, next) => {
    const token = decodeToken(req);

    const user = token["id"]
    // console.log(user)
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
        console.log(err);
        return res.status(404).json({message: "Contractor not found"});
    })
}

const getUsers = (req, res, next) => {
    const token = decodeToken(req);
    // console.log(token)
    const user = token["id"]

    User.findOne({
        _id: user,
    })
    .then( user => {
        // console.log(user)
        if (user.role == "Admin") {
            User.find({
                role: req.body.role
            })
            .then( userList => {
                return res.status(200).json({
                    message: "Success",
                    users: userList
                })
            })
        }
        else {
            return res.status(401).json({
                message: "Unauthorized",
            })
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(404).json({message: "User not found"});
    })
}

const deleteUser = (req, res, next) => {
    const token = decodeToken(req);
    // console.log(token)
    const user = token["id"]

    User.findOne({
        _id: user,
    })
    .then( user => {
        // console.log(user)
        if (user.role == "Admin") {
            User.findOne({
                _id: req.body.id
            })
            .delete()
            .then(() => {
                return res.status(200).json({
                    message: "User Deleted"
                })
            })
            .catch(err => {
                return res.status(404).json({
                    message: "User not Found"
                })                
            })
        }
        else {
            return res.status(401).json({
                message: "Unauthorized",
            })
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(404).json({message: "User not found"});
    })
}

export {getUserDetails, getUsers, deleteUser};