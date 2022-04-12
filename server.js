import express from "express";
import mongoose from "mongoose";
import { APP_PORT,DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";
import path from "path"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
global.appRoot = path.resolve(__dirname);
// app.use('/uploads', express.static('uploads'));

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
