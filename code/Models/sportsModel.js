
var pool = require("./connection");

module.exports.getAllSports = async function() { 
    try {
        const sql = "SELECT sport_id AS id, sport_name AS name FROM sports";
        const sports = await pool.query(sql);
        return {status: 200, data: sports};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
}

module.exports.getSport = async function(sport_id) {
    try {
        let sql = "SELECT sport_id AS id, sport_name AS name FROM sports WHERE sport_id = ?";
        let sport = await pool.query(sql, [ sport_id ]);
        return {status: 200, data: sport[0]};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};