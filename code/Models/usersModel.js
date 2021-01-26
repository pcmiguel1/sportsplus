
var pool = require("./connection");

module.exports.getUser = async function(filterObj) {
    try {

        if (filterObj !== undefined || filterObj !== null) {

            let sql = "";
            let filterValues = [];

            if (filterObj.user_nickname && !filterObj.user_id) {
                sql = "SELECT * FROM users WHERE user_nickname = ?";
                filterValues.push(filterObj.user_nickname);
            }

            if (filterObj.user_id && !filterObj.user_nickname) {
                sql = "SELECT * FROM users WHERE user_id = ?";
                filterValues.push(filterObj.user_id);
            }

            if (sql != "") {
                let user = await pool.query(sql, filterValues);
                if(user.length > 0) {
                    return {status: 200, data: user[0]}; 
                }
                else {
                    return {status: 404, data: {msg: "User not found!"}};
                }
            }  
            else {
                return {status: 404, data: {msg: "User not found!"}};
            }

        }

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
        if(result.length > 0) {
            return {status: 200, data: result}; 
        }
        else {
            return {status: 404, data: {msg: "Events not found!"}};
        }
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};