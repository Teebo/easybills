var mm;
theMoneyApp
   		.controller('donateController',function($scope,$http,authenticate,$location,$routeParams){
                                 
   			  $http.get('http://127.0.0.1:3000/donate/' + $routeParams.currUserID)
                   .success(function(res){
                        console.log("successfully returned donations");
                        $scope.donateUsers = res;

                   })
                   .error(function(err){
                     console.log("Error with getting donations " + err);
                     $location.path('/');
                   })

   		})
   		.controller('donateToController',function($rootScope,$scope,$http,$location,authenticate,capitaliseString,$routeParams,$httpParamSerializerJQLike){
                     
                    

                     
                     $scope.amountFullToggle = true;
                     $scope.showAmountBlock = function(){
                           $scope.amountInputs = true;
                           $scope.amountFullToggle = false;

                           $scope.alertClass = "alert alert-warning";
                           $scope.alertHead = "Remember, you can only donate an amount of R500 or greater";
                           $scope.alertMessage = "Donation amount should be in numeric format only, eg.500";
                     }

                     $scope.showFullAmtBtn = function(){
                            $scope.amountFullToggle = true;
                            $scope.amountInputs = false;
                            $scope.donateUser.donationAmount = ""; 
                     }
                     
                     $scope.makeFullAmount = function(){

                           //console.log("The original needed amount ", $rootScope.theOriginalNeedAmt);
                              var theMoola = $rootScope.theOriginalNeedAmt;

                              console.log("Then moola ",theMoola);
                              $scope.donateUser.amount_needed = $rootScope.theOriginalNeedAmt;

                              console.log($scope.donateUser.amount_needed);
                     }

                     $scope.clearAmountInput = function(){
                         $scope.donateUser.donationAmount = "";  
                     }

                     $scope.validateRemainder = function($event){

                         var amountNeededRemainder = $scope.donateUser.amount_needed - $scope.donateUser.donationAmount;
                         console.log(amountNeededRemainder);
                          if (amountNeededRemainder < 500 && amountNeededRemainder > 0){
                                $event.stopPropagation();
                                var message = capitaliseString.captStr($scope.donateUser.name )+" needs R"+$scope.donateUser.amount_needed;
                                    message += " and you are donating R" +$scope.donateUser.donationAmount+ " which leaves R" +amountNeededRemainder;
                                    message += " in " + capitaliseString.captStr($scope.donateUser.name )+ "'s account.";
                                $scope.alertClass = "alert alert-danger";
                                $scope.alertHead = "You cannot leave a balance of less than R500 in the person's account,you can either donate the full amount or quit";
                                $scope.alertMessage = message;                               
                                console.log("You cannot leave a balance of less than R500 in the person's account,you can either donate the full amount or quit");
                          }else if($scope.donateUser.donationAmount > $scope.donateUser.amount_needed){
                                $event.stopPropagation();
                              var message = capitaliseString.captStr($scope.donateUser.name ) +" needs R"+$scope.donateUser.amount_needed;
                                    message += " and you are donating R" +$scope.donateUser.donationAmount+ " which is more than what " + capitaliseString.captStr($scope.donateUser.name ) +" needs.";
                                   
                                $scope.alertClass = "alert alert-danger";
                                $scope.alertHead = "You cannot donate more than what is needed";
                                $scope.alertMessage = message;                               
                                console.log("You cannot leave a balance of less than R500 in the person's account,you can either donate the full amount or quit");

                          }else{
                               $scope.donateUser.amount_needed = $scope.donateUser.donationAmount;
                               console.log("Modified needed amount by amount from input box ",$scope.donateUser.amount_needed);
                               
                          }
                     }
                     
   		                   
                        if(authenticate.currentUser()._id == $routeParams.user_id){
                          $location.path('/donate');
                          $rootScope.$on('$locationChangeStart', function (event) {
 
                          });
                          $scope.checkCurrentUser = true;
                        }else{

                              $http.get('http://127.0.0.1:3000/donate_to/' + $routeParams.user_id)
                              .success(function(res){
                                    console.log("successfully returned donation user");
                                    $scope.donateUser = res;
                                    $rootScope.theOriginalNeedAmt = $scope.donateUser.amount_needed;
                                    mm =  $scope.donateUser.amount_needed;
                                    console.log("Original ",$rootScope.theOriginalNeedAmt);
                              })
                              .error(function(err){
                                    console.error("Error with getting donation user " + err);
                                    $location.path('/');
                              });

                              $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                              var cuser = authenticate.currentUser();
                              var currentDate = new Date();

                              currentDate.setHours(currentDate.getHours() + 2);                              



                              $scope.donate = function(){
                                  
                                    var transaction = {
                                    receiver_id : $scope.donateUser.user_id,
                                    receiver_name : $scope.donateUser.name,
                                    receiver_email : $scope.donateUser.email,
                                    receiver_contact_number : $scope.donateUser.contact_number,
                                    donator_id : cuser._id,
                                    donator_name : cuser.name,
                                    donator_email : cuser.email,
                                    donator_contact_number : cuser.contact_number,
                                    donation_time : currentDate,
                                    transaction_amount : $scope.donateUser.amount_needed,
                                    original_amount : $rootScope.theOriginalNeedAmt
                                    };

                                    console.log(transaction);

                                $http.post('/transaction',$httpParamSerializerJQLike(transaction))
                                    .success(function(res){
                                          console.log("Received response");
                                          console.log(res);                                
                                          $scope.donateStatus = true;
                                    })
                                    .error(function(err){
                                          console.log("There was an error posting the transaction");
                                    });
                                    
                              };

                        }

           


   		})


  var validateAmount = function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=validateAmount"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.validateAmount = function(modelValue) {
          return modelValue >= 500;
        };

      }
    };
  };

  theMoneyApp.directive("validateAmount", validateAmount);

