import pkg from 'mongoose'

import Contractor from './contractor.js';
import Job from './job.js'
import Bid from './bid.js';

const { Schema:_Schema, model } = pkg;
const Schema = _Schema;

let acceptedBidSchema = new Schema({
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
  bid : {
    type: String,
    ref: Bid,
  }
}, {
    collection: 'acceptedBid'
  })
export default model('AcceptedBid', acceptedBidSchema)