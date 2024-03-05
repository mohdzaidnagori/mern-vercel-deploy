import  express  from "express";
import path from "path"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js";
import userRoutes from '../backend/routes/userRoutes.js'
import cookieParser from "cookie-parser";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config()

connectDB()

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(cookieParser());
const corsConfig ={
    origin:"*",
    credential:true,
    methods:["GET","POST","PUT","DELETE"]
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig))

app.use('/api/users', userRoutes)

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')))
    app.get('*' , (req, res) => res.sendFile(path.resolve(__dirname, 'frontend' , 'dist', 'index.html')));
}
else{
    app.get('/', (res,req) => res.send('Server is ready'));
}


app.use(notFound);
app.use(errorHandler);

app.listen(port , () => console.log(`Server started on port ${port}`));