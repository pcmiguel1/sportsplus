
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

//Eventos criados por um certo utilizador
module.exports.getUserEvents = async function(user_id) {
    try {
        let sql = "SELECT E.event_id, E.event_name, DATE_FORMAT(E.event_date, '%d-%m-%Y %H:%i') as event_date, E.event_min, E.event_max, E.event_private, S.sport_name FROM events E, sports S WHERE event_creator_id = ? and E.event_sport_id = S.sport_id";
        let events = await pool.query(sql, [ user_id ]);
        if(events.length > 0) {

            for (let event of events) {

                //Calcular para cada evento o número de jogadores que estão a participar
                sql = "SELECT COUNT(participant_event_id) AS totalPlayers FROM participants WHERE participant_event_id = ?";
                let count = await pool.query(sql, event.event_id);
                event.players = count[0];

                //Listar os jogadores que estao a participar no evento
                sql = "SELECT * FROM users U, participants P WHERE U.user_id = P.participant_event_id AND P.participant_event_id = ?";
                let players = await pool.query(sql, event.event_id);
                event.players.list = players;

            }

            return {status: 200, data: events}; 
        }
        else {
            return {status: 404, data: {msg: "Events not found!"}};
        }
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};

//Eventos que um certo utilizador está a participar
module.exports.getUserEventsAttend = async function(user_id) {
    try {
        let sql = "SELECT E.event_id, E.event_name, DATE_FORMAT(E.event_date, '%d-%m-%Y %H:%i') as event_date, E.event_min, E.event_max, E.event_private, S.sport_name FROM events E, sports S WHERE event_creator_id = ? AND E.event_sport_id = S.sport_id AND CURDATE() < E.event_date";
        let events = await pool.query(sql, [ user_id ]);
        if(events.length > 0) {

            for (let event of events) {

                //Calcular para cada evento o número de jogadores que estão a participar
                sql = "SELECT COUNT(participant_event_id) AS totalPlayers FROM participants WHERE participant_event_id = ?";
                let count = await pool.query(sql, event.event_id);
                event.players = count[0];

                //Listar os jogadores que estao a participar no evento
                sql = "SELECT * FROM users U, participants P WHERE U.user_id = P.participant_event_id AND P.participant_event_id = ?";
                let players = await pool.query(sql, event.event_id);
                event.players.list = players;

            }

            return {status: 200, data: events}; 
        }
        else {
            return {status: 404, data: {msg: "Events not found!"}};
        }
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};

//Eventos que um certo utilizador já participou
module.exports.getUserEventsParticipated = async function(user_id) {
    try {
        let sql = "SELECT E.event_id, E.event_name, DATE_FORMAT(E.event_date, '%d-%m-%Y %H:%i') as event_date, E.event_min, E.event_max, E.event_private, S.sport_name FROM events E, sports S WHERE event_creator_id = ? AND E.event_sport_id = S.sport_id AND CURDATE() > E.event_date";
        let events = await pool.query(sql, [ user_id ]);
        if(events.length > 0) {

            for (let event of events) {

                //Calcular para cada evento o número de jogadores que estão a participar
                sql = "SELECT COUNT(participant_event_id) AS totalPlayers FROM participants WHERE participant_event_id = ?";
                let count = await pool.query(sql, event.event_id);
                event.players = count[0];

                //Listar os jogadores que estao a participar no evento
                sql = "SELECT * FROM users U, participants P WHERE U.user_id = P.participant_event_id AND P.participant_event_id = ?";
                let players = await pool.query(sql, event.event_id);
                event.players.list = players;

            }

            return {status: 200, data: events}; 
        }
        else {
            return {status: 404, data: {msg: "Events not found!"}};
        }
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};