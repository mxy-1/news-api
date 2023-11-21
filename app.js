const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath, customError } = require("./errors")
const { getApi } = require("./controllers/api.controllers")
const { getArticleById, getArticleComments,getAllArticles, patchArticleVotes } = require("./controllers/articles.controllers")

const app = express()
app.use(express.json())

app.get("/api/topics", getAllTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById )
app.get("/api/articles/:article_id/comments", getArticleComments)
app.get("/api/articles", getAllArticles)

app.patch("/api/articles/:article_id", patchArticleVotes)

app.all("*", invalidPath)

app.use(customError)
app.use(serverError)

// Should:

// be available on /api/articles/:article_id.
// update an article by article_id.


// Consider what errors could occur with this endpoint, and make sure to test for them.

// bad article id e.g. bnanaa
// article id doesn't exist e.g 99 - 400
// invalid votes e.g. cat - 400

// Remember to add a description of this endpoint to your /api endpoint.

module.exports = app
