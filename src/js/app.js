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
        "date": "28.03.2017",
        "begin": "09:30:00",
        "end": "11:00:00",
        "author": "Arina Nikolaeva",
        "title": "EPAM Training – Why we do eLearning"
    },
    {
        "date": "30.03.2017",
        "begin": "17:30:00",
        "end": "20:00:00",
        "author": "Anna Knyazkova",
        "title": "Professional burnout: How to prevent it?"
    },
    {
        "date": "04.04.2017",
        "begin": "09:30:00",
        "end": "11:00:00",
        "author": "Aleksei Prokofev",
        "title": "Java logging is a tricky business"
    },
    {
        "date": "04.04.2017",
        "begin": "17:30:00",
        "end": "19:00:00",
        "author": "Ekaterina Nikolskaya",
        "title": "How did they pass an assessment session?"
    },
    {
        "date": "05.04.2017",
        "begin": "09:30:00",
        "end": "11:00:00",
        "author": "Igor Kuzminykh",
        "title": "JRebel: Make delivery faster"
    },
    {
        "date": "06.04.2017",
        "begin": "09:30:00",
        "end": "11:00:00",
        "author": "Sergey Larin",
        "title": "Java&C++. How to make friends?"
    },
    {
        "date": "06.04.2017",
        "begin": "17:30:00",
        "end": "19:00:00",
        "author": "Arina Nikolaeva",
        "title": "Mind mapping. Use your head to grow a tree!"
    },
    {
        "date": "07.04.2017",
        "begin": "09:30:00",
        "end": "11:00:00",
        "author": "Denis Sokolov and Margarita Vermenik",
        "title": "Morning coffee with director"
    },
    {
        "date": "07.04.2017",
        "begin": "17:30:00",
        "end": "19:00:00",
        "author": "Dmitrii Golikov",
        "title": "Happy with GraphQL"
    },
];

var rewriteTitle = function () {
    timetable.forEach(function (item) {
        if (item.date == new Date().toLocaleDateString()
            && item.begin <= new Date().toLocaleTimeString()
            && item.end >= new Date().toLocaleTimeString()) {
            if (document.querySelector(".title").innerHTML != "<p>" + item.title + "</p>") {
                $(".btn-like").removeAttr("disabled");
                $(".btn-dislike").removeAttr("disabled");
                document.querySelector(".title").innerHTML = "<p>" + item.title + "</p>";
            }
        }
    })
};

$(function () {
    if (new Date().toLocaleDateString() < timetable[0].date || new Date().toLocaleDateString() > timetable[timetable.length - 1].date
        || (new Date().toLocaleDateString() == timetable[0].date && new Date().toLocaleTimeString() < timetable[0].begin)) {
        document.querySelector(".title").innerHTML = "<p>" + "Пока еще активных докладов нет" + "</p>";
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
        db.ref("/like-app/it-week/" + randomValue).set({
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
        db.ref("/like-app/it-week/" + randomValue).set({
            "id": id,
            "type": "dislike",
            "cur_time": firebase.database.ServerValue.TIMESTAMP
            //"cur_time": new Date().toLocaleTimeString()
        });
    });
});