const url = 'http://127.0.0.1:5000';


function showSnackBar(message, messageType) {

    let snackBar = document.getElementById("snackbar");
    snackBar.textContent = message;
    if (messageType === "error") {
        snackBar.style.backgroundColor = 'red';
    }
    else {
        snackBar.style.backgroundColor = 'green';
    }
    snackBar.className = "show";
    setTimeout(function () {
        snackBar.className = snackBar.className.replace("show", "");
    }, 3000);
}

function openNextPage(page) {
    document.location.href = page;
}

function registerAdmin() {
    let myForm = document.getElementById("form0");

    let uName = myForm.elements["username"].value;
    let uPass = myForm.elements["password"].value;

    fetch(url + '/auth/register', {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            username: uName,
            password: uPass
        })
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
        let message = data.message;
        if (message === 'user created') {
            let loginPage = "index.html";
            myForm.reset();
            showSnackBar(message);
            setTimeout(function () {
                openNextPage(loginPage)
            }, 3300);
        }
        else {
            showSnackBar(message, "error");
        }
    }).catch(err => console.log(err))

}

function loginUser() {
    document.getElementById("login-button").disabled = true;
    let myForm = document.getElementById("form1");

    let uName = myForm.elements["username"].value;
    let uPass = myForm.elements["password"].value;
    let dashboard = undefined;
    fetch(url + '/auth/login', {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            username: uName,
            password: uPass
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
        }
        return response.json()
    }).then(function (data) {
        let message = data.message;
        if (message === 'login successful') {
            let role = data['user_role'];
            let token = data['access_token'];
            localStorage.setItem('userrole', role);
            localStorage.setItem('authtoken', token);
            console.log(token);
            console.log(role);
            if (role === 'admin') {
                dashboard = "dashboard-admin.html";
            }
            if (role === 'attendant') {
                dashboard = "dashboard-attendant.html"
            }
            myForm.reset();
            showSnackBar(message);

            setTimeout(function () {
                openNextPage(dashboard)
            }, 3300);
        }
        else {
            showSnackBar(data['message'], "error");
            document.getElementById("login-button").disabled = false;
            console.log(message);
        }

    }).catch(err => console.log(err))

}