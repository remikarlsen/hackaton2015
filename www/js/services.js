angular.module('starter.services', [])

.factory('ruterService', function($http, $filter) {

	var MyDestinations = {
		HJEM: 'Hjem',
		JOBB: 'Jobb',
		SKOLE: 'Skole',
		BARNEHAGE: 'Barnehage'
	};

	var myStops = {};
	myStops['Majorstuen'] = {id:'3010200', desc:MyDestinations.HJEM};
	myStops['Jernbanetorget'] = {id:'3010011', desc:MyDestinations.JOBB};
	myStops['Rodtvedt'] = {id:'3011910', desc:MyDestinations.BARNEHAGE};
	myStops['Veitvedt'] = {id:'3012040', desc:MyDestinations.SKOLE};

	var myTravels = [
	{name:'majorstuenToJernbanetorget', from:myStops['Majorstuen'], to:myStops['Jernbanetorget']},
	{name:'rodtvedtToJernbanetorget', from:myStops['Rodtvedt'], to:myStops['Jernbanetorget']},
	{name:'veitvedtToJernbanetorget', from:myStops['Veitvedt'], to:myStops['Jernbanetorget']},
	{name:'jernbanetorgetToVeitvedt', from:myStops['Jernbanetorget'], to:myStops['Veitvedt']},
	{name:'majorstuenToVeitvedt', from:myStops['Majorstuen'], to:myStops['Veitvedt']},	
	{name:'majorstuenToRodtvedt', from:myStops['Majorstuen'], to:myStops['Rodtvedt']},
	{name:'jernbanetorgetToRodtvedt', from:myStops['Jernbanetorget'], to:myStops['Rodtvedt']},
	{name:'jernbanetorgetToMajorstuen', from:myStops['Jernbanetorget'], to:myStops['Majorstuen']},
	{name:'veitvedtToMajorstuen', from:myStops['Veitvedt'], to:myStops['Majorstuen']},
	{name:'rodvedtToMajorstuen', from:myStops['Rodtvedt'], to:myStops['Majorstuen']}	
	]; 
	

   return {
   
     getPing: function() {
           return $http({
            url: 'http://reisapi.ruter.no/heartbeat/index?json=true',
            method: 'GET'
        })
     },
    
     getMyTravels: function() {
     	return myTravels;
     },
     
     getMyDestinations: function() {
     	return MyDestinations;
     },
     
     getTravels: function(from, to, line) {
     	var dateFilter = $filter('date');
		var filteredDate = dateFilter(new Date(), 'ddMMyyyyhhmmss')
           return $http({
            url: 'http://reisapi.ruter.no/Travel/GetTravels?fromplace='+from+'&toplace='+to+'&isafter=True&time='+filteredDate+'&proposals=1&transporttypes=8&linenames='+line,
            method: 'GET'
        })
     },
     /*
     getTravels: function(from, to, line) {
     	var dateFilter = $filter('date');
		var filteredDate = dateFilter(new Date(), 'ddMMyyyyhhmmss')
           return $http({
            url: 'http://reisapi.ruter.no/Travel/GetTravels?fromplace='+from+'&toplace='+to+'&isafter=True&time='+filteredDate+'&proposals=1&transporttypes=8&linenames='+line,
            method: 'GET'
        })
     }, */    
     
   }//return
})

.factory('todo', function($http, $filter) {
   return {
     getXXX: function(x, y) {
		return "todo";
     }
   }
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
	