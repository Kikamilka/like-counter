import $ from "jquery";
const firebase = require("firebase");

function generateId(len) {
    return Math.random().toString(36).substr(2, len || 10);
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

var timetable = [
    {
        "begin": "19:40:00",
        "end": "20:45:00",
        "author": "Андрей Кузнецов",
        "title": "Big Data. Cloudera Zoo"
    },
    {
        "begin": "20:50:00",
        "end": "22:09:59",
        "author": "Игорь Кузьминых",
        "title": "Drill project. Expand your App"
    },
    {
        "begin": "22:20:00",
        "end": "23:30:00",
        "author": "Евгений Кожевников",
        "title": "Serverless Big Data или слон с крыльями"
    }
];

var rewriteTitle = function () {
    timetable.forEach(function (item) {
        if (item.begin <= new Date().toLocaleTimeString() && item.end >= new Date().toLocaleTimeString()) {
            if (document.querySelector(".title").innerHTML != "<p>" + item.title + "</p>") {
                $(".btn-like").removeAttr("disabled");
                $(".btn-dislike").removeAttr("disabled");
                document.querySelector(".title").innerHTML = "<p>" + item.title + "</p>";
            }
        }
    })
};

$(function () {
    if (new Date().toLocaleTimeString() < timetable[0].begin) {
        document.querySelector(".title").innerHTML = "<p>" + "В данный момент времени активных докладов нет" + "</p>";
    }
    rewriteTitle();
    setInterval(function () {
        rewriteTitle();
    }, 20000);

    $(".btn-like").click(function () {
        this.disabled = true;
        $(".btn-dislike").removeAttr("disabled");
        console.log("click like");
        var randomValue = generateId(15);
        db.ref("/like-app/it_night/" + randomValue).set({
            "id": id,
            "type": "like",
            "cur_time": firebase.database.ServerValue.TIMESTAMP
        });
    });

    $(".btn-dislike").click(function () {
        this.disabled = true;
        $(".btn-like").removeAttr("disabled");
        console.log("click dislike");
        var randomValue = generateId(15);
        db.ref("/like-app/it_night/" + randomValue).set({
            "id": id,
            "type": "dislike",
            "cur_time": firebase.database.ServerValue.TIMESTAMP
            //"cur_time": new Date().toLocaleTimeString()
        });
    });
});