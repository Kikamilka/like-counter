var timetable = [
    {
        "date": "03.04.2017",
        "begin": "09:30:00",
        "end": "11:00:00",
        "author": "Arina Nikolaeva",
        "title": "EPAM Training – Why we do eLearning"
    },
    {
        "date": "03.04.2017",
        "begin": "17:30:00",
        "end": "19:00:00",
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
        if ((new Date(childSnapshot.val().cur_time).toLocaleDateString() == report.date)
            && (new Date(childSnapshot.val().cur_time).toLocaleTimeString() >= report.begin)
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
    $scope.series = ['like', 'dislike'];
    const ref = firebase.database().ref("/like-app/it-week/");
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
                        stepSize: 2
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
                        fontSize: 20
                    },
                    gridLines: {
                        lineWidth: 5,
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
