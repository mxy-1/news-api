const { getArticleById, getArticleComments, getAllArticles, patchArticleVotes, postCommentById, postArticle, deleteById } = require("../controllers/articles.controllers")
const express = require("express")

const articlesRouter = express.Router()

articlesRouter
    .route("/")
    .get(getAllArticles)
    .post(postArticle)

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleVotes)
    .delete(deleteById)

articlesRouter
    .route("/:article_id/comments")
    .get(getArticleComments)
    .post(postCommentById)

module.exports = articlesRouter
