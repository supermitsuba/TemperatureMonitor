"use strict";

import * as express from "express";
import * as mysql   from "mysql"; 
import * as data    from "../services/database"

  export class Temperature {
      private db: data.IDatabase = null

      constructor(database: data.IDatabase) {
          this.db = database
      }

      public post = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var statement:string = 'INSERT INTO temperature (temp, humidity, dateOfOccurance, deviceId) VALUES (?,?,?,?);'
        var parameters:any[] = [req.body.temp, req.body.humidity, req.body.dateOfOccurance, req.body.deviceId]

        console.dir(parameters)
        this.db.executeQuery(statement, parameters, 
            (data: any) => {
                res.set("Connection", "close")
                res.send('ok')
                res.end()
            }, (error: mysql.IError) => {
                console.log(error)
                res.set("Connection", "close")
                res.send('error 1')
                res.end();
            })
      }

      public getAll = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var statement:string = 'select * from temperature order by dateOfOccurance desc limit 10;'
        var parameters:any[] = []

        this.db.executeQuery(statement, parameters, 
            (data: any) => {
                res.end(JSON.stringify(data))
            }, (error: mysql.IError) => {
                res.set("Connection", "close")
                res.send('error 2')
                res.end()
                console.dir(error)
            })
      }
   }