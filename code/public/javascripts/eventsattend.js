//Vai buscar a informacao sobre o utilizador logado
let user_json = sessionStorage.getItem("user");
var user = JSON.parse(user_json);

window.onload = function () {

    //Se foi feito o login quer dizer que existe utilizador vai fazer aparecer o nome de utilizador
    if(user){
        document.getElementById("username").innerHTML=user.user_nickname;
    }

    loadEventsAttend();

}

async function loadEventsAttend() {

    try {

        let events = await $.ajax({
            url: "/api/users/"+user.user_id+"/attend",
            method: "get",
            dataType: "json"
        });

        let html = "<tr><th>NAME</th><th>SPORT</th><th>DATE</th><th>STATUS</th><th>PRIVACY</th><th>PLAYERS</th></tr>";
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

        }
        document.getElementById("table-my-events").innerHTML = html;

    } catch(err) {
        console.log(err);
        if (err.status == 404) {
            //Vai mostrar uma mensagem se nao exitir eventos a participar
            document.getElementById("error").style.display="flex";
            document.getElementById("table-my-events").style.display="none";
            document.getElementById("error").innerHTML = err.responseJSON.msg;
        }
    }

}

function logout() {
    if (user) {
        sessionStorage.clear();
        window.location = "index.html";
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