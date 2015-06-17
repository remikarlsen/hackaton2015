angular.module('starter.controllers')
    .controller('OverviewCtrl', function($ionicPlatform, $scope, ruterService, utilService, $filter, $timeout, $cordovaDevice, $cordovaGeolocation) {
        $scope.firstChecked = $scope.secondChecked = true;

        $scope.home = {
            name : 'Majorstuen [T-bane]'
        };

        $scope.destinations = [{
            Name : 'Jernbanetorget'
        }, {
            Name : 'Veitvet'
        }];
    
        function setupStops(){       
            var myStops = ruterService.getMyStopsMap();
            console.log($scope.home.Name);
            $scope.home.desc = myStops[$scope.home.Name].desc;
            $scope.home.id = myStops[$scope.home.Name].ID;

            $scope.destinations = _.map($scope.destinations, function (dest) {
                dest.desc = myStops[dest.to.Name].desc;
                dest.ID = myStops[dest.to.Name].ID;
                return dest;
            });
        }

        $scope.updateDestinations = function () {
            _.each($scope.destinations, function (dest) {
                ruterService.getTravels($scope.home.id, dest.ID).success(function (data){
                    dest.proposals = _.map(data.TravelProposals, function (item) {
                        var differ = Math.abs(new Number(Math.ceil((new Date($filter('date')(item.DepartureTime, 'medium')).getTime() - $scope.roundSeconds(new Date()).getTime()) / 1000)));
                        var colorStep = 255 / differ;
                        var iconStep = 50 / differ;
                        return {
                            time : item.DepartureTime,
                            line : item.Stages[0].LineID,
                            diff : differ,
                            color : {
                                r: 0, g: 255, b: 20
                            },
                            colorHTML : 'rgb(0, 255, 0)',
                            colorStep : colorStep,
                            timeObj : $scope.getTime(differ),
                            iconSize : 30,
                            iconStep : iconStep,
                            iconHTML : '30px'
                        }
                    });
                });
            });
        };
       // $scope.updateDestinations();

        $scope.onCountDown = function () {

            $scope.destinations = _.map($scope.destinations, function(dest) {
                dest.proposals = _.filter(dest.proposals, function (props) {
                    if (props.diff === 0 || props.diff < 0) {
                        return false;
                    }
                    return true;
                });
                return dest;
            });

            _.each($scope.destinations, function(dest) {
                _.each(dest.proposals, function (props) {
                    if (props.diff !== 0) {
                        props.diff = props.diff - 1;
                        props.timeObj = $scope.getTime(props.diff);
                    }
                    if (!(props.iconSize >= 80)) {
                        props.iconSize = props.iconSize + props.iconStep;
                        props.iconHTML = props.iconSize + 'px';
                    }
                    props.colorHTML = $scope.getColor(props);
                });
            });
            countdown = $timeout($scope.onCountDown, 1000);
        };

        $scope.getColor = function (props) {
          props.color.r = (props.color.r !== 255 || props.color.r > 255) ? (props.color.r + props.colorStep) : props.color.r;
          props.color.g = (props.color.g !== 0 || props.color.g < 0) ? (props.color.g - props.colorStep) : props.color.g;
           return 'rgb('+Math.ceil(props.color.r) +','+Math.ceil(props.color.g)+','+Math.ceil(props.color.b)+')';
        };
        var countdown = $timeout($scope.onCountDown, 1000);

        $scope.getTime = function (time) {
            var hours = Math.floor(time / 60 / 60);
            var minutes = Math.floor((time - hours * 60 * 60) / 60);
            var seconds = Math.floor(time - hours * 60 * 60 - minutes * 60);
            return {
                hours : hours,
                minutes : minutes,
                seconds : seconds
            };
        };

        $scope.roundSeconds = function(date) {
            date.setSeconds(0);
            return date;
        };
        
        $scope.doRefresh = function () {
            $scope.updateDestinations();
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.visi = {
            first : true,
            second : true,
            settings : true
        };
        $scope.toggleVisi = function(group) {
           $scope.visi[group] = !$scope.visi[group];
        };        
       
        $scope.myTravels = ruterService.getMyTravels();
        $scope.myTravels = _.groupBy($scope.myTravels, function (item) {
            return item.from.desc;
        });

        var myStopsArr = ruterService.getMyStops();//get array, not map
        ruterService.getStopInfo(myStopsArr).then(function (data) {
            $scope.myStopsArr = _.map(myStopsArr, function (stop) {
                return _.extend(stop, _.findWhere(data, {ID: stop.ID}));
            });
        });

        function getClosestStop() {
            _.each(myStopsArr, function (stop) {
                var distanceToStop = utilService.getDistance($scope.currentPosition, stop.geoPosition);
                _.extend(stop, {"distanceToStop": distanceToStop});
            });
            $scope.closestStop = _.min(myStopsArr, function (stop) {
                return stop.distanceToStop;
            });
            if ($scope.closestStop) {
                //Hent ut destinasjoner for nærmeste stopp og dekorer destinations med
                $scope.home.Name = $scope.closestStop.Name;
                console.log($scope.closestStop);
                $scope.tmp = _.map($scope.myTravels[$scope.closestStop.desc], function (item) {
                    return item.to.desc;
                });
            }
        }

        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $scope.currentPosition = {};
        $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.currentPosition.latitude = position.coords.latitude;
                    $scope.currentPosition.longitude = position.coords.longitude;
                    if (myStopsArr) {
                        getClosestStop();
                    }
                    //prepare stops based on closest stop
                    console.log($scope.myTravels);
                    $scope.destinations = $scope.myTravels[$scope.closestStop.desc];
                    //console.log($scope.destinations);
                    setupStops();                  
                    $scope.updateDestinations();

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
                    if (myStopsArr) {
                        getClosestStop();
                    }
                });
        watch.clearWatch();              

    });