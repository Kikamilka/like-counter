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
        "begin": "20:00:00",
        "end": "20:39:59",
        "author": "Алексей Зиновьев",
        "title": "Джунгли Hadoop: мир диких алгоритмов и ядовитых JVM"
    },
    {
        "begin": "20:40:00",
        "end": "20:59:59",
        "author": "Арина Николаева",
        "title": "Mind mapping. Use your head to grow a tree!"
    },
    {
        "begin": "21:00:00",
        "end": "21:39:59",
        "author": "Яна Клочкова, Владимир Селянкин, Игорь Кузьминых",
        "title": "Мы из Agile"
    },
    {
        "begin": "22:00:00",
        "end": "22:39:59",
        "author": "Игорь Борисевич, Юрий Кочубеев",
        "title": "Support from Cradle to Grave"
    },
    {
        "begin": "22:40:00",
        "end": "22:59:59",
        "author": "Екатерина Никольская",
        "title": "Self-presentation: tips & tricks"
    },
    {
        "begin": "23:00:00",
        "end": "23:59:59",
        "author": "Александр Шушунов",
        "title": "Bullshit Bingo"
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
        $(".btn-like").disabled = true;
        $(".btn-dislike").disabled = true;
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
        db.ref("/like-app/info/" + randomValue).set({
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
        db.ref("/like-app/info/" + randomValue).set({
            "id": id,
            "type": "dislike",
            "cur_time": firebase.database.ServerValue.TIMESTAMP
            //"cur_time": new Date().toLocaleTimeString()
        });
    });
});

// работа с базой данных (ПРИМЕР)
/*db.ref("/like-app/info/").once('value', function(snapshot) {
 snapshot.forEach(function(childSnapshot) {
 var date_ex = new Date().getMilliseconds();
 if (date_ex <= childSnapshot.val().cur_time) {
 console.log(new Date(childSnapshot.val().cur_time).toLocaleTimeString());
 }
 });
 });*/