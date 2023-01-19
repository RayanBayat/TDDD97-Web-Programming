displayview = function()
{
    let token = localStorage.getItem("Token");
    
    if (token != null) {
        let profileview = document.getElementById("profileview").innerHTML;
        document.getElementById("main").innerHTML = profileview;
    }
    else {
        let welcomeview = document.getElementById("welcomeview").innerHTML;
        document.getElementById("main").innerHTML = welcomeview;
    }
    let LoggedIn= localStorage.getItem("loggedinusers");
    console.log(LoggedIn);
    let jsonobject = JSON.parse(LoggedIn);
    console.log(jsonobject[1]);
    // // return false;
}

window.onload = function() {
   displayview();
}

function handle_error(msg)
{
    document.getElementById("error").innerHTML = msg;
    document.getElementById("error").style.display = "block";
}


function signUp(formObj) {
    let succeeded = serverstub.signUp(formObj);
        if (!succeeded.success) {
            handle_error(succeeded.message);
            
        }
        else {
            handle_error(succeeded.message);
        }
}

function signUpObj(form)
{
   return formObj = {
        email: form.email.value, 
        password: form.psw1.value, 
        firstname: form.fname.value, 
        familyname: form.lname.value, 
        gender: form.gender.value, 
        city: form.city.value, 
        country: form.country.value
       }
}

function signIn(form) {
    let answer = serverstub.signIn(form.email.value, form.psw.value);
    console.log(answer);
    if(answer.success)
    {
        window.localStorage.setItem("Token",answer.data);
        displayview();
        
    }
    else
    {
        handle_error(answer.message);
    }

}



//validates
function validate(form) {
   const pass1 = form.psw1.value;
   const pass2 = form.psw2.value;
    if(pass1 == pass2) {
        formObj = signUpObj(form);
        signUp(formObj);
    }
    else {
        handle_error("You've entered two different passwords");
    }
    
}




function goHome() {
    document.getElementById("home").style.display = "block";
    document.getElementById("home").classList.add("active");
    document.getElementById("browse").style.display = "none";
    document.getElementById("account").style.display = "none";
}
function goBrowse() {
    document.getElementById("home").style.display = "none";
    document.getElementById("browse").style.display = "block";
    document.getElementById("browse").classList.add("active");
    document.getElementById("account").style.display = "none";
}
function goAccount() {
    document.getElementById("home").style.display = "none";
    document.getElementById("browse").style.display = "none";
    document.getElementById("account").style.display = "block";
    document.getElementById("account").classList.add("active");
}