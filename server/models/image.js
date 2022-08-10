import pkg from 'mongoose'

const { Schema:_Schema, model } = pkg;
const Schema = _Schema;

let imageSchema = new Schema({
  _id: {
    type: String
  },
  image: {
    data: Buffer,
    type: String
  },
}, {
    collection: 'image'
  })
export default model('Image', imageSchema)