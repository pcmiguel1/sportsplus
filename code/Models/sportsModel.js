
var pool = require("./connection");

module.exports.getAllSports = async function() { 
    try {
        const sql = "SELECT sport_id AS id, sport_name AS name FROM sports";
        const sports = await pool.query(sql);
        return sports;
    } catch (err) {
        console.log(err);
        return err;
    } 
}

module.exports.getSport = async function(sport_id) {
    try {
        let sql = "SELECT sport_id AS id, sport_name AS name FROM sports WHERE sport_id = ?";
        let sport = await pool.query(sql, [ sport_id ]);
        return sport;
    } catch (err) {
        console.log(err);
        return err;
    } 
};