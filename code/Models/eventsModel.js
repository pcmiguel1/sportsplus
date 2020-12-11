
var pool = require("./connection");

module.exports.getAllEvents = async function() { 
    try {
        const sql = "SELECT * FROM events";
        const events = await pool.query(sql);
        return {status: 200, data: events};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
}

module.exports.getEvent = async function(event_id) {
    try {
        let sql = "SELECT * FROM events WHERE event_id = ?";
        let event = await pool.query(sql, [ event_id ]);
        return {status: 200, data: event[0]};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};