import pkg from 'mongoose'

import Contractor from './contractor.js';
import Job from './job.js'

const { Schema:_Schema, model } = pkg;
const Schema = _Schema;

let bidSchema = new Schema({
  _id: {
    type: String
  },
  contractor: {
    type: String,
    ref: Contractor
  },
  job: {
    type: String,
    ref: Job,
  },
  amount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Open",
    enum: ["Open", "Closed"]
  }
}, {
    collection: 'bid'
  })
export default model('Bid', bidSchema)