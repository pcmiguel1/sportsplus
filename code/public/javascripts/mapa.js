let events_json = sessionStorage.getItem("events");
var events = JSON.parse(events_json);

var map;

window.onload = function () {

    setupMap(); 

}

//Get current location and put a marker
function onLocationFound(e) {

    L.marker(e.latlng).addTo(map);
}

async function setupMap() {
    map = L.map('mapa',{minZoom: 12}).setView(new L.LatLng(38.7476289, -9.1518309), 13);

    map.locate({setView: true, maxZoom: 16});
    map.on('locationfound', onLocationFound);

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

        marker.bindPopup("<section class='popup'>"+
        "<h1>"+event.event_name+" - "+event.sport_name+"</h1>"+
        "<h3><b>Local: </b>"+event.club_name+"</h3>"+
        "<h3><b>Data: </b>"+event.event_date.substring(0,10)+" "+event.event_date.substring(11,16)+"</h3>"+
        "<h3><b>Participantes: </b>2/4</h3>"+
        "<h5>Carregar para mais informação </h5>"+
        "</section>");

        marker.on('mouseover', function(){
            marker.openPopup();
          });

        marker.on('mouseout', function(){
            marker.closePopup();
          });

        marker.on("click", function(){
            let modal = document.getElementById("myModal");
            modal.style.display = "block";

            /*document.getElementById("event-name").innerHTML = event.event_name;
            document.getElementById("sport").innerHTML = event.sport_name;
            document.getElementById("date").innerHTML = event.event_date.substring(0,10)+" "+event.event_date.substring(11,16);
            document.getElementById("privacy").innerHTML = "";
            document.getElementById("players").innerHTML = "";
            document.getElementById("descricao").innerHTML = event.event_description;*/

            setupMapEvent();
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

function setupMapEvent() {
    let map2 = L.map('map-event',{minZoom: 12}).setView(new L.LatLng(38.7476289, -9.1518309), 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/pcmiguel/ckhsyjp813gxb19qq3eqydsmu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGNtaWd1ZWwiLCJhIjoiY2toc3lncG1zMGllajJxcGkxYnNjanVieCJ9.yfUra6VpwwsP4dGk9badRA', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map2);

}