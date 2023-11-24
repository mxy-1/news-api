const { getAllUsers, getUserById } = require("../controllers/users.controllers")
const express = require("express")

const usersRouter = express.Router()

usersRouter
    .route("/")
    .get(getAllUsers)

usersRouter
    .route("/:username")
    .get(getUserById)


module.exports = usersRouter