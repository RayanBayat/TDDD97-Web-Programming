displayview = function()
{
    let token = getUserInfo(0);
    if (token != null) {
        let profileview = document.getElementById("profileview").innerHTML;
        
        document.getElementById("main").innerHTML = profileview;
        document.getElementById("active").click();
    }
    else {
        let welcomeview = document.getElementById("welcomeview").innerHTML;
        document.getElementById("main").innerHTML = welcomeview;
        
    }
    
}

window.onload = function() {
   displayview();
   //document.getElementById("active").click();
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
            form.reset();
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
    //console.log(answer);
    if(answer.success)
    {
        //window.localStorage.setItem("Token",answer.data);
        displayview();
        
    }
    else
    {
        handle_error(answer.message);
    }

}
function getUserInfo(keyValue) {
    let LoggedIn = localStorage.getItem("loggedinusers");
    let jsonobject = JSON.parse(LoggedIn);
    if (jsonobject != null) {
        switch (keyValue) {
            case 0:
                return Object.keys(jsonobject)[0];
            case 1:
                return Object.values(jsonobject)[0];
        }
    }
}

function changePsw(event, form) {
    event.preventDefault();
    let token = getUserInfo(0);
    let email = getUserInfo(1);

    let user = localStorage.getItem("users");
    let jsonobject = JSON.parse(user);
    let userData = jsonobject[email];

    if (form.psw0.value == userData.password) {
        if (form.psw1.value == form.psw2.value) {
            let ans = serverstub.changePassword(token, form.psw0.value, form.psw1.value);
            handle_error(ans.message);
            form.reset();
        }
        else {
            handle_error("You've entered two different passwords");
        }
    }    
    else {
        handle_error("Your old password is incorrect!");
    }
} 

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

function openTab(event, tabName) {
    let tabContent, tabLinks;
    tabContent = document.getElementsByClassName("tabcontent");
    for (let index = 0; index < tabContent.length; index++) {
      tabContent[index].style.display = "none";
    }
    tabLinks = document.getElementsByClassName("tablinks");
    for (let index = 0; index < tabLinks.length; index++) {
      tabLinks[index].className = tabLinks[index].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

function logOut() {
    let token = getUserInfo(0);
    serverstub.signOut(token);
    displayview();
}