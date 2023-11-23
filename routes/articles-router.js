const { getArticleById, getArticleComments, getAllArticles, patchArticleVotes, postCommentById } = require("../controllers/articles.controllers")
const express = require("express")

const articlesRouter = express.Router()

articlesRouter
    .route("/")
    .get(getAllArticles)

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleVotes)

articlesRouter
    .route("/:article_id/comments")
    .get(getArticleComments)
    .post(postCommentById)

module.exports = articlesRouter
