const db = require("../db/connection")

exports.selectArticleById = (id) => {
    return db.query(`
    SELECT *
    FROM articles
    WHERE article_id = $1`, [id])
    .then(result => {
        if (! result.rows.length) {
            return Promise.reject({status:404, msg: "article does not exist" })
        } else {
            return result.rows[0]
        }
    })
}