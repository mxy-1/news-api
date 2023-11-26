const { selectAllTopics, postTopicModel } = require("../models/topics.models")

exports.getAllTopics = (req, res) => {
    selectAllTopics()
    .then(topics => {
        res.status(200).send({topics})
    })
}

exports.postTopic = (req, res, next) => {
    const {slug, description} = req.body
    
    if (typeof slug !== "string" || typeof description !== "string" || Object.keys(req.body).length > 2) {
        res.status(400).send({msg: "bad request"})
    }

    postTopicModel(slug, description)
    .then(topic => {
        res.status(201).send({topic})
    })
    .catch(next)
}

