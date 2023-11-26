const db = require("../db/connection")

exports.selectArticleById = (id) => {
    return db.query(`SELECT a.*, count(c.comment_id) as comment_count
    FROM articles a 
    LEFT JOIN comments c
    ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id`, [id])
        .then(result => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: "article does not exist" })
            } else {
                return result.rows[0]
            }
        })
}

exports.selectArticleComments = (article_id, limit=10, p=1) => {
    if (p === 1) {
        p = 0
    } else {
        p = (p - 1) * limit
    }

    return db.query(`
    SELECT c.comment_id, c.votes, c.author, a.article_id, c.body, c.created_at 
    FROM articles a 
    JOIN comments c 
    ON a.article_id = c.article_id 
    WHERE a.article_id = $1 
    ORDER BY c.created_at DESC
    LIMIT ${limit} 
    OFFSET ${p};
    `, [article_id])
        .then(result => {
            if (!result.rows.length && p>1) {
                return Promise.reject({status:404, msg: "not found"})
            }
            return result.rows
        })
}
exports.selectAllArticles = (topic, sort_by = "created_at", order = "desc", limit = 10, p = 1, all = false) => {
    const sortByCategories = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url"]
    const orderCategories = ["desc", "asc"]

    if (!sortByCategories.includes(sort_by.toLowerCase()) || !orderCategories.includes(order.toLowerCase())) {
        return Promise.reject({ status: 400, msg: "bad request" })
    }

    const queryValues = []
    let queryString = `
    SELECT a.author, a.article_id, a.title, a.topic, a.created_at, a.votes, a. article_img_url, COUNT(c.comment_id) as comment_count
    FROM articles a 
    LEFT JOIN comments c
    ON a.article_id = c.article_id `

    if (topic) {
        queryValues.push(topic)
        queryString += `WHERE topic = $1 `
    }

    if (p === 1) {
        p = 0
    } else {
        p = (p - 1) * limit
    }

    queryString += `GROUP BY a.article_id ORDER BY a.${sort_by} ${order} `

    const paginationStr = `LIMIT ${limit} OFFSET ${p}`

    if (!all) {
        queryString += paginationStr
    }
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

exports.postNewArticle = (article) => {
    let queryString = `INSERT INTO articles `
    const columns = ["author", "title", "body", "topic"]
    let values = ["$1", " $2", "$3", "$4"]
    let queryValuesArray = [article.author, article.title, article.body, article.topic]

    if (article.article_img_url) {
        columns.push("article_img_url")
        values.push("$5")
        queryValuesArray.push(article.article_img_url)
    }

    queryString += `(${columns.join()}) VALUES (${values.join()}) RETURNING * `

    return db.query(queryString, queryValuesArray)
        .then((result) => {
            const article = result.rows[0]
            article.comment_count = 0
            return article
        })
}