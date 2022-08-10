import pkg from 'mongoose'

const { Schema:_Schema, model } = pkg;
const Schema = _Schema;

let docSchema = new Schema({
  _id: {
    type: String
  },
  name: {
    type: String
  },
  data: {
    data: Buffer,
    type: String
  },
}, {
    collection: 'doc'
  })
export default model('Doc', docSchema)