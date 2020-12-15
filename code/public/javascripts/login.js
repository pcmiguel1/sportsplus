
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
                    sessionStorage.setItem("user", user_json);
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