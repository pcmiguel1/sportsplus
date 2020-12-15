
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