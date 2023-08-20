import { NextFunction, Request, Response } from "express";

export async function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.send(400).send("Something Went Wrong!");
}
