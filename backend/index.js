import express, { urlencoded } from 'express'
import { connectToDb } from './db/index.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import userRoutes  from './routes/user.routes.js';
import bodyParser from 'body-parser';

const PORT= 8000;
dotenv.config({})
const app =  express()
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(urlencoded({extended:true}))

app.listen(PORT,()=>{
    connectToDb();
    console.log("Server listening at port 8000");
})
app.use('/api/v1/user',userRoutes)
