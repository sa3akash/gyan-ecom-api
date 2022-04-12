import express from "express";
import mongoose from "mongoose";
import { APP_PORT,DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();
app.use(express.urlencoded({ extended: false }));
// app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use('/api',routes)

// Database connection
//DB_URL='mongodb+srv://flip-eccomarce:avroo@cluster0.sjz2v.mongodb.net/rest-api?retryWrites=true&w=majority'
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});




app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Server is start on Port ${APP_PORT}`));
