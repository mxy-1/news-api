const { checkExists } = require("../app-utils")
const { selectArticleById, selectArticleComments, selectAllArticles, patchVotes, postComment, postNewArticle } = require("../models/articles.models")

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
    const {topic, sort_by, order, limit, p} = req.query
   
    const articlesPromise = [selectAllArticles(topic, sort_by, order, limit, p), selectAllArticles(topic, sort_by, order, limit, p, true) ]

    if (topic) {
        articlesPromise.push(checkExists("topics", "slug", topic))
    }

    Promise.all(articlesPromise)
    .then(resolvedPromise => {
        const articles = resolvedPromise[0]
        const total_count = resolvedPromise[1].length
        res.status(200).send({articles, total_count})
    })
    .catch(next)
}

exports.patchArticleVotes = (req, res, next) => {   
    const {article_id} = req.params
    const votes = req.body.inc_votes
    const articlesPromise = [patchVotes(article_id, votes), checkExists("articles", "article_id", article_id )]

    Promise.all(articlesPromise)
    .then(resolvedPromise => {
        const article = resolvedPromise[0]
        res.status(200).send({article})
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

exports.postArticle = (req, res, next) => {
    const article = req.body
    postNewArticle(article)
    .then(article => res.status(201).send({article}))
    .catch(next)
}