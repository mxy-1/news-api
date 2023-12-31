const db = require("../db/connection")

exports.deleteComment = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
   `, [id])
   .then(({rows}) => {
    if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } 
   })
}

exports.patchVotes = (id, votes) => {
  return db.query(`
  UPDATE comments
  SET
  votes = ${votes} + votes
  WHERE comment_id = $1
  RETURNING *`, [id])
  .then(({rows}) => rows[0])
}