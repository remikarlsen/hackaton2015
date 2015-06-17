angular.module('starter.controllers')
    .controller('OverviewCtrl', function($ionicPlatform, $scope, ruterService, $filter, $timeout, $cordovaDevice, $cordovaGeolocation) {

        $scope.home = {
            name : 'Majorstuen'
        };

        $scope.destinations = [{
            name : 'Jernbanetorget'
        }, {
            name : 'Veitvedt'
        }];

        var myStops = ruterService.getMyStopsMap();
        $scope.home.desc = myStops[$scope.home.name].desc;
        $scope.home.id = myStops[$scope.home.name].ID;

        $scope.destinations = _.map($scope.destinations, function (dest) {
                dest.desc = myStops[dest.name].desc;
                dest.ID = myStops[dest.name].ID;
            return dest;
        });

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
        }
    });