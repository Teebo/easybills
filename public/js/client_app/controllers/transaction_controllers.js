theMoneyApp
			.controller('transactionController',function($scope,$http,$routeParams,authenticate,$window,$location){
				$http.get('https://easybillssa.herokuapp.com/transactions/' + $routeParams._id)
					 .success(function(res){
					 	console.log("Successfully fetched transactions");
					 	console.log(res);
					 	$scope.confirmBoolean = "true";
						res.forEach(function(obj,index){
							if(obj.donator_id == authenticate.currentUser()._id){
								$scope.confirmBoolean = "false";
							}						
						});
					 	$scope.transactions = res;
					
					 })
					 .error(function(err){
					 	console.error("Error fetching transactions " + err)
						$location.path('/'); 
					 });



			})
			 .controller('cancelTransactionController',function($scope,$http,$routeParams,authenticate){

					$scope.transID = $routeParams.transactionID;
					 $scope.cancelTransaction = function(){
					 	$http.delete('https://easybillssa.herokuapp.com/transactions/cancel/' + $routeParams.transactionID)
					 		 .success(function(res){
					 		 	console.log(res);
								  $scope.cancelStatus = "true"
								  $scope.alertMessage = "Successfully cancelled transaction";
					 		 })
					 		 .error(function(err){
					 		 	console.error("Error with cancelling transaction " + err);
					 		 });
					 }

						$scope.goBack = function(){
			 		 	$window.history.back();
			 		 }

			 })
			 /*
			 .controller('rescheduleController',function($scope,$http,$routeParams,authenticate,$httpParamSerializerJQLike,$location){
					
					var ifReceiveObj = {};
					$http.get('/transactions/reschedule/' + $routeParams.transID)
						 .success(function(res){
						 	ifReceiveObj = res[0];
						 	console.log(ifReceiveObj.receiver_id);

						 })
						 .error(function(err){
						 	console.error("Error with fetching the transaction " + err);
							 $location.path('/');
						 })
	
					 $scope.reschedule = function(){

					 if(ifReceiveObj.receiver_id == authenticate.currentUser()._id){
							 var theTime = new Date($scope.reschedule.theTime);
							 var theHours =  theTime.getHours();
							 var theMinutes = theTime.getMinutes();
							 var theSeconds = theTime.getSeconds();

							 var todaysDate = new Date();
						

							
							 
							 var rescheduleObject = {
							 	rescheduleTime : todaysDate
							 };

							 console.log(rescheduleObject.rescheduleTime);
							 console.log($scope.reschedule.theTime);


						 	 $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
						 	 $http.post('http://127.0.0.1:3000/transactions/reschedule/' + $routeParams.transID,$httpParamSerializerJQLike(rescheduleObject))
						 		 .success(function(res){
						 		 	console.log(res);
									 $scope.cancelStatus = "true"
								  	 $scope.alertMessage = "Successfully rescheduled transaction";  
						 		 })
						 		 .error(function(err){
						 		 	console.log("Error with rescheduling the transaction " + err);
						 		 });
						 	}else{
								$scope.cancelStatus = "true"
								$scope.alertMessage = "Only Donatees can reschedule a transaction"; 
						 	}	 

					 };
			})*/
			 .controller('confirmTransactionController',function($scope,$http,$routeParams,authenticate,$window,$httpParamSerializerJQLike,$location){
			 	$http.get('https://easybillssa.herokuapp.com/confirm/transaction/' + $routeParams.transID)
			 		 .success(function(res){
			 		 	console.log(res);

			 		 	$scope.transaction = res.transaction[0];
			 		 	$scope.donatorUser = res.user[0];
			 		 })
			 		 .error(function(err){
			 		 	console.error("There was an error with fetching the transaction " + err);
						  $location.path('/');
			 		 });
 					$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

					 $scope.currentRouteParam = $routeParams.transID;
			 		 $scope.confirmTransaction = function(){
			 		 	$http.post('https://easybillssa.herokuapp.com/confirm/transaction/new_donatee/' + $scope.transaction.donator_id,$httpParamSerializerJQLike({donatorUser : $scope.donatorUser,transaction : $scope.transaction}))
			 		 		 .success(function(res){
			 		 		 	console.log(res)
								$scope.confirmStatus = true;

								$http.delete('https://easybillssa.herokuapp.com/delete_success/transaction/' + $scope.currentRouteParam)
									.success(function(res){
										console.log(res);
									})
									.error(function(){
										console.log("Error with deleting confirmed transaction");
									})
								   
			 		 		 })
			 		 		 .error(function(err){
			 		 		 	console.error("Error with confirming the transaction " + err);
								   $location.path('/');
			 		 		 })

			 		 }

			 		 $scope.goBack = function(){
			 		 	$window.history.back();
			 		 }
			 });

/*theMoneyApp.filter('startFrom',function(){
	return function(data,start){
		if (!data || !data.length) { return; }
        start = +start; //parse to int
        return data.slice(start);
	}
});*/			 