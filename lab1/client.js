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
    let userData = serverstub.getUserDataByToken(token);
    showUserData(userData);
    showPosts();
}

function displayWelcome() {
    let welcomeview = document.getElementById("welcomeview").innerHTML;
    document.getElementById("main").innerHTML = welcomeview;
}

function showUserData(userData = null, index = 0) {
    document.getElementsByClassName("profileList")[index].innerHTML = "";
    if (userData != null) {
        document.getElementsByClassName("profileList")[index].innerHTML += 
        '<li id="otherEmail">' + "Email: " + userData.data.email + "</li>" +
        "<li>" + "First name: " + userData.data.firstname + "</li>" + 
        "<li>" + "Family name: " + userData.data.familyname + "</li>" + 
        "<li>" + "Gender: " + userData.data.gender + "</li>"  +
        "<li>" + "City: " + userData.data.city + "</li>" + 
        "<li>" + "Country: " + userData.data.country + "</li>";
    }
}


function handle_error(msg,  index = 0)
{
    document.getElementsByClassName("error")[index].innerHTML = msg;
    document.getElementsByClassName("error")[index].style.display = "block";
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
    if(answer.success)
    {
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
    serverstub.signOut(token);
    displayview();
}

function post(event, form,  index = 0) {
    event.preventDefault();
    let msg = form.postMsg.value;
    let token = getUserInfo(0);
    let email = getUserInfo(1);
    
    let name = getName(token);
    let otherEmail = document.getElementById("test").querySelector("#otherEmail");
    
    if (otherEmail != null) {
        otherEmail = otherEmail.innerHTML;
        otherEmail = otherEmail.substring(otherEmail.indexOf(' ') + 1);
        email = otherEmail;
        index = 1;
    }
    let ans = serverstub.postMessage(token, msg, email);
    if (ans.success) {
        let msgData = serverstub.getUserMessagesByEmail(token, email);
        document.getElementsByClassName("posts")[index].innerHTML = "<p>"  + name + ": " + msgData.data[0].content + "</p>" 
        + document.getElementsByClassName("posts")[index].innerHTML;
        form.reset();
    }
    else {
        handle_error(ans.message); 
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
    let otherEmail = document.getElementById("test").querySelector("#otherEmail");
    let msgData;
    if (otherEmail == null) {
        msgData = serverstub.getUserMessagesByEmail(token, email);
    } else {
        otherEmail = otherEmail.innerHTML;
        otherEmail = otherEmail.substring(otherEmail.indexOf(' ') + 1);
        msgData = serverstub.getUserMessagesByEmail(token, otherEmail);
    }
    document.getElementsByClassName("postData")[index].style.display = "block";
    document.getElementsByClassName("posts")[index].innerHTML = "";
    msgData.data.forEach(element => {
        document.getElementsByClassName("posts")[index].innerHTML += "<p>"  + getName(token, element.writer) + ": " + element.content + "</p>";
    });
}


function getName(token, email = null) {
    if (email == null) {
        let myData = serverstub.getUserDataByToken(token);
        let fullName = myData.data.firstname.concat(" ", myData.data.familyname);
        return fullName;
    }
    let userData = serverstub.getUserDataByEmail(token, email);
    let fullName = userData.data.firstname.concat(" ", userData.data.familyname);
    return fullName;
}

function getUser(event, form) {
    
    event.preventDefault();
    let token = getUserInfo(0);
    let otherEmail = form.userEmail.value;
    let userData = serverstub.getUserDataByEmail(token, otherEmail);
    if (userData.success) {
        document.getElementsByClassName("error")[1].style.display = "none";
        showUserData(userData, 1);
        showPosts(token, otherEmail, 1);
        form.reset();
    }
    else {
        document.getElementsByClassName("postData")[1].style.display = "none";
        document.getElementsByClassName("profileList")[1].innerHTML = "";
        handle_error(userData.message, 1);
    }
}