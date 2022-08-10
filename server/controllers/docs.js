import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Contractor from '../models/contractor.js';
import { decodeToken } from '../middleware/auth.js';
import Doc from '../models/doc.js';

import {createRequire} from "module"

const require = createRequire(import.meta.url);

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const getDoc = (req, res, next) => {

    const token = decodeToken(req);

    const user = token["id"]

    Contractor.findOne({
        user: user, 
    })
    .then( Contractor => {

        return Doc.find({
            name: req.body.name,
        })
        .then((doc) => {
            res.status(200).json({
                message: "Success",
                doc: doc[0].data
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "error while getting Doc"});
        });
    })
    .catch( err => {
        console.log(err);
        return res.status(404).json({message: "Contractor not found"});        
    })    

}


export {getDoc};