import pkg from 'mongoose'
import {createRequire} from "module"


const require = createRequire(import.meta.url);

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

import Manager from './manager.js'
import Contractor from './contractor.js';
const mongoose = require("mongoose")

const { Schema:_Schema, model } = pkg;
const Schema = _Schema;
const { ObjectId } = mongoose.Schema.Types;


let jobSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4()
    },
    po: {
        type: String,
        default: "",
    },
    address1: {
        type: String,
        default: ""

    },
    address2: {
        type: String,
        default: ""

    },
    city: {
        type: String,
        default: "Gainesville"

    },
    state: {
        type: String,
        default: "Florida"

    },
    zip: {
        type: Number,
        default: 32608

    },                
    jobType: {
        type: String,
        default: "",
        enum: ['AC Repair','AC Service','Paving']
    },
    dateTime: {
        type: Date,
        default: Date.now,        
    },
    dateOfCompletion: {
        type: Date,
        default: Date.now,        
    },
    bidWindow: {
        type: Number,
        default: 120,
    },
    bidLow: {
        type: Number ,
        default: 0
    },
    bidHigh: {
        type: Number,
        default: 0
    },
    clientEmail: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "Open",
        enum: ['Open', 'Bid Complete', 'Assigned', 'Active', 'Completed', 'Lapse']        
    },
    equipment: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    },
    pictures: {
        type: Array,
        default: []
    },
    estimatedHours: {
        type: Number,
        default: 0
    },
    assignedTo: {
        type: String,
        ref: Contractor
    },
    createdBy: {
        type: String,
        ref: Manager,
    },
    cost: {
        type: Number,
        default: 0
    }
},
{
    collection: "job"
})
export default model('Job', jobSchema)