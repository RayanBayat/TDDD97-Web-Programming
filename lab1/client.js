
function validatePsws(form) {
    const pass1 = form.psw1.value;
    const pass2 = form.psw2.value;
    if(pass1 != pass2) {
        document.getElementById("error").style.display = "block"; 
        return false;
    }
    return true;
}