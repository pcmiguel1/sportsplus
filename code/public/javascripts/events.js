//Vai buscar a informacao sobre o utilizador logado
let user_json = sessionStorage.getItem("user");
var user = JSON.parse(user_json);

window.onload = function () {

    //Se foi feito o login quer dizer que existe utilizador vai fazer aparecer o nome de utilizador
    if(user){
        document.getElementById("username").innerHTML=user.user_nickname;
    }

}

function logout() {
    if (user) {
        sessionStorage.clear();
        window.location = "index.html";
    }
}