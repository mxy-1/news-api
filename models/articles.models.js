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

exports.selectAllArticles = () => {
    return db.query(`
    SELECT a.author, a.article_id, a.title, a.topic, a.created_at, a.votes, a. article_img_url, count(a.article_id) as comment_count from articles a 
    JOIN comments
    ON a.article_id = comments.article_id 
    GROUP BY a.article_id
    ORDER BY created_at DESC;`)
    .then(result => {
        return result.rows
    })
}