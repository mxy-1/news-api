const { checkExists } = require("../app-utils")
const { deleteComment, patchVotes } = require("../models/comments.models")

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params
    deleteComment(comment_id)
    .then(() => res.sendStatus(204))
    .catch(next)
}

exports.patchVotesByCommentId = (req, res, next) => {
    const {comment_id} = req.params
    const votes = req.body.inc_votes

    const votesPromise = [patchVotes(comment_id, votes), checkExists("comments", "comment_id", comment_id)]

    Promise.all(votesPromise)
    .then(resolvedPromise => {
        res.status(200).send({comment: resolvedPromise[0]})})
    .catch(next)
}