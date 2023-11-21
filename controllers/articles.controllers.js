const { checkExists } = require("../app-utils")
const { selectArticleById, selectArticleComments, selectAllArticles, patchVotes } = require("../models/articles.models")

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

    if (! +article_id) {
        res.status(400).send({msg: "bad request"})
    }

    const commentsPromise = [selectArticleComments(article_id), checkExists("articles", "article_id",article_id )]
 
    Promise.all(commentsPromise)
    .then((resolvedPromise) => {
        const comments = resolvedPromise[0]
        res.status(200).send({comments})
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

exports.patchArticleVotes = (req, res, next) => {   
    const {article_id} = req.params
    const votes = req.body.inc_votes
    patchVotes(article_id, votes)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}