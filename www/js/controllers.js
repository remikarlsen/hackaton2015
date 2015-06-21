angular.module('starter.controllers', [])

        .controller('DashCtrl', function ($ionicPlatform, $scope, ruterService, utilService, $cordovaDevice, $cordovaGeolocation) {
            $scope.tmp = "It is alive!";
            ruterService.getPing().then(function (data) {
                $scope.tmp = data.data;
            });
            
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
/*
            $scope.MyDestinations = ruterService.getMyDestinations();
            $scope.myTravels = ruterService.getMyTravels();
            $scope.myTravels = _.groupBy($scope.myTravels, function (item) {
                return item.from.desc;
            });

            var myStops = ruterService.getMyStops();//get map
            //Hent mer mer stoppdata fra Ruter og dekorer objektet.
            //Trenger X og Y-posisjon dersom man ikke vil hardkode dette       
            ruterService.getStopInfo(myStops).then(function (data) {
                $scope.myStops = _.map(myStops, function (stop) {
                    return _.extend(stop, _.findWhere(data, {ID: stop.ID}));
                });
            });

            function getClosestStop() {
                _.each(myStops, function (stop) {
                    var distanceToStop = utilService.getDistance($scope.currentPosition, stop.geoPosition);
                    _.extend(stop, {"distanceToStop": distanceToStop});
                });
                $scope.closestStop = _.min(myStops, function(stop){return stop.distanceToStop;});
            }

            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $scope.currentPosition = {};
            $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        $scope.currentPosition.latitude = position.coords.latitude;
                        $scope.currentPosition.longitude = position.coords.longitude;
                        if (myStops) {
                            getClosestStop();
                        }
                        
                    }, function (err) {
                        // error
                    });

            var geoWatchOptions = {
                frequency: 1000,
                timeout: 3000,
                enableHighAccuracy: false // may cause errors if true
            };
            var watch = $cordovaGeolocation.watchPosition(geoWatchOptions);
            watch.then(
                    null,
                    function (err) {
                        // error
                    },
                    function (position) {
                        $scope.currentPosition.latitude = position.coords.latitude;
                        $scope.currentPosition.longitude = position.coords.longitude;
                        if (myStops) {
                            getClosestStop();
                        }
                    });
            watch.clearWatch();
*/
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
