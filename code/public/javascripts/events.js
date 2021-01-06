//Vai buscar a informacao sobre o utilizador logado
let user_json = sessionStorage.getItem("user");
var user = JSON.parse(user_json);

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

        if (events.length <= 0) { // se nao tiver nenhum evento criado

            //Vai mostrar uma mensagem
            document.getElementById("error").style.display="flex";
            document.getElementById("table-my-events").style.display="none";
            document.getElementById("error").innerHTML = "No events created by you!";

        }
        else {
            let html = "<tr><th>NAME</th><th>SPORT</th><th>DATE</th><th>STATUS</th><th>PRIVACY</th><th>PLAYERS</th><th></th></tr>";
            for (let event of events) {
                html += "<tr>";
                html += "<td>"+event.event_name+"</td>";
                html += "<td>"+event.sport_name+"</td>";
                html += "<td>"+event.event_date+"</td>";
                html += "<td><span class='box-status'>looking for players</span></td>";
                if (event.event_privacy) { //Se for true
                    html += "<td><i class='fas fa-unlock'></i></td>";
                }
                else {
                    html += "<td><i class='fas fa-lock'></i></td>";
                }
                html += "<td>"+event.event_min + "/" + event.event_max +"</td>";
                html += "<td><a class='btn-edit'><i class='fas fa-pen'></i></a><a class='btn-delete'><i class='fas fa-trash'></i></a></td>"

            }
            document.getElementById("table-my-events").innerHTML = html;
        }

    } catch(err) {
        console.log(err);
    }

}

function logout() {
    if (user) {
        sessionStorage.clear();
        window.location = "index.html";
    }
}