const { serverError, invalidPath, customError, psqlError } = require("./errors")
const articlesRouter = require("./routes/articles-router")
const commentsRouter = require("./routes/comments-router")
const usersRouter = require("./routes/users-router")
const topicsRouter = require("./routes/topics-router")
const apiRouter = require("./routes/api-router")
const express = require("express")

const app = express()
app.use(express.json())

app.use("/api", apiRouter)

apiRouter.use("/topics", topicsRouter)
apiRouter.use("/articles", articlesRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/users", usersRouter)

app.all("*", invalidPath)

app.use(customError)
app.use(psqlError)
app.use(serverError)

module.exports = app

// be available on /api/topics.
// add new topic.
// Request body accepts:
// an object in the form:
// {
//   "slug": "topic name here",
//   "description": "description here"
// } ✅
// Responds with:
// 201 - a topic object containing the newly added topic.  ✅
// 400 bad reuqest when missing properties { ...} ✅
// 400 bad request when properties not valid asd:"desc" ✅
// 400 bad reqest when values not valid ✅
// 400 bad requets - extra properties ✅

// Consider what errors could occur with this endpoint, and make sure to test for them.

// Remember to add a description of this endpoint to your /api endpoint. ✅