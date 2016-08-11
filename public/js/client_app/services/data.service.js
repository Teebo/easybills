theMoneyApp
		 .factory('profileData',function($http,authenticate){
		 	return {
		 		getProfile : function(){
		 		return $http.get('/profile',{

		 			headers : {
		 				Authorization : 'Bearer ' + authenticate.getToken()
		 			}
		 		});
		 	}
		 	};
		 })