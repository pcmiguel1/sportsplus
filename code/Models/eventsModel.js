
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
        let sql = "SELECT E.event_id, E.event_name, E.event_sport_id, E.event_description, DATE_FORMAT(E.event_date, '%d-%m-%y %H:%i') AS 'event_date', E.event_local, E.event_duration, E.event_max, E.event_min, E.event_private, E.event_creator_id, DATE_FORMAT(E.event_creation_date, '%d-%m-%y %H:%i') AS 'event_creation_date', E.event_club_id, S.sport_name, S.sport_image, C.club_name, C.club_local FROM events E LEFT OUTER JOIN sports S ON E.event_sport_id = S.sport_id LEFT OUTER JOIN clubs C ON E.event_club_id = C.club_id WHERE E.event_sport_id = S.sport_id" + filterQueries;
        let events = await pool.query(sql, filterValues);
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
}

module.exports.getEvent = async function(event_id) {
    try {
        let sql = "SELECT E.event_id, E.event_name, E.event_sport_id, E.event_description, DATE_FORMAT(E.event_date, '%Y-%m-%d %H:%i') AS 'event_date', E.event_local, E.event_duration, E.event_max, E.event_min, E.event_private, E.event_creator_id, DATE_FORMAT(E.event_creation_date, '%d-%m-%y %H:%i') AS 'event_creation_date', E.event_club_id FROM events E WHERE event_id = ?";
        let event = await pool.query(sql, [ event_id ]);
        if (event.length > 0) {
            return {status: 200, data: event[0]};
        }
        else {
            return {status: 404, data: {msg: "Events not found!"}};
        }
        
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};

module.exports.deleteEvent = async function(event_id) {
    try {
        
        let sql = "DELETE FROM participants WHERE participant_event_id = ?";
        let event = await pool.query(sql, [ event_id ]);

        sql = "DELETE FROM events WHERE event_id = ?";
        event = await pool.query(sql, [ event_id ]);

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
        
        let event_id = result.insertId;

        //Colocar o criador do evento como participante também
        sql = "INSERT INTO participants(participant_user_id, participant_event_id) VALUES (?,?)";
        result = await pool.query(sql, [event.creator_id, event_id]);
        
        return {status: 200, data: result};
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};

module.exports.addUserWhitelist = async function(obj) {
    try {
        
        //Verificar se o utilizador existe
        let sql = "SELECT * FROM users WHERE user_nickname = ?";
        let result = await pool.query(sql, [ obj.nickname ]);


        if (result.length > 0) { //se existir

            let id = result[0].user_id;

            //Verifica se o utilizador está na whitelist desse evento
            sql = "SELECT * FROM whitelist WHERE whitelist_user_id = ? AND whitelist_event_id = ?"
            result = await pool.query(sql, [ id, obj.event_id ]);

            if (result.length > 0) { //Se o utilizado estiver na whitelist 
                return {status: 404, data: {msg: "This user is already on the whitelist!"}};
            }
            else { //Se nao estiver na whitelist

                //Vai adicionar na whitelist
                sql = "INSERT INTO whitelist(whitelist_user_id, whitelist_event_id) VALUES (?,?)";
                result = await pool.query(sql, [id, obj.event_id]);
                return {status: 200, data: result};

            }
            
        } else { // Se o utilizador nao existir
            return {status: 404, data: {msg: "This user does not exist!"}};
        }
        
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};

module.exports.updateEvent = async function(filterObj) {
    try {

        let filterQueries = "";
        let filterValues = [];

        if (filterObj.event_name) {
            filterQueries += "event_name = ?,";
            filterValues.push(filterObj.event_name);
        }
        if (filterObj.event_desc) {
            filterQueries += "event_description = ?,";
            filterValues.push(filterObj.event_desc);
        }
        if (filterObj.event_date && filterObj.event_time) {
            filterQueries += "event_date = ?,";
            filterValues.push(filterObj.event_date + " " + filterObj.event_time);
        }
        if (filterObj.event_private) {
            filterQueries += "event_private = ?,";
            filterValues.push(filterObj.event_private);
        }
        if (filterObj.event_min) {
            filterQueries += "event_min = ?,";
            filterValues.push(filterObj.event_min);
        }
        if (filterObj.event_max) {
            filterQueries += "event_max = ?,";
            filterValues.push(filterObj.event_max);
        }
        if (filterObj.event_duration) {
            filterQueries += "event_duration = ?,";
            filterValues.push(filterObj.event_duration);
        }

        filterValues.push(filterObj.event_id);
        
        let sql = "UPDATE events SET " + filterQueries.slice(0, -1) + " WHERE event_id = ?";
        let events = await pool.query(sql, filterValues);
        return {status: 200, data: events}; 
    
    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    } 
};