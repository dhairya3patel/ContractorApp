import express from 'express';
import router from './routes/routes.js';
import {createRequire} from "module";
import {ATLAS_URI} from "./constants.js"


const require = createRequire(import.meta.url);

const { createLogger, format, transports } = require('winston');


const logger = createLogger({
transports:
    new transports.File({
    filename: 'logs/server.log',
    format:format.combine(
        format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )}),
})

const mongoose = require('mongoose');
mongoose.set('debug', true);

const path = require('path');

// const ATLAS_URI = "mongodb+srv://dhairyaPatel:4XiWnkxb915Rna4L@cluster0.pki6l.mongodb.net/contractor?retryWrites=true&w=majority"

const app = express();
const cors = require('cors');
require("dotenv").config({ path: "./config.env" });
const host = 'localhost'
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// get driver connection
// const dbo = require("./database/conn");
 

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(router);

mongoose
  .connect(ATLAS_URI)
  .then((x) => {
    logger.info(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    logger.error('Error connecting to mongo', err.reason)    
    console.error('Error connecting to mongo', err.reason)
  })
  
app.use('/static',express.static('files'));
app.listen(port, () => {
  logger.info(`Server started and running on http://${host}:${port}`)
});