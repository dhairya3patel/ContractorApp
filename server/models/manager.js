import pkg from 'mongoose'

import User from './user.js';

const { Schema:_Schema, model } = pkg;
const Schema = _Schema;

let managerSchema = new Schema({
  _id: {
    type: String
  },
  user: {
    type: String,
    ref: User
  },
}, {
    collection: 'manager'
  })
export default model('Manager', managerSchema)