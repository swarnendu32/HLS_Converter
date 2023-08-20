import { NextFunction, Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

export async function videoUploadMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.file) {
            throw new Error("No file provided");
        }
        const inputFile = `./uploads/${req.file.filename}`;
        const outputDir = `./output_${Date.now()}`;
        const variants = [
            {
                resolution: "1920x1080",
                bitrate: "1500",
            },
            {
                resolution: "1280x720",
                bitrate: "1000",
            },
            {
                resolution: "640x480",
                bitrate: "800",
            },
        ];
        const generateClipsPlaylist = (variant: any) => {
            return new Promise((resolve, reject) => {
                const playlistPath = `${outputDir}/variant_${Date.now()}_${
                    variant.resolution
                }p.m3u8`;
                const fileName = `variant_${Date.now()}_${
                    variant.resolution
                }p.m3u8`;
                ffmpeg(inputFile)
                    .videoCodec("libx265")
                    .audioCodec("aac")
                    .size(variant.resolution)
                    .videoBitrate(variant.bitrate, true)
                    .fps(24)
                    .outputOptions([
                        "-g 48",
                        "-hls_time 10",
                        "-hls_list_size 0",
                    ])
                    .output(playlistPath)
                    .on("end", () => resolve(fileName))
                    .on("error", (err) => {
                        reject(err);
                    })
                    .run();
            });
        };
        const playlistPromises: Promise<unknown>[] =
            variants.map(generateClipsPlaylist);
        Promise.all(playlistPromises)
            .then((playlistPaths) => {
                const masterPlaylistPath = `${outputDir}master_playlist.m3u8`;
                const masterPlaylistContent = playlistPaths
                    .map(
                        (playlistPath, index) =>
                            `#EXT-X-STREAM-INF:BANDWIDTH=${variants[index].bitrate},RESOLUTION=${variants[index].resolution}\n${playlistPath}`
                    )
                    .join("\n");
                const masterPlaylistHeader = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-INDEPENDENT-SEGMENTS\n# Variant streams\n`;
                fs.writeFileSync(
                    masterPlaylistPath,
                    masterPlaylistHeader.concat(masterPlaylistContent)
                );
            })
            .then(() => { 
                fs.readdir(outputDir, (err, files) => {
                    if(err) {
                        throw new Error("Something went wrong!")
                    }
                    files.forEach((file, i) => {
                        fs.readFile(file, (err, data) => {
                            if(err) {
                                throw new Error("Something went wrong!")
                            }
                            //const result = await uploadToS3Bucket(data)
                        })
                    })
                })
                fs.unlinkSync(outputDir)
                next()
            });
    } catch (error) {
        next(error);
    }
}
