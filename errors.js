exports.serverError = (err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"})
}

exports.invalidPath = (req, res) => {
    res.status(404).send({msg: "invalid path"})
}