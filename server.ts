"use strict";

import * as bodyParser from "body-parser"
import * as express    from "express"
import * as path       from "path"
import * as route      from "./routes/index"
import * as view      from "./routes/view"
import * as mysql      from "mysql"
import * as data       from "./services/database"

const port = 3000;

class Server {
    private database: data.IDatabase
    public app:       express.Application


    public static bootstrap(): Server {
        return new Server()
    }

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    private config() {
        this.app.listen(port, function() {
            console.log('Example app listening on port 3000!')
        })

        this.app.use(bodyParser.json())
        
        var mysqlConfig:mysql.IPoolConfig = {}
        mysqlConfig.host     = "localhost"
        mysqlConfig.database = "iot"
        mysqlConfig.user     = "root"
        mysqlConfig.password = "password"

        this.database = new data.Database(mysqlConfig)
    }

    private routes() {
        //get router
        let router: express.Router
        router = express.Router()

        //create routes
        var index: route.Temperature = new route.Temperature(this.database)
        var views: view.Views = new view.Views()

        //home page
        router.get("/temperature", views.get.bind(views.get))
        router.get("/api/temperature", index.getAll.bind(index.getAll))
        router.post("/api/temperature", index.post.bind(index.post))

        //use router middleware
        this.app.use(router)
    }
}

export = Server.bootstrap().app
