angular.module('ui.bootstrap').controller('CollapseDemoCtrl', function ($scope) {
  // $scope.isNavCollapsed = true;
  // $scope.isCollapsed = false;
  // $scope.isCollapsedHorizontal = false;
});




angular.module('ui.bootstrap').controller('ButtonsCtrl', function ($scope) {
  $scope.singleModel = 1;

  $scope.radioModel = 'Middle';

  $scope.checkModel = {
    left: false,
    middle: true,
    right: false
  };

  $scope.checkResults = [];

  $scope.$watchCollection('checkModel', function () {
    $scope.checkResults = [];
    angular.forEach($scope.checkModel, function (value, key) {
      if (value) {
        $scope.checkResults.push(key);
      }
    });
  });
});

