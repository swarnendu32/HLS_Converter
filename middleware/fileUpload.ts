import multer from "multer";
import path from "path";
import util from "util";

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (req, file, callback) => {
        callback(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const uploadFile = multer({
    storage,
    fileFilter(req, file, callback) {
        if (file.mimetype.split("/")[0] === "video") {
            callback(null, true);
        } else {
            callback(new Error("INVAILD_FILE_TYPE"));
        }
    },
}).single("file");

export const uploadFileMiddleware = util.promisify(uploadFile);
