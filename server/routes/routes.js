import express from 'express';
import {createRequire} from "module";

import { signup, login } from '../controllers/auth.js';
import { createJob, getJobs, getJobById, changeJobStatus } from '../controllers/jobs.js';
import { uploadImage} from '../controllers/uploadImage.js';
import { isAuth, decodeToken } from '../middleware/auth.js';
import { getDoc } from '../controllers/docs.js';
import {createBid, getBidsByUser, getBidsByJob, acceptBid, getYourBid } from '../controllers/bid.js'
import { deleteUser, getUserDetails, getUsers, rateUser } from '../controllers/user.js';
import Image from '../models/image.js';

const require = createRequire(import.meta.url);
const fs = require("fs");

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/uploadimage', isAuth, uploadImage.array('photo', 3), (req, res) => {
    
    var img = fs.readFileSync(req.files[0].path);
    var encodedImg = img.toString('base64');

    Image.create({
        _id: req.body.id,
        image: encodedImg
    })
    .then(() => {
        res.status(201).json({
            status: "201",
            message: 'Image Uploaded',
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: "500",
            message: err,
        })        
    })
})


router.post('/getdoc', getDoc)

router.post('/createjob', createJob)

router.post('/getjobs', getJobs)

router.post('/getjobbyid', getJobById)

router.post('/createbid', createBid)

router.post('/getbidsbyuser', getBidsByUser)

router.post('/getbidsbyjob', getBidsByJob)

router.post('/acceptbid', acceptBid)

router.post('/getyourbid', getYourBid)

router.get('/getuserdetails', getUserDetails)

router.post('/getusers', getUsers);

router.post('/deleteuser', deleteUser);

router.post('/rateuser', rateUser)

router.post('/changejobstatus', changeJobStatus)

router.get('/private', isAuth);

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});



// will match any other path
// router.use('/', (req, res, next) => {
//     res.status(404).json({error : "page not found"});
// });

export default router;