var timetable = [
    {
        "begin": "19:45:00",
        "end": "19:59:59",
        "author": "Денис Соколов",
        "title": "Открытие конференции"
    },
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
var config = {
    apiKey: "AIzaSyAxq2kfdo0cNRLZcYaRp4ZJMx_s9hXE3YE",
    authDomain: "likecounter-b8d5a.firebaseapp.com",
    databaseURL: "https://likecounter-b8d5a.firebaseio.com",
    storageBucket: "likecounter-b8d5a.appspot.com",
    messagingSenderId: "897523997760"
};
firebase.initializeApp(config);

var myAppModule = angular.module("app", ["chart.js", "firebase"]).config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    /*ChartJsProvider.setOptions({
     chartColors: ['#10C033', '#CB0233'],
     responsive: true
     });*/
}]);

function in_array(value, array) {
    if (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }
    return false;
}

function index_type_in_array(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return i + 1;
        }
    }
}

var countVoiceFromDB = function (snapshot, report) {
    console.log(report.begin);
    var like = 0;
    var dislike = 0;
    var voices_id_type = [];
    snapshot.forEach(function (childSnapshot) {
        if ((childSnapshot.val().cur_time >= report.begin) && (childSnapshot.val().cur_time <= report.end)) {
            if (!in_array(childSnapshot.val().id, voices_id_type)) {
                if (childSnapshot.val().type == "like") {
                    like++;
                }
                else {
                    dislike++;
                }
                voices_id_type.push(childSnapshot.val().id);
                voices_id_type.push(childSnapshot.val().type);
                console.log(childSnapshot.val().id, report.begin, report.end, childSnapshot.val().type, like, dislike);
            }
            else {
                var index = index_type_in_array(childSnapshot.val().id, voices_id_type);
                if (childSnapshot.val().type != voices_id_type[index]) {
                    voices_id_type[index] = childSnapshot.val().type;
                    if (childSnapshot.val().type == "like") {
                        like++;
                        dislike--;
                    }
                    else {
                        like--;
                        dislike++;
                    }
                }
                console.log(childSnapshot.val().id, report.begin, report.end, childSnapshot.val().type, like, dislike);
            }
        }
    });
    return {like: like, dislike: dislike};
};
myAppModule.controller("BarCtrl", function ($scope, $firebaseObject, $firebaseArray) {
    var firstArray = [];
    var secondArray = [];
    const ref = firebase.database().ref("/like-app/info/");

    //$scope.items = $firebaseArray(ref);
    $scope.labels = [];
    $scope.series = ['like', 'dislike'];

    timetable.reverse().forEach(report => {
        console.log(report.begin);
        ref.once('value', function (snapshot) {
            var __ret = countVoiceFromDB(snapshot, report);
            firstArray.push(__ret.like);
            secondArray.push(__ret.dislike);
            $scope.labels.push(report.title);
            $scope.$apply(function () {
                $scope.data = [
                    firstArray,
                    secondArray
                ];
            });
        });
    });
    $scope.options = {
        legend: {
            display: true,
            position: 'bottom',
        },
        defaultFontColor: "black",
        defaultFontSize: 20
    };
    $scope.colors = [
        {
            backgroundColor: "#4ebc38",
            pointBackgroundColor: "#e8e806",
            pointHoverBackgroundColor: "#409b2e",
            borderColor: "#339320",
            borderWidth: 2,
            pointBorderColor: '#339320',
            pointHoverBorderColor: "#339320"
        },
        {
            backgroundColor: "#c11d1d",
            pointBackgroundColor: "#e8e806",
            pointHoverBackgroundColor: "#ba0909",
            borderColor: "#8c0808",
            borderWidth: 2,
            pointBorderColor: '#8c0808',
            pointHoverBorderColor: "#8c0808"
        }];
});
