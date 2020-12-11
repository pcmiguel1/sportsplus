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
    let sportsID=document.getElementById("sport").value;
    let clubsID=document.getElementById("club").value;
    let date=document.getElementById("date").value;
    let filterEvents=[];

    try {

        let events = await $.ajax({
            url: "/api/events",
            method: "get",
            dataType: "json"
        });

        for(let event of events){
            if(sportsID=="all" && clubsID=="all" && date==""){
                filterEvents.push(event);
            }
            else if(sportsID=="all" && event.event_club_id==clubsID && date==""){
                filterEvents.push(event);
            }
            else if(sportsID=="all" && clubsID=="all" && event.event_date==date){
                filterEvents.push(event);
            }
            else if(sportsID=="all" && event.event_club_id==clubsID && event.event_date==date){
                filterEvents.push(event);
            }
            else if(event.event_sport_id==sportsID && clubsID=="all" && date==""){
                filterEvents.push(event);
            }
            else if(event.event_sport_id==sportsID && event.event_club_id==clubsID && event.event_date==date){
                filterEvents.push(event);
            }
            else if(event.event_sport_id==sportsID && event.event_club_id==clubsID && date==""){
                filterEvents.push(event);
            }
            else if(event.event_sport_id==sportsID && clubsID=="all" && event.event_date==date){
                filterEvents.push(event);
            }
        }
        console.log(filterEvents);
        console.log(date);
    } catch(err) {
        console.log(err);
    }
}

