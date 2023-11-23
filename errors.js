exports.customError = (err, req, res, next) => {
    if (err.code === "23503" || err.code === "42703" || err.code === "22P02") {
        res.status(400).send({msg: "bad request"})
    }
    else if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}
exports.serverError = (err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"})
}

exports.invalidPath = (req, res) => {
    res.status(404).send({msg: "invalid path"})
}

//