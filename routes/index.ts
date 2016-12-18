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
        var statement:string = 'INSERT INTO temperature (value, dateOfOccurance, deviceId) VALUES (?,?,?);'
        var parameters:any[] = [req.body.value, req.body.dateOfOccurance, req.body.deviceId]

        console.dir(parameters)
        this.db.executeQuery(statement, parameters, 
            (data: any) => {
                res.end('ok')
            }, (error: mysql.IError) => {
                console.log(error)
                res.end('error 1')
            })
      }

      public getAll = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var statement:string = 'Select id, value, dateOfOccurance, deviceId, createdDate from temperature;'
        var parameters:any[] = []

        this.db.executeQuery(statement, parameters, 
            (data: any) => {
                res.end(JSON.stringify(data))
            }, (error: mysql.IError) => {
                res.end('error 2')
                console.dir(error)
            })
      }
   }