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

exports.selectArticleComments = (article_id) => {
    return db.query(`
    SELECT c.comment_id, c.votes, c.author, a.article_id, c.body, c.created_at 
    FROM articles a 
    JOIN comments c 
    ON a.article_id = c.article_id 
    WHERE a.article_id = $1 
    ORDER BY c.created_at DESC;
    `, [article_id])
    .then(result => {
        return result.rows
    })

}