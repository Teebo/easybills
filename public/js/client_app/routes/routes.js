theMoneyApp
		.config(function($routeProvider,$locationProvider,$sceDelegateProvider){
			 //$locationProvider.html5Mode( true );		
			//using Strict Contextual Escapiling i have temparily resolved the
			//browser's Same Origin Policy and Cross-Origin Resource Sharing (CORS) policy
			$sceDelegateProvider.resourceUrlWhitelist(['**']);
			$routeProvider
						  .when('/',{
							templateUrl : 'views/index_cover.html',
						  	controller : 'indexCoverController'
						  })
						  .when('/sign_in',{
						  	templateUrl : 'views/signin.html',
						  	controller : 'signInController'
						  })
						  .when('/sign_up',{
						  	templateUrl : 'views/signup.html',
						  	controller : 'signUpController'
						  })
						  .when('/dashboard',{
						  	templateUrl : 'views/profile.html',
						  	controller : 'profileController'
						  })
						  .when('/how_to',{
						  	templateUrl : 'views/how_to.html',
						  	controller : 'howToController'
						  })
						  .when('/donate/:currUserID',{
						  	templateUrl : 'views/donate.html',
						  	controller : 'donateController'
						  })
						  .when('/donate_to/:user_id',{
						  	templateUrl : 'views/donate_to.html',
						  	controller : 'donateToController'
						  })
  						  .when('/transactions/:_id',{
						  	templateUrl : 'views/transaction.html',
						  	controller : 'transactionController'
						  })
						  .when('/transactions/cancel/:transactionID',{
						  	templateUrl : 'views/cancel_transaction.html',
						  	controller : 'cancelTransactionController'
						  })	
						  .when('/confirm/transaction/:transID',{
						  	templateUrl : 'views/confirm_transaction.html',
						  	controller : 'confirmTransactionController'
						  })						  					  
						  .otherwise({
						  	redirectTo : '/'
						  })

						  //use the HTML5 history API
						  $locationProvider.html5Mode({enabled : true,requireBase:false});

		}).run(['$rootScope', '$location', 'authenticate',function($rootScope,$location,authenticate){
				$rootScope.$on('$routeChangeStart',function(event,nextRoute,currentRoute){
							if($location.path() === '/dashboard' && !authenticate.isLoggedIn()){
								$location.path('/');

								// $rootScope.title = currentRoute.$$route.isLoggedIn;


							}

							$rootScope.currUser = authenticate.currentUser();
							$rootScope.isLoggedIn = authenticate.isLoggedIn();			
				});
		}]);