define("services/database", ["require", "exports", "mysql"], function (require, exports, mysql) {
    "use strict";
    var Database = (function () {
        function Database(config) {
            this.pool = mysql.createPool(config);
        }
        Database.prototype.executeQuery = function (statement, parameters, success, fail) {
            this.pool.getConnection(function (error, conn) {
                if (error) {
                    error.message += " Here is the entity: " + JSON.stringify(parameters);
                    console.log(error.message);
                    return fail(error);
                }
                conn.query(statement, parameters, function (err, results) {
                    if (err) {
                        err.message += " Here is the entity: " + JSON.stringify(parameters);
                        console.log(err.message);
                        conn.release();
                        return fail(err);
                    }
                    return success(results);
                });
            });
        };
        return Database;
    }());
    exports.Database = Database;
});
define("routes/index", ["require", "exports"], function (require, exports) {
    "use strict";
    var Temperature = (function () {
        function Temperature(database) {
            var _this = this;
            this.db = null;
            this.post = function (req, res, next) {
                var statement = 'INSERT INTO temperature (temp, humidity, dateOfOccurance, deviceId) VALUES (?,?,?,?);';
                var parameters = [req.body.temp, req.body.humidity, req.body.dateOfOccurance, req.body.deviceId];
                console.dir(parameters);
                _this.db.executeQuery(statement, parameters, function (data) {
                    res.set("Connection", "close");
                    res.send('ok');
                    res.end();
                }, function (error) {
                    console.log(error);
                    res.set("Connection", "close");
                    res.send('error 1');
                    res.end();
                });
            };
            this.getAll = function (req, res, next) {
                var statement = 'Select * from temperature;';
                var parameters = [];
                _this.db.executeQuery(statement, parameters, function (data) {
                    res.end(JSON.stringify(data));
                }, function (error) {
                    res.set("Connection", "close");
                    res.send('error 2');
                    res.end();
                    console.dir(error);
                });
            };
            this.db = database;
        }
        return Temperature;
    }());
    exports.Temperature = Temperature;
});
define("server", ["require", "exports", "body-parser", "express", "routes/index", "services/database"], function (require, exports, bodyParser, express, route, data) {
    "use strict";
    var port = 3000;
    var Server = (function () {
        function Server() {
            this.app = express();
            this.config();
            this.routes();
        }
        Server.bootstrap = function () {
            return new Server();
        };
        Server.prototype.config = function () {
            this.app.listen(port, function () {
                console.log('Example app listening on port 3000!');
            });
            this.app.use(bodyParser.json());
            var mysqlConfig = {};
            mysqlConfig.host = "data";
            mysqlConfig.database = "iot";
            mysqlConfig.user = "root";
            mysqlConfig.password = "password";
            this.database = new data.Database(mysqlConfig);
        };
        Server.prototype.routes = function () {
            //get router
            var router;
            router = express.Router();
            //create routes
            var index = new route.Temperature(this.database);
            //home page
            router.get("/api/temperature", index.getAll.bind(index.getAll));
            router.post("/api/temperature", index.post.bind(index.post));
            //use router middleware
            this.app.use(router);
        };
        return Server;
    }());
    return Server.bootstrap().app;
});
