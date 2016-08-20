theMoneyApp
		  .controller('indexCoverController',function($rootScope,$scope,authenticate){
           		  	$scope.logout = function(){
		  		authenticate.logout();
		  	}    	  		
				$rootScope.title = "EasyBills-SA";
		  })
		  .controller('signInController',function($scope,$http,$location,authenticate){
		  		$scope.submitForm = function(){
		  			$http.post('https://easybillssa.herokuapp.com/sign_in',$scope.loginUser)
		  				 .success(function(res){
		  				 	console.log("Recieved login response"+ res.token);
		  				 	authenticate.saveToken(res.token);
		  				 	$location.path('/dashboard');
		  				 })
		  				 .error(function(err){
		  				 	console.error("There was an error login in the use " + err.message);
								 $scope.showLoginError = true;
								  $scope.loginErrorMessage = err.message;

									if($scope.loginErrorMessage != "Incorrect password provided"){
											$scope.loginErrorMessage = $scope.loginErrorMessage + " <a href='#/sign_up' ><strong>Sign Up<strong></a>";
									}else{
											$scope.loginErrorMessage = $scope.loginErrorMessage;
									}
									
									
		  				 });
		  		}


 	 
		  })
		  .controller('signUpController',function($scope,$http,$location,authenticate){


		  		
		//Double check if form is valid
		$scope.submitForm = function(isValid){
		  			$http.post('https://easybillssa.herokuapp.com/sign_up',$scope.registerUser)
		  				 .success(function(res){
		  				 	console.log("Got response from server");
		  				 	authenticate.saveToken(res.token);

								//Clear form(userForm) and object() after submit
								$scope.userForm.$setPristine();
								$scope.userForm.$setUntouched();
								$scope.userForm = {};									 
		  				 	console.log(res.token);
		  				 	$location.path('/dashboard');
		  				 })
		  				 .error(function(err){
								 $scope.duplicateValidator = true;
								 $scope.errorObject = err;
		  				 	 console.error("There was an error : " + JSON.stringify(err,null,'\t'));
		  				 });
	  				 
		  		};
		  })
		  .controller('profileController',function($rootScope,$scope,$http,$location,profileData,authenticate){
				$rootScope.title = "Dashboard";
		  	$scope.logout = function(){
		  		authenticate.logout();
		  	}

		console.log(authenticate.isLoggedIn());
		  	 $scope.userProData = {};

				 console.log($scope.userProData);


		  	 profileData.getProfile()
		  	 			.success(function(res){
		  	 				 $scope.userProData = res;
									$scope.userProData.name = $scope.userProData.name.substring(0,1).toUpperCase() + $scope.userProData.name.substring(1);
								 if($scope.userProData.first_login === false){
									 $scope.profileMessage = "Welcome to <span class=''>EasyBills</span> " + "<span class='welcome-text-3'>" +  $scope.userProData.name + "</span>!";
									 $scope.profilePara = "Ufike kahle"
								 }else{

									 $scope.profileMessage = " Hey <span class='welcome-text-3'>" +  $scope.userProData.name + "</span>! Welcome back";
									 $scope.profilePara = "";
								 }
		  	 				 console.log(JSON.stringify($scope.userProData,null,"\t"));

		  	 			})
		  	 			.error(function(err){
		  	 				console.log("There was an error getting profile data " + err);
		  	 			});

		  	 			
		  })
		  .controller('howToController',function($rootScope,$scope){
					$rootScope.title = "How To";
		  		$scope.hey = "Hey how to";
		  })


 var compareTo = function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  };


  theMoneyApp.directive("compareTo", compareTo);

	theMoneyApp.filter('capitalize',function(){
		 return function(str){
			 	if(str){
					 return str.charAt(0).toUpperCase() + str.slice(1);
				 }
		 }
	});

