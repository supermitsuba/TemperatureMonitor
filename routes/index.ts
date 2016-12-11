"use strict";

import * as express from "express";
import * as mysql   from "mysql"; 
import * as data    from "../services/database"

module Route {

  export class Temperature {
      private db: data.IDatabase

      constructor(db: data.IDatabase) {
          this.db = db
      }

      public post(req: express.Request, res: express.Response, next: express.NextFunction) {
        var statement:string = 'INSERT INTO Temperature (value, dateOfOccurance) VALUES (?,?);'
        var parameters:any[] = []

        this.db.executeQuery(statement, parameters, 
            (data: mysql.IQuery) => {
                res.end(data)
            }, (error: mysql.IError) => {
                res.end(error)
            })
      }

      public getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        var statement:string = 'Select * from Temperature;'
        var parameters:any[] = []

        this.db.executeQuery(statement, parameters, 
            (data: mysql.IQuery) => {
                res.end(data)
            }, (error: mysql.IError) => {
                res.end(error)
            })
      }
   }
}

export = Route;