const fs = require("fs/promises")

exports.getAllEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((endpoints) => {
        return JSON.parse(endpoints)
    })
}