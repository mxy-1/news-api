const { selectAllUsers } = require("../models/users.models")

exports.getAllUsers = (req, res) => {
    selectAllUsers()
    .then(users => res.status(200).send({users}))
}