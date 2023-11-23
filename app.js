const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath, customError } = require("./errors")
const { getApi } = require("./controllers/api.controllers")
const { deleteCommentById } = require("./controllers/comments.controllers")
const { getArticleById, getArticleComments,getAllArticles, patchArticleVotes, postCommentById } = require("./controllers/articles.controllers")
const { getAllUsers } = require("./controllers/users.controllers")

const app = express()
app.use(express.json())

app.get("/api/topics", getAllTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById )
app.get("/api/articles/:article_id/comments", getArticleComments)
app.get("/api/articles/", getAllArticles)

app.delete("/api/comments/:comment_id", deleteCommentById)
app.patch("/api/articles/:article_id", patchArticleVotes)
app.post("/api/articles/:article_id/comments", postCommentById)

app.get("/api/users", getAllUsers)

app.all("*", invalidPath)

app.use(customError)
app.use(serverError)


// FEATURE REQUEST The endpoint should also accept the following query:

// topic, which filters the articles by the topic value specified in the query. ✅
//If the query is omitted, the endpoint should respond with all articles. ✅

// Consider what errors could occur with this endpoint, and make sure to test for them.
// topic that is not in the database - 404 (response does not exist) - not found ?

// topic that exists but does not have any articles associated with it - 200 sends [] - test added

// You should not have to amend any previous tests.

// Remember to add a description of this endpoint to your /api endpoint. ✅
//

module.exports = app



