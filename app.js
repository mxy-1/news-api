const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath, customError } = require("./errors")
const { getApi } = require("./controllers/api.controllers")
const { getArticleById, getArticleComments,getAllArticles } = require("./controllers/articles.controllers")

const app = express()

app.get("/api/topics", getAllTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById )
app.get("/api/articles/:article_id/comments", getArticleComments)
app.get("/api/articles/", getAllArticles)

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
