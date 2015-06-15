var mobamasStatusPt = angular.module('mobamasStatusPt', ['ngStorage']);

mobamasStatusPt.config([
  '$interpolateProvider', '$localStorageProvider',
  function($interpolateProvider, $localStorageProvider) {
    $localStorageProvider.namespace('mobamasStatusPt.');
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
  }
]);

// localStorageに保存するユーザー別設定のデフォルト値
mobamasStatusPt.constant('defaultSettings', {
  level: 100,
  stamina: 83,
  attack: 64,
  defence: 63,
  unassignedPt: 0,
  newStaminaPt: 0,
  newAttackPt: 0,
  newDefencePt: 0
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

  var updateTotalPt = function() {
    var min = {
      stamina: 10,
      attack: 10,
      defence: 10,
      unassignedPt: 0
    };

    Object.keys(min).forEach(function(key) {
      if ($scope.$storage[key] < this[key]) {
        $scope.$storage[key] = this[key];
      }
    }, min);

    var staminaPt = $scope.$storage.stamina - $scope.baseStamina;
    var attackPt = $scope.$storage.attack - $scope.baseAttack;
    var defencePt = $scope.$storage.defence - $scope.baseDefence;
    $scope.totalPt = staminaPt + attackPt + defencePt + $scope.$storage.unassignedPt;
  };

  var updateNewStatus = function() {
    var min = {
      newStaminaPt: 0,
      newAttackPt: 0,
      newDefencePt: 0
    };

    Object.keys(min).forEach(function(key) {
      if ($scope.$storage[key] < this[key]) {
        $scope.$storage[key] = this[key];
      }
    }, min);

    $scope.newStamina = $scope.baseStamina + $scope.$storage.newStaminaPt;
    $scope.newAttack = $scope.baseAttack + $scope.$storage.newAttackPt;
    $scope.newDefence = $scope.baseDefence + $scope.$storage.newDefencePt;
    $scope.differencePt = $scope.totalPt -
      $scope.$storage.newStaminaPt -
      $scope.$storage.newAttackPt -
      $scope.$storage.newDefencePt;
  };

  var updateBaseStatus = function() {
    if ($scope.$storage.level < 1) {
      $scope.$storage.level = 1;
    }

    $scope.baseStamina = calcBaseStamina($scope.$storage.level);
    $scope.baseAttack = calcBaseAttack($scope.$storage.level);
    $scope.baseDefence = calcBaseDefence($scope.$storage.level);

    updateTotalPt();
    updateNewStatus();
  };

  $scope.$watch('$storage.level',
    function() {
      if ($scope.calcStatusPt.$valid) {
        updateBaseStatus();
      }
    }
  );

  $scope.$watchCollection(
    function() {
      return [
        $scope.$storage.stamina,
        $scope.$storage.attack,
        $scope.$storage.defence,
        $scope.$storage.unassignedPt
      ];
    },
    function() {
      if ($scope.calcStatusPt.$valid) {
        updateTotalPt();
      }
    }
  );

  $scope.$watchCollection(
    function() {
      return [
        $scope.$storage.newStaminaPt,
        $scope.$storage.newAttackPt,
        $scope.$storage.newDefencePt
      ];
    },
    function() {
      if ($scope.newStatusPt.$valid) {
        updateNewStatus();
      }
    }
  );
}]);
