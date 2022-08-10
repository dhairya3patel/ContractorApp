import pkg from 'mongoose'

import User from './user.js';

const { Schema:_Schema, model } = pkg;
const Schema = _Schema;

let contractorSchema = new Schema({
  _id: {
    type: String
  },
  name: {
    type: String,
    ref: User.name
  },
  user: {
    type: String,
    ref: User
  },
  services: {
    type: Array,
    default: []
  },
  contact: {
    type: String,
    default: "0000000000"
  },
  serviceLocation: {
    type: Array,
    default: []
  },
  authPersonnel:{
    type: String,
    default: ""
  },
  logo: {
    type: String,
    default: ""
  },
  rating: {
    type: JSON,
    default: {
      avg: 0, 
      jobsCompleted: 0,
      ongoing: 0,
      availability: "good",
      service: "good",
      quality: "good"
    }
  }
}, {
    collection: 'contractor'
  })
export default model('Contractor', contractorSchema)