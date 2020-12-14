
let events_json = sessionStorage.getItem("events");
var events = JSON.parse(events_json);

window.onload = function () {

    setupMap(); 

}

async function setupMap() {
    var map = L.map('mapa',{minZoom: 12}).setView(new L.LatLng(38.7476289, -9.1518309), 13);

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
    
        L.marker(new L.LatLng(split_location[0], split_location[1]), {icon: markerIcon}).addTo(map);

    }

    L.tileLayer('https://api.mapbox.com/styles/v1/pcmiguel/ckhsyjp813gxb19qq3eqydsmu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGNtaWd1ZWwiLCJhIjoiY2toc3lncG1zMGllajJxcGkxYnNjanVieCJ9.yfUra6VpwwsP4dGk9badRA', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

}