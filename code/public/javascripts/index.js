window.onload = async function() {

    //Carregar sports

    try {

        let sports = await $.ajax({
            url: "/api/sports",
            method: "get",
            dataType: "json"
        });

        let aux = "";
        aux += "<option selected value='all'>All Sports</option>";
        for (let sport of sports) {
            aux += "<option value='"+ sport.id +"'>" + sport.name + "</option>";
        }
        document.getElementById("sport").innerHTML = aux;

    } catch(err) {
        console.log(err);
    }

    //Carregar clubs

    try {

        let clubs = await $.ajax({
            url: "/api/clubs",
            method: "get",
            dataType: "json"
        });

        let aux = "";
        aux += "<option selected value='all'>All Clubs</option>";
        for (let club of clubs) {
            aux += "<option value='"+ club.id +"'>" + club.name + "</option>";
        }
        document.getElementById("club").innerHTML = aux;

    } catch(err) {
        console.log(err);
    }

}

async function findEvent(){
    let sportID=document.getElementById("sport").value;
    let clubID=document.getElementById("club").value;
    let date=document.getElementById("date").value;

    try {

        let events = await $.ajax({
            url: "/api/events?sportId="+sportID+"&clubId="+clubID+"&date="+date,
            method: "get",
            dataType: "json"
        });

        if (events.length > 0) { //Se tiver algum evento na lista
            let events_json = JSON.stringify(events); //converting list to json
            sessionStorage.setItem("events", events_json); //saving events on Web Storage
            window.location = "mapa.html"; //changing to the mapa page
        }
        else { //se o tamanho for 0, então vai mostrar um erro
            document.getElementById("error").innerHTML = "No Events found!";
        }


    } catch(err) {
        console.log(err);
    }
}

