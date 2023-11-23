const { deleteComment } = require("../models/comments.models")

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params
    deleteComment(comment_id)
    .then(() => res.sendStatus(204))
    .catch(next)
}
