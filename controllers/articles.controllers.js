const { selectArticleById, selectAllArticles, postComment } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.postCommentById = (req, res, next) => {
    const article_id = req.params.article_id
    const username = req.body.username
    const body = req.body.body

    if (!body || !username) {
        res.status(400).send({msg: "bad request"})
    }

    postComment(article_id, username, body)
    .then(comment => {
        res.status(201).send({comment})
    })
    .catch(next)
}