angular.module('starter.controllers')
    .controller('OverviewCtrl', function($ionicPlatform, $scope, ruterService, utilService, $cordovaDevice, $cordovaGeolocation) {

        $scope.home = {
            name : 'Majorstuen'
        };

        $scope.destinations = [{
            name : 'Jernbanetorget'
        }, {
            name : 'Rodtvedt'
        }];

        var myStops = ruterService.getMyStops();

        $scope.home.desc = myStops[$scope.home.name].desc;
        $scope.home.id = myStops[$scope.home.name].id;

        $scope.destinations = _.map($scope.destinations, function (dest) {
                dest.desc = myStops[dest.name].desc;
                dest.id = myStops[dest.name].id;
            return dest;
        });

        _.each($scope.destinations, function (dest) {
            ruterService.getTravels($scope.home.id, dest.id).success(function (data){
                dest.proposals = _.map(data.TravelProposals, function (item) {
                    return {
                        time : item.ArrivalTime,
                        line : item.Stages[0].LineID
                    }
                });
            });
        });


    });