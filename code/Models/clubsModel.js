
var pool = require("./connection");

module.exports.getAllClubs = async function() { 
    try {
        const sql = "SELECT club_id AS id, club_name AS name, club_local AS local FROM clubs";
        const clubs = await pool.query(sql);
        return {status: 200, data: clubs};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
}

module.exports.getClub = async function(club_id) {
    try {
        let sql = "SELECT club_id AS id, club_name AS name, club_local AS local FROM clubs WHERE club_id = ?";
        let club = await pool.query(sql, [ club_id ]);
        return {status: 200, data: club[0]};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};