function OrderConfirmCtrl($scope, $filter, $rootScope)
{
	$scope.items = LocalProduct.query();
	//$scope.carts = [{"id":2, "count":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"}, {"id":3, "count":1, "initStock":20, "currentStock":18, "price":15, "cost":10, "name":"ทูหน้า", "type":"ถูก"}];
	var sum  = 0;
	for(var i = 0; i < $scope.carts.length;i++)
	{
		sum += $scope.carts[i].count * $scope.carts[i].price;
	}
	$scope.sum = sum;
	sum = $filter('currency')(sum, $scope.store.currency);
	/*
	* IF on mobile redirect back at order else redirect at bill print page
	*/
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 		$rootScope.menus = [
			{name:"Back", path:"/order", icon:"fa-arrow-left"},
			{name:"Confirm Payment(" + sum + ")", path:"/order", icon:"fa-check-square", click:function(){
				//$scope.addBill($scope.carts);
				LocalBill.addBill({carts:$scope.carts})
				$scope.clearCarts();
			}}
		 ];
	}else
	{
		var nextBillId = LocalBill.get_next_id();
		 $rootScope.menus = [
			{name:"Back", path:"/order", icon:"fa-arrow-left"},
			{name:"Confirm Payment(" + sum + ")", path:"/bill/"+nextBillId, icon:"fa-check-square", click:function(){
				LocalBill.addBill({carts:$scope.carts})
				$scope.clearCarts();
			}}
		 ];
	}
	

	 
}

function OrderCtrl ($scope, Customer, $filter, $rootScope) {
	
	$scope.items = LocalProduct.query();
	$scope.getTypes = function()
	{
		var types = [];
		var types_check =[];
		for(var i = 0; i < $scope.items.length; i++)
		{

			if(!types_check.isDuplicate($scope.items[i].type))
			{
				var type_obj = {};
				type_obj.name = $scope.items[i].type;
				type_obj.color = Color.getColorByIndex(types.length, new Color(255,100,0), new Color(100,100,100)).getRGB();
				types.push(type_obj);
				types_check.push(type_obj.name)
			}
		}
		return types;
	}

	$scope.onSelect = function($item, $model, $label)
	{
		$item.count = 1;
		$rootScope.addToCart($item);
		$scope.item_name = "";
	}

	$scope.openSearch = function(){
		$scope.is_search_mode = true;
		setTimeout(function() {document.getElementById('search-item-name').focus();}, 10);
		
	}

	$scope.types = [];
	$scope.types = $scope.getTypes();
	
	//$scope.carts = [{"id":2, "count":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"}, {"id":3, "count":1, "initStock":20, "currentStock":18, "price":15, "cost":10, "name":"ทูหน้า", "type":"ถูก"}];

	$rootScope.menus = [{name:"Confirm", path:"/order/confirm", icon:"fa-check-square"}];
}

function OrderItemCtrl ($scope, $filter, $rootScope, $routeParams, $location) {
	$rootScope.menus = [{name:"Back", path:"/order", icon:"fa-arrow-left"}]
	var type = $routeParams.name;
	$scope.items = LocalProduct.query();

	$scope.products = $filter('filter')($scope.items, {type:type});

	//for(var i =0; i < $scope.products.length; i++)
	//	$scope.products[i].count = 0;

	for(var i = 0; i < $scope.products.length ;i++)
	{
		$scope.products[i].count = 0;
		$scope.products[i].add = function()
		{
			if(this.count + 1 <= this.currentStock | !$scope.store.is_use_stock)
				this.count++;
		}

		$scope.products[i].remove = function()
		{
			if(this.count - 1 >= 0)
				this.count--;
		}
	}

	$scope.sendOrder = function()
	{
		for(var i = 0; i < $scope.products.length ;i++)
		{
			if($scope.products[i].count > 0)
				$scope.addToCart($scope.products[i], ['id']);
		}
		console.log($scope.carts);
		$location.path('/order');

	}

}

function OrderPCCtrl ($scope, Customer, $filter, $rootScope) {
	// body...
	$rootScope.menus = [];
	$scope.sum = 0;
	$scope.carts = [];
	for(var i =0; i < $scope.items.length; i++)
	{
		$scope.items[i].count = 0;
		$scope.items[i].add = function()
		{
			this.count++;
			$scope.sum += this.price;
			if(this.count == 1)
			{
				this.cart_index = $scope.carts.length;
				$scope.carts.push(this);

			}else
				$scope.carts[this.cart_index].count = this.count;
			console.log('added at' + this.cart_index + ' count:'+ this.count)
			console.log($scope.carts[this.cart_index])
			console.log($scope.carts);
				
		}
		$scope.items[i].remove = function()
		{
			if(this.count - 1 >= 0)
			{
				this.count--;
				$scope.sum -= this.price;
				$scope.carts[this.cart_index].count = this.count;
			}
			if(this.count == 0)
			{
				for(var i =0;i<$scope.carts.length; i++)
					if($scope.carts[i].id == this.id)
						delete $scope.carts[i];
			}
		}
	}

	$scope.customers = Customer.query();
	$scope.is_selected = false;
	$scope.selectCustomer = function()
	{
		$scope.is_selected = true;
		//console.log($scope.selectedCustomer);
	}

	$scope.clearOrder = function()
	{
		$scope.sum = 0;
		for(var i =0; i < $scope.items.length; i++)
			$scope.items[i].count = 0;
		$scope.is_selected = false;
		delete $scope.selectedCustomer
	}

	$scope.sendOrder = function()
	{
		var order = {customer:$scope.selectedCustomer, sum:$scope.sum, orders:$scope.carts, status:0}
		console.log(order);
		$rootScope.orders.push(order);
		$scope.clearOrder();
	}

	$scope.updateSearch = function() {
		var products = $filter('filter')($scope.items, $scope.q);
		console.log(products);
		for(var i =0; i < products.length;i++)
			products[i].add();
	}

}