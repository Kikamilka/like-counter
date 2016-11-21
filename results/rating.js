var myAppModule = angular.module("app", ["chart.js"]);

myAppModule.controller("BarCtrl", function ($scope) {
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];
    console.log(firstArray);
    $scope.data = [
        [firstArray[0], firstArray[1]],
        [secondArray[0], secondArray[1]]
    ];
});