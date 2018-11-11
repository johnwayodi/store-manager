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

