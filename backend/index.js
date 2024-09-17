import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import userRoute from "./routes/user_route.js"

dotenv.config({})

const app = express()


//middlewares

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"data from backend",
        success:true
    })
})
// 6RCXGgXw1pkKOAjI
// guptamushkan817

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions={
    origin:"http://localhost:5173",
    credentials:true
}

app.use(cors(corsOptions))

app.use("/api/v1/user",userRoute)


const PORT = process.env.PORT || 3003;
console.log(PORT)
app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on ${PORT}`)
})