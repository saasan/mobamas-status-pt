var mobamasStatusPt = angular.module('mobamasStatusPt', ['ngStorage']);

// localStorageに保存するユーザー別設定のデフォルト値
mobamasStatusPt.constant('defaultSettings', {
  level: 100,
  stamina: 83,
  attack: 64,
  defence: 63
});

mobamasStatusPt.controller('MainController', ['$scope', '$localStorage', 'defaultSettings', function($scope, $localStorage, defaultSettings) {
  'use strict';

  // ストレージから設定を読み込む
  $scope.$storage = $localStorage.$default(defaultSettings);

  var calcBaseStamina = function(lv) {
    if (lv >= 60) {
      return 50 + Math.floor(lv / 3);
    }
    else if (lv >= 22) {
      return 30 + Math.floor((lv - 1) / 3) * 2 + ((lv - 1) % 3);
    }
    else if (lv >= 16) {
      return 23 + lv;
    }

    return 10 + (lv - 1) * 2;
  };

  var calcBaseAttack = function(lv) {
    if (lv >= 60) {
      return 30 + Math.floor((lv + 2) / 3);
    }
    else if (lv >= 22) {
      return 12 + Math.floor((lv - 2) / 3) * 2 + ((lv - 2) % 3);
    }
    else if (lv >= 11) {
      return 14 + Math.floor(lv / 2) + (lv % 2);
    }

    return 9 + lv;
  };

  var calcBaseDefence = function(lv) {
    if (lv >= 60) {
      return 30 + Math.floor((lv + 1) / 3);
    }
    else if (lv >= 22) {
      return 10 + Math.floor(lv / 3) * 2 + (lv % 3);
    }
    else if (lv >= 11) {
      return 14 + Math.floor((lv - 1) / 2) + ((lv - 1) % 2);
    }

    return 9 + lv;
  };

  var update = function() {
    $scope.baseStamina = calcBaseStamina($scope.$storage.level);
    $scope.baseAttack = calcBaseAttack($scope.$storage.level);
    $scope.baseDefence = calcBaseDefence($scope.$storage.level);
    $scope.staminaPt = $scope.$storage.stamina - $scope.baseStamina;
    $scope.attackPt = $scope.$storage.attack - $scope.baseAttack;
    $scope.defencePt = $scope.$storage.defence - $scope.baseDefence;
    $scope.totalPt = $scope.staminaPt + $scope.attackPt + $scope.defencePt;
  };

  update();

  $scope.$watchCollection(
    function() {
      return [
        $scope.$storage.level,
        $scope.$storage.stamina,
        $scope.$storage.attack,
        $scope.$storage.defence
      ];
    },
    function() {
      if ($scope.calcStatusPt.$valid) {
        update();
      }
    }
  );
}]);
