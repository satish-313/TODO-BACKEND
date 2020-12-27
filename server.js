const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

// local import 
const authRoute = require('./route/user')
const postRoute = require('./route/post')

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
const connection_url = process.env.ATLAS_URI;
const local_url = process.env.LOCAL_URL
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}));
app.use(express.json())
app.use(cors({exposedHeaders:'auth-token'}))

mongoose.connect(local_url,{useNewUrlParser:true, useUnifiedTopology:true})
.then(() => console.log('connect to db'))
.catch((error) => console.log(error))

app.use('/user',authRoute)
app.use('/post',postRoute)


app.listen(port , () => console.log(`Server is running on port ${port}`))