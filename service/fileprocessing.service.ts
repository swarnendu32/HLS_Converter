import ffmpeg from "fluent-ffmpeg";

export async function generateVariants(file: Express.Multer.File) {
    try {
        const outputFiles: string[] = [];
        const resolutions = [
            { resolution: "1920x1080", bitrate: "3000k" }, // Full HD
            { resolution: "1280x720", bitrate: "1500k" }, // HD
            { resolution: "640x480", bitrate: "500k" }, // SD
        ];
        for (const variant of resolutions) {
            const outputFilePath = `./output/output_${Date.now()}_${
                variant.resolution
            }p.m3u8`;
            ffmpeg(`./uploads/${file.filename}`)
                .videoCodec("libx265")
                .size(variant.resolution)
                .videoBitrate(variant.bitrate)
                .fps(24)
                .audioCodec("aac")
                .outputOptions([
                    "-g 48",
                    "-hls_time 10",
                    "-hls_list_size 0",
                ])
                .output(outputFilePath)
                .on("end", () => {
                    outputFiles.push(outputFilePath);
                })
                .on("error", (err: any) => {
                    throw new Error(
                        `Error creating ${variant.resolution}p variant.\n${err.message}`
                    );
                })
                .run();
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}
