import $ from "jquery";
const firebase = require("firebase");

var id;
if (localStorage.id) {
    id = localStorage.id;
} else {
    localStorage.id = 1;
}
console.log("i worK!");

var config = {
    apiKey: "AIzaSyAxq2kfdo0cNRLZcYaRp4ZJMx_s9hXE3YE",
    authDomain: "likecounter-b8d5a.firebaseapp.com",
    databaseURL: "https://likecounter-b8d5a.firebaseio.com",
    storageBucket: "likecounter-b8d5a.appspot.com",
    messagingSenderId: "897523997760"
};
firebase.initializeApp(config);
const db = firebase.database();

$(function () {
    $(".btn-like").click(function () {
        console.log("click like");
        db.ref("/like-app/info/").set({
            "id": "1",
            "type": "like",
            "cur_time": new Date().toLocaleTimeString()
        });
    });
});