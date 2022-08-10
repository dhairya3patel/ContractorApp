import {createRequire} from "module";

import Image from '../models/image.js'

const require = createRequire(import.meta.url);

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

// const uploadImage = (req, res, next) => {

//   return Image.create({
//     _id: req.body.id,
//     image: req.body.image
//   })
//   .then(() => {
//     res.status(201).json({message: "Image Uploaded"});
//   })
//   .catch((err) => {
//     res.status(500).json({message: err})
//   })

// }

const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './files/images');
      // callback(null, 'public')
    },
    filename(req, file, callback) {
      // callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
      callback(null, `${file.originalname}`);
    },
  });
  
  
const uploadImage = multer({ storage: storage });

// const getImage = (req, res, next) => {
//   // const token = decodeToken(req);

//   // const user = token["id"]

//   // Contractor.findOne({
//   //     user: user, 
//   // })
//   // .then( Contractor => {

//     return Job.find({
//         status: req.body.status,
//     })
//     .then((jobList) => {
//         res.status(200).json({
//             message: "Success",
//             jobs: jobList
//         });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({message: "error while getting Jobs"});
//     });
//   })
//   .catch( err => {
//       console.log(err);
//       return res.status(404).json({message: "Contractor not found"});        
//   })  
// }

export {uploadImage};