var config = {
    apiKey: "AIzaSyAxq2kfdo0cNRLZcYaRp4ZJMx_s9hXE3YE",
    authDomain: "likecounter-b8d5a.firebaseapp.com",
    databaseURL: "https://likecounter-b8d5a.firebaseio.com",
    storageBucket: "likecounter-b8d5a.appspot.com",
    messagingSenderId: "897523997760"
};
var firstArray = [];
var secondArray = [];
firebase.initializeApp(config);
const db = firebase.database();
db.ref("/like-app/info/").once('value', function (snapshot) {
    var like = 0;
    var dislike = 0;
    snapshot.forEach(function (childSnapshot) {
        var date_ex = new Date();
        date_ex.setHours(17, 30, 0, 0);
        if (childSnapshot.val().cur_time > date_ex.toLocaleTimeString()) {
            if (childSnapshot.val().type == "like") {
                like++;
            }
            else {
                dislike++;
            }
            console.log(childSnapshot.val().type, like, dislike);
        }
    });
    firstArray.push(like);
    secondArray.push(dislike);
    firstArray.push(10);
    secondArray.push(4);
    console.log(firstArray, secondArray);
});
