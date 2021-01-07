//Vai buscar a informacao sobre o utilizador logado
let user_json = sessionStorage.getItem("user");
var user = JSON.parse(user_json);


var event_location = ""; //Vai guardar o lat e long do evento
var marker;

window.onload = function () {

    //Se foi feito o login quer dizer que existe utilizador vai fazer aparecer o nome de utilizador
    if(user){
        document.getElementById("username").innerHTML=user.user_nickname;
    }

    setupMap(); 
    loadSports();
    loadClubs();

}

async function loadClubs() {

    try {

        let clubs = await $.ajax({
            url: "/api/clubs",
            method: "get",
            dataType: "json"
        });

        let aux = "";
        aux += "<option value='0'>No Club</option>";
        for (let club of clubs) {
            aux += "<option value='"+ club.id +"'>" + club.name + "</option>";
        }
        document.getElementById("club").innerHTML = aux;

    } catch(err) {
        console.log(err);
    }

}

async function loadSports() {

    try {

        let sports = await $.ajax({
            url: "/api/sports",
            method: "get",
            dataType: "json"
        });

        let aux = "";
        for (let sport of sports) {
            aux += "<option value='"+ sport.id +"'>" + sport.name + "</option>";
        }
        document.getElementById("sport").innerHTML = aux;

    } catch(err) {
        console.log(err);
    }

}

async function setupMap() {
    var map = L.map('map',{minZoom: 12}).setView(new L.LatLng(38.7476289, -9.1518309), 12);

    marker = new L.LayerGroup().addTo(map);
    map.on('click', function(e) { //Quando clica no mapa cria um market no local selecionado
        marker.clearLayers();
        var markerIcon = L.icon({
            iconUrl:'./images/marker.png',
            iconSize:     [73, 80], // size of the icon
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        L.marker(new L.LatLng(e.latlng.lat, e.latlng.lng), {icon: markerIcon}).addTo(marker);
        event_location = e.latlng.lat + "#" + e.latlng.lng;
    });


    L.tileLayer('https://api.mapbox.com/styles/v1/pcmiguel/ckhsyjp813gxb19qq3eqydsmu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGNtaWd1ZWwiLCJhIjoiY2toc3lncG1zMGllajJxcGkxYnNjanVieCJ9.yfUra6VpwwsP4dGk9badRA', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

}

async function addMarkerMap() {

    let club_id = document.getElementById("club").value;

    if (club_id != 0) { // Se nao selecionou "No Club"

        try {

            let club = await $.ajax({
                url: "/api/clubs/"+club_id,
                method: "get",
                dataType: "json"
            });
    
            let local = club.local.split("#");           

            var markerIcon = L.icon({
                iconUrl:'./images/marker.png',
                iconSize:     [73, 80], // size of the icon
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            marker.clearLayers();
            L.marker(new L.LatLng(local[0], local[1]), {icon: markerIcon}).addTo(marker);
            event_location = club.local;
    
        } catch(err) {
            console.log(err);
        }

    } else {
        marker.clearLayers();
    }

}

async function createEventSubmit() {

    let correct = true;

    if (!verifyEmptyInputs()) correct = false;
    if (!verifyLocation()) correct = false;
    if (!correct) return;


    let event_name = document.getElementById("event_name").value;
    let event_desc = document.getElementById("event_desc").value;
    let event_sport = document.getElementById("sport").value;
    let event_club = document.getElementById("club").value;
    let event_date = document.getElementById("event_date").value;
    let event_time = document.getElementById("event_time").value;
    let event_privacy = document.getElementById("event_privacy").value;
    let event_min = document.getElementById("event_min").value;
    let event_max = document.getElementById("event_max").value;
    let event_duration = document.getElementById("event_duration").value;

    let box = document.getElementById("box-info");

    let d = event_date + " " + event_time+":00";

    if (event_club == 0) event_club = null; //Se nao selecionou um club então vai passar para null, para nao dar erro na base de dados  

    let data = {
        name: event_name,
        desc: event_desc,
        sport: event_sport,
        club: event_club,
        date: d,
        private: event_privacy,
        min: event_min,
        max: event_max,
        duration: event_duration,
        location: event_location,
        creator_id: user.user_id
    }

    try {

        let result = await $.ajax({
            url: "/api/events",
            method: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json"
        });
        box.style.display = "block";
        box.style.backgroundColor = "#a8e063";
        box.innerHTML = "Successfully created event <i class='fas fa-check'></i>";

        window.location = "addevent.html";
        
    } catch(err) {
        console.log(err);
        if (err.responseJSON) {
            box.style.display = "block";
            box.style.backgroundColor = "#ED213A";
            box.innerHTML = err.responseJSON.msg + " <i class='fas fa-exclamation-triangle'></i>";
        } else {
            box.style.display = "block";
            box.style.backgroundColor = "#ED213A";
            box.innerHTML = "It was not possible to create the event <i class='fas fa-exclamation-triangle'></i>";
        }
    }

}

function verifyEmptyInputs() {
    let event_name = document.getElementById("event_name").value;
    let event_date = document.getElementById("event_date").value;
    let event_time = document.getElementById("event_time").value;
    let event_min = document.getElementById("event_min").value;
    let event_max = document.getElementById("event_max").value;
    let event_duration = document.getElementById("event_duration").value;

    let box = document.getElementById("box-info");
    if (event_name == "" || event_date == "" || event_min == "" || event_max == "" || event_duration == "" || event_time == "") {
        box.style.display = "block";
        box.style.backgroundColor = "#ED213A";
        box.innerHTML = "Fill in all the spaces above <i class='fas fa-exclamation-triangle'></i>";
        return false;
    }
    return true;
}

function verifyLocation() {
    let box = document.getElementById("box-info");
    if (!event_location) {
        box.style.display = "block";
        box.style.backgroundColor = "#ED213A";
        box.innerHTML = "Select the event location on the map <i class='fas fa-exclamation-triangle'></i>";
        return false;
    }
    return true;
}