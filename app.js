const { serverError, invalidPath, customError, psqlError } = require("./errors")
const articlesRouter = require("./routes/articles-router")
const commentsRouter = require("./routes/comments-router")
const usersRouter = require("./routes/users-router")
const topicsRouter = require("./routes/topics-router")
const apiRouter = require("./routes/api-router")
const express = require("express")

const app = express()
const cors = require('cors');

app.use(cors())
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
