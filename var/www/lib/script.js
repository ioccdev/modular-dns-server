var app = angular.module("app", ["ngMaterial"]);

app.config(function($mdThemingProvider){

    $mdThemingProvider.definePalette('p1', {
        '50': 'e4f7f3',
        '100': 'baebe1',
        '200': '8ddece',
        '300': '5fd0ba',
        '400': '3cc6ab',
        '500': '1abc9c',
        '600': '17b694',
        '700': '13ad8a',
        '800': '0fa580',
        '900': '08976e',
        'A100': 'c3ffec',
        'A200': '90ffdc',
        'A400': '5dffcc',
        'A700': '44ffc4',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
          '50',
          '100',
          '200',
          '300',
          '400',
          '500',
          '600',
          'A100',
          'A200',
          'A400',
          'A700'
        ],
        'contrastLightColors': [
          '700',
          '800',
          '900'
        ]
      });

      $mdThemingProvider.theme('default').primaryPalette('p1')

});

app.controller("all", function($scope, $http){

    $scope.checkStatus = function(domain){

        $scope.status = { status: "" };

        $http.get("/rest/status/" + domain).then(function(res, err){
            $scope.status = res.data;
        });
    }

    $scope.addDomain = function(domain){

        $scope.status2 = { status: "" };

        $http.get("/rest/add/" + domain).then(function(res, err){
            $scope.status2 = res.data;
        });
    }

    $scope.removeDomain = function(domain){

        $scope.status3 = { status: "" };

        $http.get("/rest/remove/" + domain).then(function(res, err){
            $scope.status3 = res.data;
        });
    }

})