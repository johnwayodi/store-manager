const url = 'http://127.0.0.1:5000';
let records = document.getElementById('my-users-list');

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

function addAttendant() {
    let myForm = document.getElementById("form2");

    let uName = myForm.elements["attendant_name"].value;
    let uPass = myForm.elements["attendant_pass"].value;
    fetch(url + '/api/v2/users', {
        method: 'post',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        },
        body: JSON.stringify({
            username: uName,
            password: uPass
        })
    }).then(function (response) {
        if (response.status !== 201) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
        }
        return response.json()
    }).then(function (data) {
        console.log();
        let message = data['message'];
        if (message === 'attendant created successfully') {
            let attendantsPage = "all-attendants.html";
            showSnackBar(data['message']);
            setTimeout(function () {
                openNextPage(attendantsPage)
            }, 3300);
        }
        else {
            showSnackBar(message, "error");
        }
        // console.log(message);
    }).catch(err => console.log(err))

}

function getAllAttendants() {
    fetch(url + '/api/v2/users', {
        method: 'get',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        }
    }).then(function (response) {
        console.log(response.status);
        return response.json();
    }).then(function (data) {
        let users = data['users'];
        users.forEach(function (item) {
            let user = createAttendantItem(item);
            records.appendChild(user);
            console.log(item);
        });
    }).catch(err => console.log(err))
}

function createAttendantItem(saleItem) {
    let item = document.createElement('div');
    item.classList.add('record-item');

    let details = document.createElement('div');
    details.classList.add('record-details');
    item.appendChild(details);

    let saleId = document.createElement('div');
    saleId.classList.add('record-name');
    saleId.textContent = saleItem['id'];
    details.appendChild(saleId);

    let extraDetails = document.createElement('div');
    extraDetails.classList.add('record-details-extra');
    details.appendChild(extraDetails);

    let userName = document.createElement('div');
    userName.classList.add('product-price');
    userName.textContent = saleItem['username'];
    extraDetails.appendChild(userName);

    let dateCreated = document.createElement('div');
    dateCreated.classList.add('product-price');
    dateCreated.textContent = '30-12-2018';
    extraDetails.appendChild(dateCreated);

    return item;

}

function addCategory() {
    let myForm = document.getElementById("category-form");

    let categoryName = myForm.elements["c_name"].value;
    let categoryDescription = myForm.elements["c_desc"].value;

    fetch(url + '/api/v2/categories', {
        method: 'post',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        },
        body: JSON.stringify({
            name: categoryName,
            description: categoryDescription,
        })
    }).then(function (response) {
        if (response.status !== 201) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
        }
        return response.json()
    }).then(function (data) {
        let message = data['message'];
        if (message === 'category created'){
            let categoriesPage = "categories-admin.html";
            myForm.reset();
            showSnackBar(message);
            setTimeout(function (){openNextPage(categoriesPage)}, 3300);
        }
        else {
            showSnackBar(message, "error");
        }
    }).catch(err => console.log(err))

}

function getAllCategories() {
    let products = document.getElementById('categories-list');

    fetch(url + '/api/v2/categories', {
        method: 'get',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        }
    }).then(function (response) {
        console.log(response.status);
        return response.json();
    }).then(function (data) {
        let allCategories = data['categories'];
        allCategories.forEach(function (item) {
            let product = createCategoryItem(item);
            products.appendChild(product);
            console.log(data);
        });
        console.log(data);
    }).catch(err => console.log(err))
}

function createCategoryItem(categoryItem) {
    let detailsPage = undefined;
    let item = document.createElement('div');
    item.classList.add('product-item');

    let details = document.createElement('div');
    details.classList.add('product-details');
    item.appendChild(details);

    let pName = document.createElement('div');
    pName.classList.add('product-name');
    pName.textContent = categoryItem['name'];
    details.appendChild(pName);

    let extraDetails = document.createElement('div');
    extraDetails.classList.add('product-details-extra');
    details.appendChild(extraDetails);

    let pPrice = document.createElement('div');
    pPrice.classList.add('product-price');
    pPrice.textContent = 'Description: ' + categoryItem['description'];
    extraDetails.appendChild(pPrice);


    item.addEventListener("click", function () {
        localStorage.setItem('categoryId', categoryItem['id']);
        detailsPage = "category-detail.html";
        document.location.href = detailsPage;
    });
    return item;

}
