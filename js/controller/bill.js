function BillCtrl($scope, $rootScope)
{
	$scope.searchOptions = [
		{name:"Not printed", isPrinted:false, hideUnPrinted:false},
		{name:"Printed", isPrinted:true, hideUnPrinted:true},
		{name:"All", isPrinted:true, hideUnPrinted:false}
	]

	$scope.refresh = function(){
		 LocalBill.query(function(bills){
		 	$scope.bills =bills;
			for(var i =0; i < $scope.bills.length;i++)
			{
				var bill = $scope.bills[i];
				if(typeof bill.create_time == "string")
					bill.create_time = new Date(bill.create_time)
			}
		})
		for(var i =0; i < $scope.bills.length; i++)	
		{
			var price = 0;
			for(var j=0; j< $scope.bills[i].carts.length ; j++)
				price += $scope.bills[i].carts[j].price * $scope.bills[i].carts[j].count
			$scope.bills[i].sum = price;
		}
		$scope.search={}
	}

	$scope.updateSearch = function()
	{
		$scope.search.isPrinted = $scope.searchOption.isPrinted
		if($scope.searchOption.isPrinted && !$scope.searchOption.hideUnPrinted)
			$scope.search = {};
	}

	$scope.clearBill = function()
	{
		if(confirm("Are you sure to clear those bill?"))
			LocalBill.clearBills(function(){
				$scope.refresh();
			});
	}
	$scope.refresh();
	$rootScope.menus = [{name:"DELETE ALL", path:"/bill", icon:"fa-check-square", click:$scope.clearBill}];
}

function BillPrintCtrl($scope, $rootScope, $routeParams, $location, $timeout)
{
	$scope.onEditBtn = function()
	{
		$scope.isEdit = true;
		$rootScope.menus = [{name:"Preview", path:"/bill/"+ $routeParams.id, icon:"fa-arrow-left", click:$scope.onBackBtn},
			{name:"CANCLE", path:"/bill/"+ $routeParams.id, icon:"fa-times", click:$scope.cancle}
		]
	}

	$scope.onBackBtn = function()
	{
		if($scope.isEdit)
		{
			$scope.isEdit = false;
			$rootScope.menus = [{name:"Back", path:"/bill/"+ $routeParams.id, icon:"fa-arrow-left", click:$scope.onBackBtn},
		{name:"Print", path:"/bill", icon:"fa-print"},
		{name:"Edit", path:"/bill/" + $routeParams.id, icon:"fa-edit", click:$scope.onEditBtn}
	]
		}else
			$timeout(function(){$location.path('/bill')}, 50)
			
	}

	$scope.onPrintBtn = function()
	{
		$scope.bill.isPrinted = true;
		LocalBill.update({id:$scope.bill.id, isPrinted:$scope.bill.isPrinted}, function(){
			window.print();	
		})
		
	}

	$scope.cancle = function()
	{
		if(confirm("Are you sure you going to cancle this bill"))
		{
			LocalBill.removeBill({id:$scope.bill.id}, function(){
				$timeout(function(){$location.path('/bill')}, 50);
			})
		}
	}

	$rootScope.menus = [{name:"Back", path:"/bill/"+ $routeParams.id, icon:"fa-arrow-left", click:$scope.onBackBtn},
		{name:"Print", path:"/bill", icon:"fa-print", click:$scope.onPrintBtn},
		{name:"Edit", path:"/bill/" + $routeParams.id, icon:"fa-edit", click:$scope.onEditBtn}
	];
	$scope.bill = LocalBill.get({id:$routeParams.id});
	$scope.bill.sum = 0;
	for(var i =0; i < $scope.bill.carts.length ;i++)
		$scope.bill.sum +=  $scope.bill.carts[i].price * $scope.bill.carts[i].count
	$scope.bill.logo = "http://placehold.it/150x50";
	$scope.bill.address = "1010 สุทธิสาร ดินแดง ดินแดง กรุงเทพ 10400";
	if(!$scope.device.isMobile)
		$scope.bill.isShowSign = true;
	$scope.bill.signBy = "สมภพ กุละปาลานนท์";

}