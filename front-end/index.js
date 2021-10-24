var color_error = "#BOOO20"
var color_success = "#000000"
var validUserToken = ""
var validUserUsername = ""

function print(msg) {
  console.log(msg)
}

function httpGet(theUrl) {
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", theUrl, false); 
    xmlHttpReq.send(null);
    return xmlHttpReq.responseText;
  }

function login() {
    print("Trying to Log In")
    let password = document.getElementById("password-login").value
    let username = document.getElementById("username-login").value

    fetch("http://localhost:3000/login/"  + username + "/" + SHA1(password))
    .then(response => {
      if (response.status == 200) {
        document.getElementById("message-login").innerHTML = "Success";
        document.getElementById("message-login").style.color = "black";
        document.getElementById("password-login").value = ""
        document.getElementById("username-login").value = ""
        document.getElementById("points-user").innerHTML = ""
      } else {
        document.getElementById("message-login").innerHTML = "Invalid Username or Password";
        document.getElementById("message-login").style.color = "red";
      }
      console.log(response)
      return response.json();
    })
    .then(data => {
      console.log(data)
      document.getElementById("welcome-user").innerHTML = "Welcome " + data.result.FirstName + " " + data.result.LastName + "!";
      document.getElementById("username-user").innerHTML = "@" + data.result.UserName
      document.getElementById("points-user").innerHTML = "Points: " + data.result.Points
      document.getElementById("logout-button-user").innerHTML = '<button onclick="logout()">Logout</button>'
      validUserUsername = data.result.UserName
      validUserToken = data.Token
    });
}

function logout() {
  document.getElementById("welcome-user").innerHTML = "Please Log In"
  document.getElementById("username-user").innerHTML = ""
  document.getElementById("logout-button-user").innerHTML = ""
  document.getElementById("points-user").innerHTML = ""
  fetch("http://localhost:3000/logout/"  + validUserUsername + "/" + validUserToken)
  validUserToken = ""
  validUserUsername = ""
}

function register() {
  print("Trying to Log In")
  let password = document.getElementById("password-register").value
  let username = document.getElementById("username-register").value
  let firstName = document.getElementById("firstname-register").value
  let lastName = document.getElementById("lastname-register").value
  let email = document.getElementById("email-register").value

  fetch("http://localhost:3000/register/"  + username + "/" + SHA1(password) + "/" + firstName  + "/" + lastName  + "/" + email)
  .then(response => {
    console.log(response)
    if (response.status == 200) {
      document.getElementById("message-register").innerHTML = "Success";
      document.getElementById("password-login").value = password
      document.getElementById("username-login").value = username
      login()
    }
    return response.json();
  })
  .then(data => {
    console.log(data)
  });
}

function checkUsername() {
  let username = document.getElementById("username-register").value
  fetch("http://localhost:3000/username/"  + username)
    .then(response => {
      console.log(response)
      if (response.status != 200) {
        document.getElementById("username-check-register").innerHTML = "Username Not Available";
        return false
      } else {
        document.getElementById("username-check-register").innerHTML = "";
        return true
      }
    })
}

function lookupUser() {
  let username = document.getElementById("input-lookup").value
  console.log(username)
  fetch("http://localhost:3000/checkuser/"  + username)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data)
    let content = ""
    for (let i in data) {
      content += "<div>@" + data[i].UserName + ", " + data[i].FirstName + " " + data[i].LastName + "</div>"
    }
    document.getElementById("results-lookup").innerHTML = content;
  });
}
