const db = require("../db/connection")

exports.selectArticleById = (id) => {
    return db.query(`SELECT a.*, count(c.comment_id) as comment_count
    FROM articles a 
    LEFT JOIN comments c
    ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id`, [id])
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
exports.selectAllArticles = (topic) => {
    const queryValues = []
    let queryString = `
    SELECT a.author, a.article_id, a.title, a.topic, a.created_at, a.votes, a. article_img_url, count(c.comment_id) as comment_count 
    FROM articles a 
    LEFT JOIN comments c
    ON a.article_id = c.article_id `

    if (topic) {
        queryValues.push(topic)
        queryString += `WHERE topic = $1 `
    }

    queryString += "GROUP BY a.article_id ORDER BY a.created_at DESC"

    return db.query(queryString, queryValues)
    .then(result => {
        return result.rows
    })
}

exports.patchVotes = (id, votes) => {
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = ${id}
    RETURNING *;`,
    [votes])
    .then(result => {
        return result.rows[0]
    })
}
exports.postComment = (id, username, body) => {
    return db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
    [id, username, body])
    .then(result => {
        return result.rows[0]
    })
}