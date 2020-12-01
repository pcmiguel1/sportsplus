
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