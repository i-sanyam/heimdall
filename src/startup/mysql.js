const mysql = require('mysql2/promise');
const logging = require('../utils/logging');

let connection = null;

(async function initialiseDbConnection() {
    connection = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'mac',
        password: 'macman',
        database: 'mac'
    });
})();

const executeQuery = async (query, queryParams) => {
    try {
        // console.log(connection);
        const [ rows ] = await connection.execute(query, queryParams);
        return rows;
    } catch (e) {
        logging.error(e);
        throw e;
    }
}

module.exports = { executeQuery  };