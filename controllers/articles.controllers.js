const { checkExists } = require("../app-utils")
const { selectArticleById, selectArticleComments } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    const commentsPromise = [selectArticleComments(article_id), checkExists("articles", "article_id",article_id )]
 
    Promise.all(commentsPromise)
    .then((resolvedPromise) => {
        const comments = resolvedPromise[0]
        res.status(200).send({comments})
    })
    .catch(next)
}
