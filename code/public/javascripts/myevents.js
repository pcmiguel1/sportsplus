//Vai buscar a informacao sobre o utilizador logado
let user_json = sessionStorage.getItem("user");
var user = JSON.parse(user_json);

var id;

window.onload = function () {

    //Se foi feito o login quer dizer que existe utilizador vai fazer aparecer o nome de utilizador
    if(user){
        document.getElementById("username").innerHTML=user.user_nickname;
    }

    loadMyEvents();

}

async function loadMyEvents() {

    try {

        let events = await $.ajax({
            url: "/api/users/"+user.user_id+"/events",
            method: "get",
            dataType: "json"
        });

        let html = "<tr><th>NAME</th><th>SPORT</th><th>DATE</th><th>STATUS</th><th>PRIVACY</th><th>PLAYERS</th><th></th></tr>";
        for (let event of events) {
            html += "<tr>";
            html += "<td>"+event.event_name+"</td>";
            html += "<td>"+event.sport_name+"</td>";
            html += "<td>"+event.event_date+"</td>";
            html += statusEvento(event);
            if (event.event_private) { //Se for privado
                html += "<td><i class='fas fa-lock'></i></td>";
            }
            else {
                html += "<td><i class='fas fa-unlock'></i></td>";
            }
            html += "<td>"+event.players.totalPlayers + "/" + event.event_max +"</td>";
            html += "<td><a class='btn-edit' onclick='editEvent("+event.event_id+");'><i class='fas fa-pen'></i></a><a class='btn-delete' onclick='deleteEvent("+event.event_id+");'><i class='fas fa-trash'></i></a></td>"

        }
        document.getElementById("table-my-events").innerHTML = html;

    } catch(err) {
        console.log(err);
        if (err.status == 404) {
            //Vai mostrar uma mensagem se nao existir eventos criados pelo utilizador
            document.getElementById("error").style.display="flex";
            document.getElementById("table-my-events").style.display="none";
            document.getElementById("error").innerHTML = err.responseJSON.msg;
        }
    }

}

//Delete event from myEvents table
async function deleteEvent(event_id) {
    try {
        let event = await $.ajax({
            url: "/api/events/"+event_id,
            method: "delete",
            dataType: "json"
        });

    } catch(err) {
        console.log(err);
    }

    alert("event successfully deleted!");
    window.location = "myevents.html";
}

function logout() {
    if (user) {
        sessionStorage.clear();
        window.location = "index.html";
    }
}

function closeModel() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";

    document.getElementById("box-whitelist").style.display = "none";
}

async function editEvent(event_id) {

    id = event_id;

    try {

        let event = await $.ajax({
            url: "/api/events/"+event_id,
            method: "get",
            dataType: "json"
        });

        //se o evento foi privado então vai fazer aparecer o input para adicionar jogadores na whitelist
        if (event.event_private) { 
            document.getElementById("box-whitelist").style.display = "flex";
        }

        //Vai carregar a informacao do evento
        document.getElementById("event_name").value = event.event_name;
        document.getElementById("event_desc").value = event.event_description;
        document.getElementById("event_date").value = event.event_date.substring(0, 10);
        document.getElementById("event_time").value = event.event_date.substring(11, 16);
        document.getElementById("event_privacy").value = event.event_private;
        document.getElementById("event_min").value = event.event_min;
        document.getElementById("event_max").value = event.event_max;
        document.getElementById("event_duration").value = event.event_duration;

        //Criar botão que tem onclick com o id do evento
        document.getElementById("btn-update").innerHTML = "<button class='btn-add-event' onclick='updateEvent("+event.event_id+");'>Update</button>";


    } catch(err) {
        console.log(err);
        if (err.status == 404) {
            //Vai mostrar uma mensagem se nao existir o evento
            alert(err.responseJSON.msg);
        }
    }

    //Vai abrir o modal
    let modal = document.getElementById("myModal");
    modal.style.display = "block";

}

async function updateEvent(id) {

    let name = document.getElementById("event_name").value;
    let desc = document.getElementById("event_desc").value;
    let date = document.getElementById("event_date").value;
    let time = document.getElementById("event_time").value;
    let private = document.getElementById("event_privacy").value;
    let min = document.getElementById("event_min").value;
    let max = document.getElementById("event_max").value;
    let duration = document.getElementById("event_duration").value;

    if (name != "" || desc != "" || date != "" || time != "" || private != "" || min != "" || max != "" || duration != "") {

        let data = {
            event_id: id,
            event_name: name,
            event_desc: desc,
            event_date: date,
            event_time: time,
            event_private: private,
            event_min: min,
            event_max: max,
            event_duration: duration
        }
    
        try {
    
            let result = await $.ajax({
                url: "/api/events",
                method: "put",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json"
            });

            alert("Event information updated successfully!");
            window.location = "myevents.html";
    
            
        } catch(err) {
            console.log(err);
        }

    }

}

async function addUserWhitelist() {

    let nick = document.getElementById("player_name").value;

    if (nick != "") {

        let data = {
            nickname: nick,
            event_id: id
        }

        try {
    
            let result = await $.ajax({
                url: "/api/events/adduserwhitelist",
                method: "post",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json"
            });

            alert("User successfully added!");
            window.location = "myevents.html";
    
            
        } catch(err) {
            console.log(err);
            if (err.status == 404) {
                alert(err.responseJSON.msg);
            }
        }

    }
    else {
        alert("Fill in the field above!");
    }

}

function statusEvento(event) {

    let min = event.event_min;
    let max = event.event_max;
    let total = event.players.totalPlayers;

    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    let date = event.event_date.substring(0,10);
    let d = date.substring(0,2);
    let m = date.substring(3,5)
    let y = date.substring(6,10);
    let fdate = y + "-" + m + "-" + d;

    let date2 = new Date(fdate);
    date2.setHours(0,0,0,0);
    let html = "";

    if (total < max && currentDate < date2) {
        html = "<td><span class='box-status'>looking for players</span></td>";
    }
    else if ((total < min && currentDate >= date2) || (total == max && currentDate >= date2)) {
        html = "<td><span class='box-status box-status-canceled'>Canceled</span></td>";
    }
    else if (total == max) {
        html = "<td><span class='box-status box-status-complete'>Complete</span></td>";
    }
    return html;

}