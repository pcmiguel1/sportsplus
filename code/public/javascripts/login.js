
function selectorRegister() {

    document.getElementById("selectorRegister").classList.add("selector-active");
    document.getElementById("selectorLogin").classList.remove("selector-active"); 

    document.getElementById("sectionRegister").classList.remove("section-disable");
    document.getElementById("sectionLogin").classList.add("section-disable"); 

}

function selectorLogin() {

    document.getElementById("selectorLogin").classList.add("selector-active");
    document.getElementById("selectorRegister").classList.remove("selector-active"); 

    document.getElementById("sectionLogin").classList.remove("section-disable");
    document.getElementById("sectionRegister").classList.add("section-disable"); 

}

async function loginButton(){
    let loginText=document.getElementById("username").value;
    let userCheck=false;
    if(loginText != ""){
        try {

            let users = await $.ajax({
                url: "/api/users",
                method: "get",
                dataType: "json"
            });
            for(let user of users){
                if(user.user_nickname==loginText){
                    userCheck=true;
                    let user_json = JSON.stringify(user);
                    sessionStorage.setItem("user", user_json); //Vai guardar na sessionStorage a informacao do utilizador
                    window.location="index.html";
                }
            }
            if(!userCheck){
                document.getElementById("error").innerHTML = "User not found!";
            }
        } catch(err) {
            console.log(err);
        }
    }
    else{
        document.getElementById("error").innerHTML = "Please enter your username.";
    }
}

async function buttonRegister() {

    let res = document.getElementById("result");

    let name = document.getElementById("name").value;
    let nickname = document.getElementById("username2").value;
    let gender = document.getElementById("genre").value;
    let birthday = document.getElementById("date").value;
    let email = document.getElementById("email").value;

    let userCheck = false;

    if (name != "" && nickname != "" && email != "" && birthday != "") { //Verifica se está tudo preenchido

        //Verificar se o nickname já existe na base de dados

        try {

            let users = await $.ajax({
                url: "/api/users",
                method: "get",
                dataType: "json"
            });
            for(let user of users){
                if(user.user_nickname==nickname){
                    userCheck = true;
                }
            }
    
        } catch(err) {
            console.log(err);
        }


        if (!userCheck) { //Se o nickname não existir então vai criar a conta

            let data = {
                user_name: name,
                user_nickname: nickname,
                user_gender: gender,
                user_birthday: birthday,
                user_email: email
            }
        
            try {
        
                let result = await $.ajax({
                    url: "/api/users",
                    method: "post",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    dataType: "json"
                });
                res.innerHTML = "User successfully registered!";

                //Limpar campos
                document.getElementById("name").value = "";
                document.getElementById("username2").value = "";
                document.getElementById("email").value = "";
                document.getElementById("date").value = "";
                
            } catch(err) {
                console.log(err);
                if (err.responseJSON) {
                    res.innerHTML = err.responseJSON.msg;
                } else {
                    res.innerHTML = "Could not create user!";
                }
            }

        } else {
            res.innerHTML = "This nickname already exists!";
        }

    }
    else {
        res.innerHTML = "Please fill in the fields above!";
    }

}