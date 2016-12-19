"use strict";

import * as express from "express";
import * as path from "path";

export class Views {
    constructor() {

    }

    public get = (req: express.Request, res: express.Response, next: express.NextFunction ) => {
        console.log('Showing web page')
        console.log(path.join(__dirname, 'views', 'index.html'))
        res.sendFile('index.html', { root: path.join(__dirname, 'views') })
        res.end()
    }
}