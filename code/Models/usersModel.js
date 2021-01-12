
var pool = require("./connection");

module.exports.getAllUsers = async function() { 
    try {
        const sql = "SELECT * FROM users";
        const users = await pool.query(sql);
        return {status: 200, data: users};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
}

module.exports.getUser = async function(user_id) {
    try {
        let sql = "SELECT * FROM users WHERE user_id = ?";
        let user = await pool.query(sql, [ user_id ]);
        return {status: 200, data: user[0]};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};

module.exports.createUser = async function(user) {
    try {

        let sql = "INSERT INTO users(user_name, user_nickname, user_gender, user_birthday, user_email) " + "VALUES (?,?,?,?,?)";
        let result = await pool.query(sql, [ user.user_name, user.user_nickname, user.user_gender, user.user_birthday, user.user_email ]);
        return {status: 200, data: result};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};

module.exports.getUserEvents = async function(user_id) {
    try {
        let sql = "SELECT E.event_id, E.event_name, DATE_FORMAT(E.event_date, '%d-%m-%Y %H:%i') as event_date, E.event_min, E.event_max, E.event_private, S.sport_name FROM events E, sports S WHERE event_creator_id = ? and E.event_sport_id = S.sport_id";
        let result = await pool.query(sql, [ user_id ]);
        return {status: 200, data: result };
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};