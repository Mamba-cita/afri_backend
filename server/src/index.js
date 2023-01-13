const express = require ('express');
require('dotenv').config();
const {graphqlHTTP} = require('express-graphql')
const colors =require('colors')
const schema = require('../schema/schema')
const connectDB = require('../config/db')
const morgan = require('morgan')
const cors = require('cors')
const port = process.env.PORT || 5000


const app = express();


//connect DB

connectDB();

app.use(cors());

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/graphql' , graphqlHTTP({

schema,
graphiql: process.env.NODE_ENV === 'development'



}))





app.listen(port , console.log(`Server Running on port ${port}`));