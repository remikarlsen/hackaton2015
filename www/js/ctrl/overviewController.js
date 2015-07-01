angular.module('starter.controllers')
    .controller('OverviewCtrl', function($ionicPlatform, $scope, ruterService, utilService, $filter, $timeout, $cordovaDevice, $cordovaGeolocation, $ionicLoading) {
      
        $scope.firstChecked = $scope.secondChecked = true;
        $scope.home = {};
        $scope.destinations = [];
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $scope.myTravels = ruterService.getMyTravels();
        $scope.myTravels = _.groupBy($scope.myTravels, function (item) {
            return item.from.desc;
        });
        
       function main(){
            getStopInfo();
            getClosestStop();
            $scope.destinations = $scope.myTravels[$scope.closestStop.desc];
            setupStops();                  
            $scope.updateDestinations();
            $scope.hide();           
       } 
       
       function getStopInfo(){
           var myStopsArr = ruterService.getMyStops();//get array, not map
           //Når oppslag på stoppene er ferdig, utvid stopp-dataene
            ruterService.getStopInfo(myStopsArr).then(function (data) {
                  $scope.myStopsArr = _.map(myStopsArr, function (stop) {
                    return _.extend(stop, _.findWhere(data, {ID: stop.ID}));
                });
            }, function(reason){
                reason.ctrlFunc = "getMyStops";
                $scope.err = reason;
            });
        }
       
        function setupStops(){       
            var myStops = ruterService.getMyStopsMap();
            console.log($scope.home.Name);
            $scope.home.desc = myStops[$scope.home.Name].desc;
            $scope.home.id = myStops[$scope.home.Name].ID;
            
            $scope.destinations = _.map($scope.destinations, function (dest) {
                if(!dest || !dest.to || !dest.to.Name){
                    $scope.err = 'Problemer med dest.to!';
                }
                var stop = myStops[dest.to.Name];
                
                if(!stop){//TODO: SKanky hack
                    stop = myStops['Jernbanetorget [T-bane]'];
                    $scope.err = 'Stop mangler, bruker hack/Jernbanetorget!';
                }
                else{
                    $scope.err = null;
                }
                dest.desc = stop.desc;
                dest.ID = stop.ID;
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
                        };
                    });
                    $scope.err = null;
                }, function(reason){
                    reason.ctrlFunc = "getTravels";
                    $scope.err = reason;
                });
            });
        };

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
   
        function getClosestStop() {
            var myStopsArr = ruterService.getMyStops();//get array, not map
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
                
                if(!$scope.home.Name){//Debug
                    $scope.home.Name = 'Majorstuen [T-bane]';
                }   
            }
            else{
                $scope.err = 'closestStop er udef';
                console.log("ERROR - closestStop er udef!");
            }
        }       
        
       function getPosition(){
        $scope.currentPosition = {};
        $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {                   
                    $scope.currentPosition.latitude = position.coords.latitude;
                    $scope.currentPosition.longitude = position.coords.longitude;
                    main();
                    $scope.err = null;
                }, function (reason) {
                    reason.ctrlFunc = "getCurrentPosition";
                    $scope.err = reason;
                });
            }
            getPosition();

        var geoWatchOptions = {
            frequency: 1000,
            timeout: 3000,
            enableHighAccuracy: false // may cause errors if true
        };
        var watch = $cordovaGeolocation.watchPosition(geoWatchOptions);
        watch.then(
                null,
                function (reason) {
                    reason.ctrlFunc = "watch.getCurrentPosition";
                    $scope.err = reason;
                },
                function (position) {
                    console.log('GEO watched!');
                    $scope.currentPosition.latitude = position.coords.latitude;
                    $scope.currentPosition.longitude = position.coords.longitude;
                    main();
                    $scope.err = null;
                });
        watch.clearWatch();    
        
    
        //GUI util stuff
        $scope.getColor = function (props) {
          props.color.r = (props.color.r !== 255 || props.color.r > 255) ? (props.color.r + props.colorStep) : props.color.r;
          props.color.g = (props.color.g !== 0 || props.color.g < 0) ? (props.color.g - props.colorStep) : props.color.g;
           return 'rgb('+Math.ceil(props.color.r) +','+Math.ceil(props.color.g)+','+Math.ceil(props.color.b)+')';
        };
        var countdown = $timeout($scope.onCountDown, 1000);

        $scope.getTime = function(time){
            return utilService.getTime(time);
        };

        $scope.roundSeconds = function(date) {
            date.setSeconds(0);
            return date;
        };
        
        $scope.doRefresh = function () {
            getPosition();
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
        
        //Spinner etc
        $scope.show = function() {
          $scope.loadingCompleted=false;
          /*
          $ionicLoading.show({
            template: 'Loading...'
          });
          */
        };
        $scope.hide = function(){
          $scope.loadingCompleted=true;
          //$ionicLoading.hide();
        };
        $scope.show();        

    });