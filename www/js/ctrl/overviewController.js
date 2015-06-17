angular.module('starter.controllers')
    .controller('OverviewCtrl', function($ionicPlatform, $scope, ruterService, utilService, $cordovaDevice, $cordovaGeolocation) {

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
            console.log(dest);
            ruterService.getTravels($scope.home.id, dest.ID).success(function (data){
                dest.proposals = _.map(data.TravelProposals, function (item) {
                    return {
                        time : item.ArrivalTime,
                        line : item.Stages[0].LineID
                    }
                });
            });
        });


    });