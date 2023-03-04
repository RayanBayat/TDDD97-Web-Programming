var loggedInUsers;
window.onload = function() {
    displayview();
 }

displayview = function()
{
    let token = getUserInfo(0);
    if (token != null) {
        displayProfile(token);
    }
    else {
        displayWelcome();
    }
}

function displayProfile(token) {
    let profileview = document.getElementById("profileview").innerHTML;
    document.getElementById("main").innerHTML = profileview;
    document.getElementById("active").click();

    let userData;

    let req = new XMLHttpRequest();
    req.open("GET", "/get_user_data_by_token/", true);
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
    req.setRequestHeader("Authorization", token)
    req.send();
    
    req.onreadystatechange =  function(){
        if (req.readyState  == 4){
            switch (req.status) {
                case 200:
                    userData = JSON.parse(req.responseText);
                    showUserData(userData[0]);
                    showPosts();
                    break;
                default:
                    break;
            }
    }

    
    
    }
}

function displayWelcome() {
    let welcomeview = document.getElementById("welcomeview").innerHTML;
    document.getElementById("main").innerHTML = welcomeview;
}

function showUserData(userData = null, index = 0) {
    document.getElementsByClassName("profileList")[index].innerHTML = "";
    if (userData != null) {
        document.getElementsByClassName("profileList")[index].innerHTML += 
        '<li id="otherEmail">' + "Email: " + userData.email + "</li>" +
        "<li>" + "First name: " + userData.first_name + "</li>" + 
        "<li>" + "Family name: " + userData.family_name + "</li>" + 
        "<li>" + "Gender: " + userData.gender + "</li>"  +
        "<li>" + "City: " + userData.city + "</li>" + 
        "<li>" + "Country: " + userData.country + "</li>";
    }
}


function handle_error(msg,  index = 0)
{
    document.getElementsByClassName("error")[index].innerHTML = msg;
    document.getElementsByClassName("error")[index].style.display = "block";
}

