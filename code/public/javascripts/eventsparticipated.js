//Vai buscar a informacao sobre o utilizador logado
let user_json = sessionStorage.getItem("user");
var user = JSON.parse(user_json);

window.onload = function () {

    //Se foi feito o login quer dizer que existe utilizador vai fazer aparecer o nome de utilizador
    if(user){
        document.getElementById("username").innerHTML=user.user_nickname;
    }

    loadEventsParticipated();

}

async function loadEventsParticipated() {

    try {

        let events = await $.ajax({
            url: "/api/users/"+user.user_id+"/participated",
            method: "get",
            dataType: "json"
        });

        let html = "<tr><th>NAME</th><th>SPORT</th><th>DATE</th><th>STATUS</th><th>PRIVACY</th><th>PLAYERS</th></tr>";
        for (let event of events) {
            html += "<tr>";
            html += "<td>"+event.event_name+"</td>";
            html += "<td>"+event.sport_name+"</td>";
            html += "<td>"+event.event_date+"</td>";
            html += "<td><span class='box-status'>looking for players</span></td>";
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
            //Vai mostrar uma mensagem se nao existir eventos participados
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