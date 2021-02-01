//Vai buscar a informacao sobre o utilizador logado
let user_json = sessionStorage.getItem("user");
var user = JSON.parse(user_json);

let events_json = sessionStorage.getItem("events");
var events = JSON.parse(events_json);

var map;
var map2 = null;
var currectLocation;
var route = null;

window.onload = function () {

    //Se foi feito o login quer dizer que existe utilizador, por isso vai fazer desaparecer o botao de login e vai fazer aparecer o nome de utilizador
    if(user){
        document.getElementById("loginButton").style.display="none";
        document.getElementById("boxUser").style.display="flex";
        document.getElementById("username").innerHTML=user.user_nickname;
    }

    setupMap(); 

}

function setupMap() {
    map = L.map('mapa',{minZoom: 12}).setView(new L.LatLng(38.7476289, -9.1518309), 13);

    //Colocar geocoding no mapa
    let geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
      })
        .on('markgeocode', function(e) {
          
            var center = e.geocode.center;
            map.setView(center, 15); //Fazer zoom até ao local
          
        })
        .addTo(map);

    for (let event of events) {

        var markerIcon = L.icon({
            iconUrl: event.sport_image,
        
            iconSize:     [73, 80], // size of the icon
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        let location = "";

        //Se o evento nao tiver local definido então vai buscar o local ao club respetivo
        if (event.event_local == "") {
            location = event.club_local;

        }
        else {
            location = event.event_local;
        }

        //Vai buscar a latitude e a longitude do evento e vai colocar no marker
        var split_location = location.split("#");
    
        let marker = new L.marker(new L.LatLng(split_location[0], split_location[1]), {icon: markerIcon}).addTo(map);

        //Vai criar o popup de quando coloca o rato por cima do evento
        marker.bindPopup("<section class='popup'>"+
        "<h1>"+event.event_name+" - "+event.sport_name+"</h1>"+
        "<h3><b>Local: </b>"+event.club_name+"</h3>"+
        "<h3><b>Data: </b>"+event.event_date.substring(0,10)+" "+event.event_date.substring(11,16)+"</h3>"+
        "<h3><b>Participantes: </b>"+event.players.totalPlayers+"/"+event.event_max+"</h3>"+
        "<h5>Carregar para mais informação </h5>"+
        "</section>");

        //Quando passa o rato por cima do evento faz aparecer o popup
        marker.on('mouseover', function(){
            marker.openPopup();
          });

        //Quando tira o rato por cima do evento fecha o popup
        marker.on('mouseout', function(){
            marker.closePopup();
          });


          //Evento de quando clica num evento no mapa
        marker.on("click", function(){
            let modal = document.getElementById("myModal");
            modal.style.display = "block";

            document.getElementById("event-name").innerHTML = event.event_name;
            document.getElementById("sport").innerHTML = event.sport_name;
            document.getElementById("date").innerHTML = event.event_date.substring(0,10)+" "+event.event_date.substring(11,16);
            if(event.event_private) {
                document.getElementById("privacy").innerHTML = "<i class='fas fa-lock'></i>";
            }
            else {
                document.getElementById("privacy").innerHTML = "<i class='fas fa-lock-open'></i>";
            }
            document.getElementById("players").innerHTML = "";
            document.getElementById("descricao").innerHTML = event.event_description;

            document.getElementById("btn-div").innerHTML = "<button class='join-event-button' onclick='joinEvent("+event.event_id+")'>JOIN EVENT</button>";

            setupMapEvent(event);
        })

    }

    L.tileLayer('https://api.mapbox.com/styles/v1/pcmiguel/ckhsyjp813gxb19qq3eqydsmu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGNtaWd1ZWwiLCJhIjoiY2toc3lncG1zMGllajJxcGkxYnNjanVieCJ9.yfUra6VpwwsP4dGk9badRA', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

}

function closeModel() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function setupMapEvent(event) {

    if (map2 != null) { //se o mapa nao for null então vai remover o mapa para não dar o erro que o mapa já foi inicializado
        map2.remove();
    }

    map2 = L.map('map-event',{minZoom: 11}).setView(new L.LatLng(38.7476289, -9.1518309), 9);

    var markerIcon = L.icon({
        iconUrl: event.sport_image,
    
        iconSize:     [73, 80], // size of the icon
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    let location = "";

        //Se o evento nao tiver local definido então vai buscar o local ao club respetivo
        if (event.event_local == "") {
            location = event.club_local;

        }
        else {
            location = event.event_local;
        }

        //Vai buscar a latitude e a longitude do evento e vai colocar no marker
        var split_location = location.split("#");
        var lat = split_location[0];
        var lng = split_location[1];
    
        L.marker(new L.LatLng(lat, lng), {icon: markerIcon}).addTo(map2);

        //Saber o local do utilizador e colocar um marker no mapa
        map.locate({setView: false, maxZoom: 9});
        map.on('locationfound', function onLocationFound(e) {
            currectLocation = e.latlng;
            L.marker(e.latlng).addTo(map2);
            getRoute(lat, lng);
        });

        

    L.tileLayer('https://api.mapbox.com/styles/v1/pcmiguel/ckhsyjp813gxb19qq3eqydsmu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGNtaWd1ZWwiLCJhIjoiY2toc3lncG1zMGllajJxcGkxYnNjanVieCJ9.yfUra6VpwwsP4dGk9badRA', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map2);

}

//calcular rota entre a localizaçao do utilizador e do evento
function getRoute(event_lat, event_lng) {

    if (route != null) { //Vai remover a rota se nao for null para não ficar duplicado
        map2.removeControl(route);
    }

    let lat = currectLocation.lat;
    let lng = currectLocation.lng;

    route = L.Routing.control({
        waypoints: [
          L.latLng(lat, lng),
          L.latLng(event_lat, event_lng)
        ],
        waypointMode: 'snap',
        createMarker: function() {} //Remover Waypoints
      }).addTo(map2);

      document.getElementsByClassName("leaflet-control-container")[1].style.display = "None";
}

async function joinEvent(id) {

    let data = {
        user_id: user.user_id,
        event_id: id
    }

    try {

        let result = await $.ajax({
            url: "/api/events/attend",
            method: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json"
        });
        
        alert("A participar no evento com sucesso!");
        closeModel(); //Fechar Model
        
    } catch(err) {
        console.log(err);
    }

}