function signUp(formObj) {
    let req = new XMLHttpRequest();
    req.open("POST", "/sign_up/", true);
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
    req.send(JSON.stringify(formObj));


    req.onreadystatechange =  function(){
        if (req.readyState == 4){
            if (req.status == 201){
                handle_error("User Created!");
                

            }else if (req.status == 409){
                handle_error("User already exists!");
               

            }else if (req.status == 400){
                handle_error("Wrong data format!");
               

            }

        }

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

    let token;
    let form_obj= {
        email:form.email.value,
        password:form.psw.value
    };
    let req = new XMLHttpRequest();
    req.open("POST", "/sign_in/", true);
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
    req.send(JSON.stringify(form_obj));
    req.onreadystatechange =  function(){
        if (req.readyState  == 4){
            switch (req.status) {
                case 200:
                    
                    token = (JSON.parse(req.responseText));
                    syncStorage();
                    loggedInUsers[token] = form.email.value;
                    persistLoggedInUsers();
                    displayview();
                    break;
                case 404:
                    handle_error("User was not found")
                case 400:
                    handle_error("Wrong email or password")
                default:
                    break;
            }

        }

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
    let index = 2;

   
        if (form.psw1.value == form.psw2.value) {

            let pswObj = 
            {
                oldpsw : form.psw0.value,
                newpsw : form.psw2.value
            }

            let req = new XMLHttpRequest();
            req.open("PUT", "/change_password/", true);
            req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
            req.setRequestHeader("Authorization", token);
            req.send(JSON.stringify(pswObj));
            req.onreadystatechange =  function(){
                if (req.readyState  == 4){
                    switch (req.status) {
                        case 204:
                            handle_error("Passoword changed",index);
                            form.reset();
                            break;
                        case 401:
                            handle_error("Wrong password was provided",index);
                            break;
                        case 400:
                            handle_error("Try another new password",index);
                            break;
                        default:
                            break;
                    }
        
                }
        
            }
        }
        else
        {
            handle_error("Passwords provided were not the same",index);
        }
        
} 

function validate(event, form) {
    event.preventDefault();
   const pass1 = form.psw1.value;
   const pass2 = form.psw2.value; 
    if(pass1 == pass2) {
        formObj = signUpObj(form);
        signUp(formObj);
        form.reset();
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
    document.getElementById(tabName).style.display = "flex";
    event.currentTarget.className += " active";
}

function logOut() {
    
    let token = getUserInfo(0);
    let req = new XMLHttpRequest();
    req.open("DELETE", "/sign_out/", true);
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
    req.setRequestHeader("Authorization", token)
    req.send();
    req.onreadystatechange =  function(){
        
        if (req.readyState  == 4){
            
            signOut(token);
            displayview();
        }
    }
}

function post(event, form,  index = 0) {
    event.preventDefault();
    let msg = form.postMsg.value;
    let token = getUserInfo(0);
    let email = getUserInfo(1);
    let otherEmail = document.getElementById("test").querySelector("#otherEmail");
    
    if (otherEmail != null) {
        otherEmail = otherEmail.innerHTML;
        otherEmail = otherEmail.substring(otherEmail.indexOf(' ') + 1);
        email = otherEmail;
        index = 1;
    }

    let messageObj = {
        email : email,
        message : msg
    }

    let req = new XMLHttpRequest();
    req.open("POST", "/post_message/", true);
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
    req.setRequestHeader("Authorization", token)
    req.send(JSON.stringify(messageObj));
    

    req.onreadystatechange =  function(){
        if (req.readyState == 4){

            switch (req.status) {
                case 204:
                    showPosts(token,otherEmail,index);
                    form.reset();
                    break;
                case 400:
                    handle_error("Check your message");
                    break;
                default:
                    break;
            }

        }

    }
}

function showPosts(t = null, e = null, index = 0) {

    let token, email;
    if (t == null) {
        token = getUserInfo(0);
    } else {
        token = t;
    }
    if (e == null) {
        
        email = getUserInfo(1);
    } else {
        email = e;
    }

    let req = new XMLHttpRequest();


    let otherEmail = document.getElementById("test").querySelector("#otherEmail");
    let msgData;
    if (otherEmail == null) {

        req.open("GET", "/get_user_messages_by_email/?"+email, true);
        req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
        req.setRequestHeader("Authorization", token);
        req.send();

        req.onreadystatechange =  function(){
            if (req.readyState  == 4){
                switch (req.status) {
                    case 200:
                        
                        msgData = JSON.parse(req.responseText);
                        document.getElementsByClassName("postData")[index].style.display = "block";
                        document.getElementsByClassName("posts")[index].innerHTML = "";
                        msgData.forEach( element => {
                            document.getElementsByClassName("posts")[index].innerHTML += "<p>"  + element.sender  + ": " + element.messages + "</p>";
                        });

                        break;
                    default:
                        break;
                }
        }

        }
    } else {
        otherEmail = otherEmail.innerHTML;
        otherEmail = otherEmail.substring(otherEmail.indexOf(' ') + 1);

        req.open("GET", "/get_user_messages_by_email/?"+otherEmail, true);
        req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
        req.setRequestHeader("Authorization", token);
        req.send(null);
        
        req.onreadystatechange =  function(){
            if (req.readyState  == 4){
                switch (req.status) {
                    case 200:
                        msgData = JSON.parse(req.responseText);
                        document.getElementsByClassName("postData")[index].style.display = "block";
                        document.getElementsByClassName("posts")[index].innerHTML = "";
                        msgData.forEach(element => {
                            
                            document.getElementsByClassName("posts")[index].innerHTML += "<p>"  +  element.sender + ": " + element.messages + "</p>";
                        });
                        break;
                    default:
                        break;
                    }
            }
        }
    }   


}


function getUser(event, form) {
    
    event.preventDefault();
    let token = getUserInfo(0);
    let otherEmail = form.userEmail.value;

    let req = new XMLHttpRequest();
    req.open("GET", "/get_user_data_by_email/?"+otherEmail, true);
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8")
    req.setRequestHeader("Authorization", token);
    req.send();

    req.onreadystatechange =  function(){
        if (req.readyState  == 4){
            switch (req.status) {
                case 200:
                    myData = JSON.parse(req.responseText);
        
                    userData = myData[0];
                
                    document.getElementsByClassName("error")[1].style.display = "none";
                    showUserData(userData, 1);
                    showPosts(token, otherEmail, 1);
                    form.reset();
                    break;
                case 404:
                    document.getElementsByClassName("postData")[1].style.display = "none";
                    document.getElementsByClassName("profileList")[1].innerHTML = "";
                    handle_error("user doesn't exist",1);
                    break;
                case 400:
                   
                    document.getElementsByClassName("postData")[1].style.display = "none";
                    document.getElementsByClassName("profileList")[1].innerHTML = "";
                    handle_error("Please write an email",1);
                    break;
                default:
                    break;
                }
        }
    }
}


function syncStorage(){

	if (localStorage.getItem("loggedinusers") === null) {
	    loggedInUsers = {};
	} else {
	    loggedInUsers = JSON.parse(localStorage.getItem("loggedinusers"));
      }

}
function persistLoggedInUsers(){
    localStorage.setItem("loggedinusers", JSON.stringify(loggedInUsers));
}

function signOut(token){
    syncStorage();
    if (loggedInUsers[token] != null){
      delete loggedInUsers[token];
      persistLoggedInUsers();
  }
}