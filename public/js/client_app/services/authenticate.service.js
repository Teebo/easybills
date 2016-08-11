theMoneyApp.service('authenticate',function($http,$window,$location){

	var saveToken = function(token){
		$window.localStorage['mean-token'] = token;
	};

	var getToken = function(){
		return $window.localStorage['mean-token'];
	};

	logout = function(){
		$window.localStorage.removeItem('mean-token');
		$location.path('/');
		return;
	};

	var isLoggedIn = function(){
		var token = getToken();
		var payload;

		if(token){
			payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);
		
			return payload.exp > Date.now() / 1000;

		}else{
			console.log("User is not logged in");
			return false;
		}
	};

	var currentUser = function(){
		if(isLoggedIn()){
			var token = getToken();
			var payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);

			return{
				_id : payload._id,
				email : payload.email, 
				name : payload.name,
				surname : payload.surname,
				contact_number : payload.contact_number
			};	
		}
	}; 

	return{
		saveToken : saveToken,
		getToken : getToken,
		logout : logout,
		isLoggedIn : isLoggedIn,
		currentUser : currentUser
	};
});