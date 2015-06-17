angular.module('starter.controllers', [])

        .controller('DashCtrl', function ($ionicPlatform, $scope, ruterService, utilService, $cordovaDevice, $cordovaGeolocation) {           
            /* 
             * NB: Fungerer kun i simulator og på device
             $ionicPlatform.ready(function() {          
             var device = $cordovaDevice.getDevice();
             $scope.manufacturer = device.manufacturer;
             $scope.model = device.model;
             $scope.platform = device.platform;
             $scope.uuid = device.uuid;      
             });
             */
            ruterService.getPing().success(function (data) {
                $scope.pingresponse = data;
            });

            ruterService.getTravels('3010200', '3010011', '').success(function (data) {
                $scope.majorstuenToJernbanetorget = data;
            });

            $scope.MyDestinations = ruterService.getMyDestinations();
            $scope.myTravels = ruterService.getMyTravels();
            $scope.myTravels = _.groupBy($scope.myTravels, function (item) {
                return item.to.desc;
            });

            var myStops = ruterService.getMyStops();

            //DEBUG
            var myStops = [{ID: 3010200, test: 'a'}, {ID: 3010011, test: 'b'}, {ID: 3011910, test: 'c'}];
            
            ruterService.getStopInfo(myStops).then(function (data) {
                $scope.myStops = _.map(myStops, function (stop) {
                    return _.extend(stop, _.findWhere(data, {ID: stop.ID}));
                });
            });

            var start = {
                latitude: 38.898556,
                longitude: -77.037852
            };

            var end = {
                latitude: 38.897147,
                longitude: -77.043934
            };

            $scope.distance = utilService.getDistance(start, end);

            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $scope.currentPosition = {};
            $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        $scope.currentPosition.latitude = position.coords.latitude;
                        $scope.currentPosition.longitude = position.coords.longitude;
                    }, function (err) {
                        // error
                    });

            var watchOptions = {
                frequency: 1000,
                timeout: 3000,
                enableHighAccuracy: false // may cause errors if true
            };

            var watch = $cordovaGeolocation.watchPosition(watchOptions);
            watch.then(
                    null,
                    function (err) {
                        // error
                    },
                    function (position) {
                        $scope.currentPosition.latitude = position.coords.latitude;
                        $scope.currentPosition.longitude = position.coords.longitude;
                    });

            watch.clearWatch();

        })

        .controller('ChatsCtrl', function ($scope, Chats) {
            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //
            //$scope.$on('$ionicView.enter', function(e) {
            //});

            $scope.chats = Chats.all();
            $scope.remove = function (chat) {
                Chats.remove(chat);
            };
        })

        .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
            $scope.chat = Chats.get($stateParams.chatId);
        })

        .controller('AccountCtrl', function ($scope) {
            $scope.settings = {
                enableFriends: true
            };
        });
