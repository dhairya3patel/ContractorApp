import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userSchema from '../models/user.js';

import {createRequire} from "module"

const require = createRequire(import.meta.url);

const { 
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

const isAuth = (req, res, next) => {
    // console.log(req);
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    // const token = authHeader.split(' ')[1];
    // console.log(authHeader[0]);

    const token = authHeader;
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } 
    console.log(decodedToken);
    next();
    // else {
        // res.status(200).json({ message: 'here is your resource' });
    // };
};

const decodeToken = (req) => {
    // console.log(req);
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return 'not authenticated';
    };

    const token = authHeader;
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        decodedToken = err.message || 'could not decode the token';
    };
    return decodedToken;
};

export { isAuth, decodeToken };