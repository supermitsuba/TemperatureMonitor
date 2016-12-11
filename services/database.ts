import * as mysql      from "mysql"

export interface IDatabase {
    executeQuery(statement: string, parameters: any[], 
        success: (data: mysql.IQuery) => void, 
        fail: (data: mysql.IError) => void)
}

export class Database implements IDatabase {
    private pool: mysql.IPool;

    constructor(config: mysql.IConnectionConfig) {
        this.pool = mysql.createPool(config)
    }

    public executeQuery(statement: string, parameters: any[], 
        success: (data: mysql.IQuery) => void, 
        fail: (data: mysql.IError) => void) {

        this.pool.getConnection(function(error: mysql.IError, conn: mysql.IConnection){
        if(error){
            error.message += " Here is the entity: "+ JSON.stringify(parameters)
            return fail(error)
        }

        conn.query(statement, parameters, function(err: mysql.IError, data: mysql.IQuery){
            if(error){
                error.message += " Here is the entity: "+ JSON.stringify(parameters)
                conn.release()
                return fail(error)
            }

            return success(data);
        })
    })
    }
}