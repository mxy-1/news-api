const db = require("../db/connection")

exports.selectAllTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then(({rows}) => rows)
}

exports.postTopicModel = (slug, description) => {
    return db.query(`
    INSERT INTO topics
    (slug, description)
    VALUES ($1, $2)
    RETURNING *`, [slug, description])
    .then(result => {
        return result.rows[0]
    })
}