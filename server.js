import express from "express";
import mongoose from "mongoose";
import { APP_PORT,DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();
app.use(express.json());

app.use('/api',routes)

// Database connection
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
