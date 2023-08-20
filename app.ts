import express from "express";
import router from "./routes/upload.route";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Replace '*' with the allowed origin(s)
    res.header("Access-Control-Allow-Methods", "GET");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(router);
app.use(errorHandler);
export const basedir = __dirname
app.listen(3000, () => {
    console.log("App is running on port 3000");
});