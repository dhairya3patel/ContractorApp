import pkg from 'mongoose'

const { Schema:_Schema, model } = pkg;
const Schema = _Schema;
let userSchema = new Schema({
  _id: {
    type: String
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['Manager', 'Contractor', 'Admin']
  }
}, {
    collection: 'user'
  })
export default model('User', userSchema)