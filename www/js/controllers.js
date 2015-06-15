angular.module('starter.controllers', [])

.controller('DashCtrl', function($ionicPlatform, $scope, ruterService, $cordovaDevice, $cordovaGeolocation) {
	$scope.pingresponse = "Test";

/*
    ruterService.getPing().success(function(data){
    	$scope.pingresponse = data;
	});

    ruterService.getTravels('3010200', '3010011', 5).success(function(data){
    	$scope.majorstuenToJernbanetorget = data;
	});	

		
	$scope.MyDestinations = ruterService.getMyDestinations();
	$scope.myTravels = ruterService.getMyTravels();
	$scope.myTravels = _.groupBy($scope.myTravels, function(item){return item.to.desc});
	
	
	$ionicPlatform.ready(function() {
            // getting device infor from $cordovaDevice
            var device = $cordovaDevice.getDevice();
            $scope.manufacturer = device.manufacturer;
            $scope.model = device.model;
            $scope.platform = device.platform;
            $scope.uuid = device.uuid;      
    });
	*/

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $scope.pos = {};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.pos.latitude  = position.coords.latitude
      $scope.pos.longitude = position.coords.longitude
    }, function(err) {
      // error
    });

  var watchOptions = {
    frequency : 1000,
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      $scope.pos.latitude  = position.coords.latitude
      $scope.pos.longitude = position.coords.longitude
  });

  watch.clearWatch();
	
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
