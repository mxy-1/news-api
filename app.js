const { serverError, invalidPath, customError } = require("./errors")
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
app.use(serverError)

module.exports = app


// Accepts the following queries:
// GET /api/articles (pagination)

// (defaults to 10) ✅
// limit, which limits the number of responses  ✅

// p, stands for page and specifies the page at which to start (calculated using limit). ✅

// Responds with:
// the articles paginated according to the above inputs. ✅

// total_count property, displaying the total number of articles (this should display the total number of articles with any filters applied, discounting the limit).

// accepts multiple queries

// Consider what errors could occur with this endpoint, and make sure to test for them.

// error if query is not valid e.g. afas=asc

// Your previous test cases should not need amending.

// Remember to add a description of this endpoint to your /api endpoint.