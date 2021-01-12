
var pool = require("./connection");

module.exports.getAllEvents = async function(filterObj) { 
    try {

        let filterQueries = "";
        let filterValues = [];

        if (filterObj.sportId && filterObj.sportId != "all") {
            filterQueries += " AND event_sport_id = ?";
            filterValues.push(filterObj.sportId);
        }

        if (filterObj.clubId && filterObj.clubId != "all") {
            filterQueries += " AND event_club_id = ?";
            filterValues.push(filterObj.clubId);
        }

        if (filterObj.date) {
            filterQueries += " AND DATE(event_date) = ?";
            filterValues.push(filterObj.date.substring(0,10)); //substring para mostrar so a parte da data e nao a hora
        }
        sql = "SELECT * FROM events E LEFT OUTER JOIN sports S ON E.event_sport_id = S.sport_id LEFT OUTER JOIN clubs C ON E.event_club_id = C.club_id WHERE E.event_sport_id = S.sport_id" + filterQueries;
        let events = await pool.query(sql, filterValues);
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

module.exports.deleteEvent = async function(event_id) {
    try {
        let sql = "DELETE FROM events WHERE event_id = ?";
        let event = await pool.query(sql, [ event_id ]);
        return {status: 200, data: event[0]};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};

module.exports.createEvent = async function(event) {
    try {

        let sql = "INSERT INTO events(event_name, event_sport_id, event_description, event_date, event_local, event_duration, event_max, event_min, event_private, event_creator_id, event_club_id) " + "VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        let result = await pool.query(sql, [ event.name, event.sport, event.desc, event.date, event.location, event.duration, event.max, event.min, event.private, event.creator_id, event.club ]);
        return {status: 200, data: result};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};