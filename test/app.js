//Require the dev-dependencies
let chai = require('chai');
const myApp = require('../js/app');

const url = 'http://127.0.0.1:5000';

let assert = chai.assert;
describe('User Registration and Login', function () {

    it('should register user as admin', function () {
        var user = {
            username: 'john',
            password: '123456'
        };

        let userDetails = JSON.stringify(user);
        let result = myApp.registerAdmin().fetch(url + '/auth/register', {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=utf-8"
            },
            body: userDetails
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            let message = data.message;
            return message;
        }).catch(err => console.log(err));
        assert.equal(result, 'user created');
    });
    it('should login created admin user', function () {
        var user = {
            username: 'john',
            password: '123456'
        };

        let userDetails = JSON.stringify(user);
        let result = myApp.registerAdmin().fetch(url + '/auth/login', {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=utf-8"
            },
            body: userDetails
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            return data.message;
        }).catch(err => console.log(err));
        assert.equal(result, 'user created');
    });
});


describe('Admin Operations on Attendant', function () {

    it('should create a new attendant', function () {
        let user = {
            username: 'jack',
            password: '1234567aha'
        };

        let userDetails = JSON.stringify(user);
        let result = myApp.addAttendant().fetch(url + '/api/v2/users', {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=utf-8"
            },
            body: userDetails
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            return data.message;
        }).catch(err => console.log(err));
        assert.equal(result, 'test-class');
    });

    it('should get list of attendants currently one', function () {
        let result = myApp.getAllAttendants().fetch(url + '/api/v2/users', {
            method: 'get',
            headers: {
                "Content-type": "application/json; charset=utf-8"
            },
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            return data.message;
        }).catch(err => console.log(err));
        assert.equal(result, 'test-class');
    });
});