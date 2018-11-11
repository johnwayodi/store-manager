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
        if (message === 'category created') {
            let categoriesPage = "categories-admin.html";
            myForm.reset();
            showSnackBar(message);
            setTimeout(function () {
                openNextPage(categoriesPage)
            }, 3300);
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

function getOneCategory() {
    let categoryId = localStorage.getItem('categoryId');
    fetch(url + '/api/v2/categories' + '/' + categoryId, {
        method: 'get',
        headers: {
            "Content-type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        }
    }).then(function (response) {
        return response.json()
    }).then(function (data) {

        let categoryDetails = data['category'];
        document.getElementById('c_name').value = categoryDetails['name'];
        document.getElementById('c_desc').value = categoryDetails['description'];

        console.log(data)
    }).catch(err => console.log(err));
}

function updateCategory() {
    let categoryId = localStorage.getItem('categoryId');
    let myForm = document.getElementById("p-details-form");

    let categoryName = myForm.elements["c_name"].value;
    let categoryDescription = myForm.elements["c_desc"].value;

    fetch(url + '/api/v2/categories' + '/' + categoryId, {
        method: 'put',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        },
        body: JSON.stringify({
            name: categoryName,
            description: categoryDescription
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
        }
        return response.json()
    }).then(function (data) {
        console.log(data);
        let message = data['message'];
        if (message === 'category updated successfully') {
            let categoriesPage = "categories-admin.html";
            myForm.reset();
            showSnackBar(message);
            setTimeout(function () {
                openNextPage(categoriesPage)
            }, 3300);
        }
        else {
            showSnackBar(message, "error");
        }
        // document.location.href = "products-admin.html";
    }).catch(err => console.log(err))
}

function deleteCategory() {
    let categoryId = localStorage.getItem('categoryId');
    fetch(url + '/api/v2/categories' + '/' + categoryId, {
        method: 'delete',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        }
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
        let myForm = document.getElementById("p-details-form");
        let message = data['message'];
        if (message === 'category deleted successfully') {
            let categoriesPage = "categories-admin.html";
            myForm.reset();
            showSnackBar(message);
            setTimeout(function () {
                openNextPage(categoriesPage)
            }, 3300);
        }
        else {
            showSnackBar(message, "error");
        }
        console.log(data)
    }).catch(err => console.log(err));
}

function addProduct() {
    let myForm = document.getElementById("product-form");

    let productName = myForm.elements["p_name"].value;
    let productDescription = myForm.elements["p_desc"].value;
    let productPrice = myForm.elements["p_price"].value;
    let productStock = myForm.elements["p_stock"].value;
    let productStockMin = myForm.elements["p_stock_min"].value;
    let productCategory = myForm.elements["p_category"].value;

    fetch(url + '/api/v2/products', {
        method: 'post',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        },
        body: JSON.stringify({
            name: productName,
            price: Number(productPrice),
            description: productDescription,
            category: productCategory,
            stock: Number(productStock),
            min_stock: Number(productStockMin)
        })
    }).then(function (response) {
        if (response.status !== 201) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
        }
        return response.json()
    }).then(function (data) {
        // console.log(data);
        let message = data['message'];
        if (message === 'product created'){
            let productsPage = "products-admin.html";
            showSnackBar(message);
            setTimeout(function (){openNextPage(productsPage)}, 3300);
        }
        else {
            showSnackBar(message, "error");
        }
        // console.log(message);
    }).catch(err => console.log(err))
}

function getAllProducts() {
    let products = document.getElementById('products-list');

    fetch(url + '/api/v2/products', {
        method: 'get',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        }
    }).then(function (response) {
        console.log(response.status);
        return response.json();
    }).then(function (data) {
        let allProducts = data['products'];
        allProducts.forEach(function (item) {
            let product = createProductItem(item);
            products.appendChild(product);
            console.log(data);
        });
        console.log(data['products']);
    }).catch(err => console.log(err))
}

function createProductItem(productItem) {
    let detailsPage = undefined;
    let item = document.createElement('div');
    item.classList.add('product-item');

    let details = document.createElement('div');
    details.classList.add('product-details');
    item.appendChild(details);

    let pName = document.createElement('div');
    pName.classList.add('product-name');
    pName.textContent = productItem['name'];
    details.appendChild(pName);

    let extraDetails = document.createElement('div');
    extraDetails.classList.add('product-details-extra');
    details.appendChild(extraDetails);

    let pPrice = document.createElement('div');
    pPrice.classList.add('product-price');
    pPrice.textContent = 'Price: ' + productItem['price'];
    extraDetails.appendChild(pPrice);

    let pStock = document.createElement('div');
    pStock.classList.add('product-price');
    pStock.textContent = 'In Stock: ' + productItem['stock'];
    extraDetails.appendChild(pStock);

    let pStockMin = document.createElement('div');
    pStockMin.classList.add('product-price');
    pStockMin.textContent = 'Minimum Stock: ' + productItem['min_stock'];
    extraDetails.appendChild(pStockMin);

    item.addEventListener("click", function () {
        localStorage.setItem('productId', productItem['id']);
        if (localStorage.getItem('userrole') === 'admin'){
            detailsPage = "product-detail-admin.html"
        }
        else {
            detailsPage = "product-detail.html"
        }
        document.location.href = detailsPage;
    });
    return item;
}

