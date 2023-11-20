const { getAllEndpoints } = require("../models/api.models")

exports.getApi = (req, res) => {
    getAllEndpoints()
    .then(endpoints => {
        res.status(200).send({endpoints})
    })
}