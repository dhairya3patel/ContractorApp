import {createRequire} from "module";

const require = createRequire(import.meta.url);

const env = require('dotenv').config('config.env')


const MAIL_USERNAME = env.parsed.MAIL_USERNAME
const MAIL_PASSWORD = env.parsed.MAIL_PASSWORD

const DB_USER = env.parsed.DB_USER
const DB_PASSWORD = env.parsed.DB_PASSWORD
const DB_COLLECTION = env.parsed.DB_COLLECTION

const MONGO_USER = env.parsed.MONGO_USER
const MONGO_PASSWORD = env.parsed.MONGO_PASSWORD
const MONGO_URI = env.parsed.MONGO_URI


const ATLAS_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URI}?retryWrites=true&w=majority`

const DB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_COLLECTION}/?tls=true&retryWrites=false`
export {ATLAS_URI, DB_URI, MAIL_USERNAME, MAIL_PASSWORD};