
var pool = require("./connection");

module.exports.getAllSports = async function() { 
    try {
        const sql = "SELECT sport_id AS id, sport_name AS name, sport_image AS image FROM sports";
        const sports = await pool.query(sql);
        if(sports.length > 0) {
            return {status: 200, data: sports}; 
        }
        else {
            return {status: 404, data: {msg: "Sports not found!"}};
        }
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
}

module.exports.getSport = async function(sport_id) {
    try {
        let sql = "SELECT sport_id AS id, sport_name AS name, sport_image AS image FROM sports WHERE sport_id = ?";
        let sport = await pool.query(sql, [ sport_id ]);
        if(sport.length > 0) {
            return {status: 200, data: sport[0]}; 
        }
        else {
            return {status: 404, data: {msg: "Sport not found!"}};
        }
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};