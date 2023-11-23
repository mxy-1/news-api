const {getAllUsers} = require("../controllers/users.controllers")
const express = require("express")

const usersRouter = express.Router()

usersRouter 
    .route("/")
    .get(getAllUsers)


module.exports = usersRouter