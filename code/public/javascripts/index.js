window.onload = async function() {

    //Carregar sports

    try {

        let sports = await $.ajax({
            url: "/api/sports",
            method: "get",
            dataType: "json"
        });

        let aux = "";
        aux += "<option selected value='0'>All Sports</option>";
        for (let sport of sports) {
            aux += "<option value='"+ sport.id +"'>" + sport.name + "</option>";
        }
        document.getElementById("sport").innerHTML = aux;

    } catch(err) {
        console.log(err);
    }
    try {

        let clubs = await $.ajax({
            url: "/api/clubs",
            method: "get",
            dataType: "json"
        });

        let aux = "";
        aux += "<option selected value='0'>All Clubs</option>";
        for (let club of clubs) {
            aux += "<option value='"+ club.id +"'>" + club.name + "</option>";
        }
        document.getElementById("club").innerHTML = aux;

    } catch(err) {
        console.log(err);
    }

}

