import $ from "jquery";
const firebase = require("firebase");

function generateId (len) {
    return Math.random().toString(36).substr(2, len || 10 );
}

if (!localStorage.userId) {
    localStorage.userId = generateId();
}
var id = localStorage.userId;
console.log("id: ", id);

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
        var randomValue = generateId (15);
        db.ref("/like-app/info/"+randomValue).set({
            "id": id,
            "type": "like",
            "cur_time": new Date().toLocaleTimeString()
        });
    });

    $(".btn-dislike").click(function () {
        console.log("click dislike");
        var randomValue = generateId (15);
        db.ref("/like-app/info/"+randomValue).set({
            "id": id,
            "type": "dislike",
            "cur_time": new Date().toLocaleTimeString()
        });
    });
});

// работа с базой данных!
db.ref("/like-app/info/").once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var date_ex = new Date();
        date_ex.setHours(17, 35, 0, 0);
        if (date_ex.toLocaleTimeString() < childSnapshot.val().cur_time) {
            //console.log(childSnapshot.val().type);
        }
    });
});