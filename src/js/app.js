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
        "end": "23:49:59",
        "author": "Александр Шушунов",
        "title": "Bullshit Bingo"
    }
];

$(function () {
    document.querySelector(".title").innerHTML = "<p>"+""+"</p>";
    timetable.forEach(function (item) {
        if (item.begin <= new Date().toLocaleTimeString() && item.end >= new Date().toLocaleTimeString()) {
            document.querySelector(".title").innerHTML = "<p style='color: azure; font-size: 14px; font-weight:" +
                " bold; text-align: center; margin: 10px;'>" + item.title + "</p>";
        }
    });
    setInterval(function() {
        timetable.forEach(function (item) {
            if (item.begin <= new Date().toLocaleTimeString() && item.end >= new Date().toLocaleTimeString()) {
                document.querySelector(".title").innerHTML = "<p style='color: azure; font-size: 14px; font-weight:" +
                    " bold; text-align: center; margin: 10px;'>" + item.title + "</p>";
            }
        })
    }, 60000);

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