function getOneProduct() {
    let productId = localStorage.getItem('productId');
    fetch(url + '/api/v2/products' + '/' + productId, {
        method: 'get',
        headers: {
            "Content-type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        }
    }).then(function (response) {
        return response.json()
    }).then(function (data) {

        let productDetails = data['product'];
        document.getElementById('p_name').value = productDetails['name'];
        document.getElementById('p_price').value = productDetails['price'];
        document.getElementById('p_stock').value = productDetails['stock'];
        document.getElementById('p_stock_min').value = productDetails['min_stock'];
        document.getElementById('p_desc').value = productDetails['description'];
        document.getElementById('p_category').value = productDetails['category'];

        console.log(data)
    }).catch(err => console.log(err));
}

function updateProduct() {
    let productId = localStorage.getItem('productId');
    let myForm = document.getElementById("p-details-form");

    let productName = myForm.elements["p_name"].value;
    let productDescription = myForm.elements["p_desc"].value;
    let productPrice = myForm.elements["p_price"].value;
    let productStock = myForm.elements["p_stock"].value;
    let productStockMin = myForm.elements["p_stock_min"].value;
    let productCategory = myForm.elements["p_category"].value;

    fetch(url + '/api/v2/products' + '/' + productId, {
        method: 'put',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        },
        body: JSON.stringify({
            name: productName,
            price: Number(productPrice),
            description: productDescription,
            category: productCategory,
            stock: Number(productStock),
            min_stock: Number(productStockMin)
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
        }
        return response.json()
    }).then(function (data) {
        console.log(data);
        let message = data['message'];
        if (message === 'product updated successfully'){
            let productsPage = "products-admin.html";
            showSnackBar(message);
            setTimeout(function (){openNextPage(productsPage)}, 3300);
        }
        else {
            showSnackBar(message, "error");
        }
    }).catch(err => console.log(err))
}

function deleteProduct() {
    let productId = localStorage.getItem('productId');
    fetch(url + '/api/v2/products' + '/' + productId, {
        method: 'delete',
        headers: {
            "Content-type": "application/json;",
            "Authorization": "Bearer " + localStorage.getItem('authtoken')
        }
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
        let myForm = document.getElementById("p-details-form");
        let message = data['message'];
        if (message === 'product deleted successfully') {
            let productsPage = "products-admin.html";
            myForm.reset();
            showSnackBar(message);
            setTimeout(function () {
                openNextPage(productsPage)
            }, 3300);
        }
        else {
            showSnackBar(message, "error");
        }
        console.log(data)
    }).catch(err => console.log(err))
}

function addToCart() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (cartItems == null) cartItems = [];
    let myForm = document.getElementById("p-details-form");
    let productName = myForm.elements["p_name"].value;
    let productQuantity = myForm.elements["p_quantity"].value;
    if (productQuantity <= 0){
        let message = "please enter a value greater than zero";
        showSnackBar(message, "error");
    }
    else {
        let cartItem = {"name": productName, "count": Number(productQuantity)};
        cartItems.push(cartItem);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    console.log(localStorage.getItem('cartItems'));
}

function loadShoppingCart() {
    let shoppingCart = document.getElementById("s-cart-section");
    let saleButton = document.getElementById("sale-button-section");
    let cartItems = JSON.parse(localStorage.getItem('cartItems'));
    cartItems.forEach(function (item) {
        let cartItem = createShoppingCartItem(item);
        shoppingCart.appendChild(cartItem);

        saleButton.parentNode.insertBefore(cartItem, saleButton);
    });
    console.log(cartItems);
}

function createShoppingCartItem(cartItem) {
    let item = document.createElement('div');
    item.classList.add('sc-item');

    let nameSection = document.createElement('div');
    nameSection.classList.add('item-row');
    item.appendChild(nameSection);

    let nameLabel = document.createElement('div');
    nameLabel.classList.add('item-label');
    nameLabel.textContent = 'Product Name:';
    nameSection.appendChild(nameLabel);

    let nameValue = document.createElement('div');
    nameValue.classList.add('item-value');
    nameValue.textContent = cartItem['name'];
    nameSection.appendChild(nameValue);

    let quantitySection = document.createElement('div');
    quantitySection.classList.add('item-row');
    item.appendChild(quantitySection);

    let quantityLabel = document.createElement('div');
    quantityLabel.classList.add('item-label');
    quantityLabel.textContent = 'Quantity:';
    quantitySection.appendChild(quantityLabel);

    let quantityValue = document.createElement('div');
    quantityValue.classList.add('item-value');
    quantityValue.textContent = cartItem['count'];
    quantitySection.appendChild(quantityValue);

    let removeSection = document.createElement('div');
    removeSection.classList.add('item-row');
    item.appendChild(removeSection);

    let removeValue = document.createElement('div');
    removeValue.classList.add('item-remove');
    removeValue.textContent = 'Remove';
    removeSection.appendChild(removeValue);

    removeSection.addEventListener("click", function () {
        let cartItems = JSON.parse(localStorage.getItem("cartItems"));
        let cartItemToRemove = JSON.parse(JSON.stringify({"name": cartItem['name'], "count": cartItem['count']}));
        if (cartItems == null) cartItems = [];
        let itemIndex = cartItems.indexOf(cartItemToRemove);
        cartItems.splice(itemIndex, 1);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        location.reload();
        console.log(cartItems);
    });
    return item;
}