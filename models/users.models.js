const db = require("../db/connection")

exports.selectAllUsers = () => {
    return db.query(`
    SELECT *
    FROM users`)
    .then(result => result.rows)
}

exports.selectUserById = (username) => {
    return db.query(`
    SELECT *
    FROM users
    WHERE username = $1`, [username])
    .then(result => {
        if (!result.rows.length) {
            return Promise.reject({status:400, msg: "not found"})
        }
        return result.rows[0]})
}