let user_json = sessionStorage.getItem("user");
var user = JSON.parse(user_json);

window.onload = function() {

    //Se foi feito o login quer dizer que existe utilizador, por isso vai fazer desaparecer o botao de login e vai fazer aparecer o nome de utilizador
    if(user){
        document.getElementById("username1").innerHTML=user.user_nickname;
    }
}