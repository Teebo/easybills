theMoneyApp
		 .factory('profileData',function($http,authenticate){
		 	return {
		 		getProfile : function(){
		 		return $http.get('/dashboard',{

		 			headers : {
		 				Authorization : 'Bearer ' + authenticate.getToken()
		 			}
		 		});
		 	}
		 	};
		 })