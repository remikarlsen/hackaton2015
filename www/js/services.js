angular.module('starter.services', [])

        .factory('ruterService', function ($http, $q, $filter, ApiPlace, ApiTravel, Apiheartbeat) {

            var MyDestinations = {
                HJEM: 'Hjem',
                JOBB: 'Jobb',
                SKOLE: 'Skole'  
            };

            var myStops = {};
            myStops['Majorstuen [T-bane]'] = {ID: 3010200, desc: MyDestinations.HJEM, geoPosition:{latitude:59.930264,longitude:10.714609}};
            myStops['Jernbanetorget [T-bane]'] = {ID: 3010011, desc: MyDestinations.JOBB, geoPosition:{latitude:59.911856,longitude:10.751199}};
            myStops['Veitvet [T-bane]'] = {ID: 3012040, desc: MyDestinations.SKOLE, geoPosition:{latitude:59.944405,longitude:10.846672}};

            var myTravels = [
                {name: 'majorstuenToJernbanetorget', from: myStops['Majorstuen [T-bane]'], to: myStops['Jernbanetorget [T-bane]']},
                {name: 'veitvedtToJernbanetorget', from: myStops['Veitvet [T-bane]'], to: myStops['Jernbanetorget [T-bane]']},
                {name: 'jernbanetorgetToVeitvedt', from: myStops['Jernbanetorget [T-bane]'], to: myStops['Veitvet [T-bane]']},
                {name: 'majorstuenToVeitvedt', from: myStops['Majorstuen [T-bane]'], to: myStops['Veitvet [T-bane]']},
                {name: 'jernbanetorgetToMajorstuen', from: myStops['Jernbanetorget [T-bane]'], to: myStops['Majorstuen [T-bane]']},
                {name: 'veitvedtToMajorstuen', from: myStops['Veitvet [T-bane]'], to: myStops['Majorstuen [T-bane]']}
            ];

            return {
                getStopInfo: function (stops) {
                    var promises = stops.map(function (stop) {
                        var deffered = $q.defer();
                        $http({
                            url: ApiPlace.url + '/GetStop/' + stop.ID + '?json=true',
                            method: 'GET'
                        }).
                                success(function (data) {
                                    deffered.resolve(data);
                                }).
                                error(function (error) {
                                    deffered.reject();
                                });
                        return deffered.promise;
                    });
                    return $q.all(promises);
                },
                getMyStops: function () {
                    return _.map(myStops, function(stop){
                        return stop;
                    });
                },
                getMyStopsMap: function () {
                  return myStops;
                },
                getPing: function () {
                    return $http({
                        url: Apiheartbeat.url + '/index?json=true',
                        method: 'GET'
                    });
                },
                getMyTravels: function () {
                    return myTravels;
                },
                getMyDestinations: function () {
                    return MyDestinations;
                },
                getTravels: function (from, to) {
                    var dateFilter = $filter('date');
                    var filteredDate = dateFilter(new Date(), 'ddMMyyyyHHmmss');
                    return $http({
                        url: ApiTravel.url + '/GetTravels?fromplace=' + from + '&toplace=' + to + '&isafter=true&proposals=3&transporttypes=8',
                        method: 'GET'
                    });
                }
            };
        })

        .factory('utilService', function () {
            var toRad = function (num) {
                return num * Math.PI / 180;
            };

            return{//Haversine-algoritme
                getDistance: function (start, end) {
                    var EARTH_RADIUS_KM = 6371;
                    var dLat = toRad(end.latitude - start.latitude);
                    var dLon = toRad(end.longitude - start.longitude);
                    var lat1 = toRad(start.latitude);
                    var lat2 = toRad(end.latitude);
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return Math.round(EARTH_RADIUS_KM * c * 1000);
                },
                
                getTime: function (time) {
                    var hours = Math.floor(time / 60 / 60);
                    var minutes = Math.floor((time - hours * 60 * 60) / 60);
                    var seconds = Math.floor(time - hours * 60 * 60 - minutes * 60);
                    return {
                        hours : hours,
                        minutes : minutes,
                        seconds : seconds
                    };
                }              
            };
        });
	