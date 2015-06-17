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
                    return {
                        time : item.ArrivalTime,
                        line : item.Stages[0].LineID,
                        diff : new Number(Math.ceil((new Date($filter('date')(item.ArrivalTime, 'medium')).getTime() - new Date().getTime()) / 1000))
                    }
                });
            });
        });

        $scope.onCountDown = function () {
            $scope.destinations = _.each($scope.destinations, function(dest) {
                _.each(dest.proposals, function (props) {
                    props.diff = props.diff - 1;
                });
            });
            countdown = $timeout($scope.onCountDown, 1000);
        };

        var countdown = $timeout($scope.onCountDown, 1000);

    });