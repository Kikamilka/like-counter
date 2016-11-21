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

myAppModule.controller("BarCtrl", function ($scope, $firebaseObject, $firebaseArray) {
    var firstArray = [];
    var secondArray = [];
    const ref = firebase.database().ref("/like-app/info/");

    //$scope.items = $firebaseArray(ref);
    $scope.labels = [];
    $scope.series = ['like', 'dislike'];

    timetable.forEach(report => {
        //console.log(report.begin);
        ref.once('value', function (snapshot) {
            var like = 0;
            var dislike = 0;
            var id_voice = [];
            snapshot.forEach(function (childSnapshot) {
                if ((childSnapshot.val().cur_time >= report.begin) && (childSnapshot.val().cur_time <= report.end)) {
                    if (!in_array(childSnapshot.val().id, id_voice)) {
                        if (childSnapshot.val().type == "like") {
                            like++;
                        }
                        else {
                            dislike++;
                        }
                        id_voice.push(childSnapshot.val().id);
                        console.log(childSnapshot.val().id, report.begin, report.end, childSnapshot.val().type, like, dislike);
                    }
                    else {
                        // todo Проверить даты обновления, если новая позже,то изменить на нее!
                    }
                }
            });
            firstArray.push(like);
            secondArray.push(dislike);
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
    $scope.colors = [{
        backgroundColor: "#10C033",
        pointBackgroundColor: "rgba(159,204,0, 1)",
        pointHoverBackgroundColor: "rgba(159,204,0, 0.8)",
        borderColor: "rgba(159,204,0, 1)",
        borderWidth: 2,
        pointBorderColor: '#fff',
        pointHoverBorderColor: "rgba(159,204,0, 1)"
    }, '#CB0233', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
});
