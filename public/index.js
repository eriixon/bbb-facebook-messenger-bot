(function(){
    var app = angular.module('bot', []);

app.controller('RegForm', function ($scope,$http) {
    $scope.message = "Baaaaaaaa";
    $scope.addPage = function(page){
        if(!page.got) {
            $http.put('/setPage', page).then(successCallback, errorCallback);
        } else console.log("*** It's a bot. I don't need this messsage ***");

        function successCallback(res) {
            // console.log(data);
            $scope.page = {};
            $scope.message = (res.data == "DONE")? "Data entered into the database": "Wrong Password - try again";
            (function(){$('#showMessage').modal('show');})();
        };
        function errorCallback(err) {
            console.log(err)
        };
    }
});
})();