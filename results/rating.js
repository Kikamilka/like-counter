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
var config = {
    apiKey: "AIzaSyAxq2kfdo0cNRLZcYaRp4ZJMx_s9hXE3YE",
    authDomain: "likecounter-b8d5a.firebaseapp.com",
    databaseURL: "https://likecounter-b8d5a.firebaseio.com",
    storageBucket: "likecounter-b8d5a.appspot.com",
    messagingSenderId: "897523997760"
};
firebase.initializeApp(config);

var myAppModule = angular.module("app", ["chart.js", "firebase"]);

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
    var like = 0;
    var dislike = 0;
    var voices_id_type = [];
    snapshot.forEach(function (childSnapshot) {
        if ((new Date(childSnapshot.val().cur_time).toLocaleTimeString() >= report.begin)
            && (new Date(childSnapshot.val().cur_time).toLocaleTimeString() <= report.end)) {
            if (!in_array(childSnapshot.val().id, voices_id_type)) {
                if (childSnapshot.val().type == "like") {
                    like++;
                }
                else {
                    dislike++;
                }
                voices_id_type.push(childSnapshot.val().id);
                voices_id_type.push(childSnapshot.val().type);
                voices_id_type.push(childSnapshot.val().cur_time);
                //console.log(childSnapshot.val().id, report.begin, report.end, childSnapshot.val().type, like,
                // dislike);
            }
            else {
                var index = index_type_in_array(childSnapshot.val().id, voices_id_type);
                if (childSnapshot.val().cur_time > voices_id_type[index+1]) {
                    voices_id_type[index+1] = childSnapshot.val().cur_time;
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
                }
                //console.log(childSnapshot.val().id, report.begin, report.end, childSnapshot.val().type, like,
                // dislike);
            }
        }
    });
    return {like: like, dislike: dislike};
};

myAppModule.controller("BarCtrl", function ($scope, $firebaseObject, $firebaseArray) {
    var stepSizeValue = 2;
    $scope.series = ['like', 'dislike'];
    const ref = firebase.database().ref("/like-app/it_night/");
    var syncObject = $firebaseObject(ref);
    ref.on('value', function (snapshot) {
        var firstArray = [];
        var secondArray = [];
        $scope.labels = [];
        timetable.forEach(report => {
            //console.log(report.begin);
            var __ret = countVoiceFromDB(snapshot, report);
            firstArray.push(__ret.like);
            secondArray.push(__ret.dislike);
            if (firstArray.length > 36 || secondArray.length > 36) {
                stepSizeValue = 4;
            }
            $scope.labels.push(report.title);
            $scope.data = [
                firstArray,
                secondArray
            ];
        });
    });
    //syncObject.$bindTo($scope, "data");

    $scope.options = {
        legend: {
            display: false,
            type: "category",
            position: 'bottom',
            labels: {
                fontSize: 18,
                fontColor: "black",
                boxWidth: 60,
                padding: 20
            }
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        fontSize: 24,
                        fontColor: "black",
                        stepSize: stepSizeValue
                    },
                    gridLines: {
                        zeroLineColor: "black",
                        zeroLineWidth: 2
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        // наименования докладов
                        fontColor: "black",
                        fontSize: 24
                    },
                    gridLines: {
                        lineWidth: 4,
                        offsetGridLines: true
                    }
                }
            ]
        }
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
