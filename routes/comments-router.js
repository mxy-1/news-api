const express = require("express")
const {deleteCommentById, patchVotesByCommentId} = require("../controllers/comments.controllers")
const commentsRouter = express.Router()

commentsRouter
    .route("/:comment_id")
    .delete(deleteCommentById)
    .patch(patchVotesByCommentId)

module.exports = commentsRouter