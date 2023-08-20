import { NextFunction, Request, Response } from "express";
import {basedir} from '../app'
import Ffmpeg from "fluent-ffmpeg";

export async function fileUploadController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (req.file === undefined) {
            throw new Error("Please select a file");
        }
        // Ffmpeg("./uploads/file-1690964502628.mp4").ffprobe((err, data) => {
        //     console.log(data.streams[0])
        // })
        res.status(200).send("Master playlist file generated");
    } catch (error: any) {
        next(error);
    }
}

export async function fileServeController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const fileName = req.params.filename;
        const dirPath = basedir + "/output/";
        res.setHeader("Content-Type", "application/vnd.apple.mpegurl").download(
            dirPath + fileName,
            fileName,
            (err) => {
                if (err) {
                    res.status(500).send({ message: "Download failed " + err });
                }
            }
        );
    } catch (error: any) {
        next(error);
    }
}
