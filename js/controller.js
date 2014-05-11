function InitCtrl($rootScope, $location, $timeout, Item)
{
	$rootScope.appName = "Menu"
	$rootScope.storeName = "BizHode"

	$rootScope.items = Item.query();
	$rootScope.orders = [];
	$rootScope.isLogin = function()
	{
		//send user Key and Email to server

		//server determine is this key stay too long or not
		$rootScope.user = $rootScope.loadUser();
		
		if(typeof $rootScope.user.key =="undefined")
			return false;
		return true;
	}

	$rootScope.authenticate = function(email, password, callback)
	{

		$rootScope.user = {email:email, key:password};
		var user = $rootScope.user;
		//authenticaate local
		var members = JSON.parse(localStorage.iv_members);
		for(var i =0; i < members.length; i++)
			if(members[i].email == user.email && members[i].key == user.key)
			{
				localStorage.iv_user = JSON.stringify($rootScope.user)
				break;
			}
		$rootScope.is_user_login = $rootScope.isLogin();
		console.log("Authen");
		console.log($rootScope.is_user_login)
		if($rootScope.is_user_login)
			$timeout(callback, 100);
		else
		{
			document.getElementById('login-overlay').click();
		}
	}

	$rootScope.logout = function()
	{
		localStorage.iv_user = "";
		$rootScope.checkLogin();
	}

	$rootScope.checkLogin = function()
	{
		$rootScope.is_user_login = $rootScope.isLogin();
		if(!$rootScope.isLogin())
		{
			$location.path('/login');
			
		}
		return true;
	}

	$rootScope.saveStore = function(store)
	{

		store.isNew = false;
		store.isEmpty = false;
		var store_txt = JSON.stringify(store);
		localStorage.iv_store = store_txt;
		$rootScope.store = store;
		return store;
	}

	$rootScope.loadStore = function()
	{
		var store;
		if(typeof localStorage.iv_store == "undefined")
			store = {isNew:true, isEmpty:true}
		else if(localStorage.iv_store == "")
			store = {isNew:false, isEmpty:true}
		else
			store = JSON.parse(localStorage.iv_store);
		return store;
	}

	$rootScope.saveMember = function(user)
	{
		$rootScope.user = user;
		var members_txt = JSON.stringify([user]);
		localStorage.iv_members = members_txt;
		return user;
	}


	$rootScope.loadUser = function()
	{
		if(typeof localStorage.iv_user == "undefined" || localStorage.iv_user =="")
		{
			localStorage.iv_user = "";
			return {};
		}else
			return JSON.parse(localStorage.iv_user);
	}

	//init app
	$rootScope.user = $rootScope.loadUser();
	$rootScope.store = $rootScope.loadStore();
	console.log($rootScope.store)
	if($rootScope.store.isEmpty)
		$location.path('/register')
	else
	{
		$rootScope.storeName = $rootScope.store.name;
		$rootScope.checkLogin();
	}
}

app.run(InitCtrl)

function HomeCtrl ($scope, $rootScope) {
	// body...
	$rootScope.menus = [];
	var data = {
		labels : ["8.00","9.00","10.00","11.00","12.00","13.00","14.00"],
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : [65,59,90,81,56,55,40]
			}
		]
	}
	var ctx = document.getElementById("daily-sales-chart").getContext("2d");
	var myNewChart = new Chart(ctx).Line(data);

	$scope.stocks = [{"id":6, "initStock":5, "currentStock":1, "price":20, "cost":12, "name":"โฮหวีตทูน่า", "type":"กลาง"},
		{"id":7, "initStock":5, "currentStock":2, "price":30, "cost":20, "name":"โฮหวีตกรอบแฮมชีส", "type":"Premium"},
		{"id":9, "initStock":5, "currentStock":0, "price":30, "cost":20, "name":"โฮหวีตกรอบทูน่า", "type":"Premium"}]
}

function ProfileCtrl ($scope, $rootScope) {
	// body...
	$rootScope.menus = [];
}

function LoginCtrl($scope, $location, $rootScope) {
	$rootScope.menus = [];
	$scope.login = function()
	{
		$scope.authenticate($scope.email, $scope.password, function(){
			$location.path('/');

		});
		return false;
	}
	if($scope.isLogin())
		$location.path('/');
}

function StockCtrl ($scope, $rootScope) {
	// body...
	$rootScope.menus = [{name:"Import", path:"/stock/import", icon:"fa-download"}, {name:"Clear Stock", path:"/stock/clear", icon:"fa-circle"}]
	//{name:"Import", path:"/stock/import", icon:"fa-download"}
}

function ClearStockCtrl($scope, $rootScope)
{
	$rootScope.menus = [{name:"Back", path:"/stock", icon:"fa-arrow-left"}]
	for(var i = 0; i < $scope.items; i++)
		$scope.items[i].tossed = false;
}

function ImportCtrl($scope, $rootScope)
{
	$rootScope.menus = []
	$scope.import_items = [];

	$scope.isDuplicate = function(item)
	{
		for(var i =0; i < $scope.import_items.length; i++)
			if($scope.import_items[i].product.id == item.product.id)
				return {index:i, id:item.product.id};
		return false;
	}

	$scope.add = function(item)
	{
		var new_obj = {product:item.product, count:item.count}
		console.log('add');
		console.log(new_obj)
		console.log($scope.isDuplicate(new_obj))
		if( obj = $scope.isDuplicate(new_obj))
		{
			$scope.import_items[obj.index].count += new_obj.count;
		}else
			$scope.import_items.push(new_obj);
	}

	$scope.delete = function(item)
	{
		for(var i =0; i < $scope.import_items.length; i++)
			if($scope.import_items[i].id == item.id)
			{
				$scope.import_items.splice(i, 1);
				break;
			}
		//	delete item.parent.next
		
		
	}
}

function RegisterCtrl($scope, $location, $rootScope)
{
	$rootScope.menus = [];
	$scope.register = function(){
		if($scope.password == $scope.re_password)
		{
			$scope.saveMember({email:$scope.email, key:$scope.password});
			$scope.saveStore($scope.store);
			$location.path('/')
		}else
		{
			document.getElementById('noob').click();
		}
	}
}

function OrderConfirmCtrl($scope, $filter, $rootScope)
{
	
	$scope.carts = [{"id":2, "count":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"}, {"id":3, "count":1, "initStock":20, "currentStock":18, "price":15, "cost":10, "name":"ทูหน้า", "type":"ถูก"}];
	var sum  = 0;
	for(var i = 0; i < $scope.carts.length;i++)
	{
		sum += $scope.carts[i].count * $scope.carts[i].price;
	}
	$scope.sum = sum;
	sum = $filter('number')(sum);
	sum = $filter('new_currency')(sum);

	$rootScope.menus = [
		{name:"Back", path:"/order", icon:"fa-arrow-left"},
		{name:"Confirm(" + sum + ")", path:"/order", icon:"fa-check-square"}
	 ];
}

function OrderCtrl ($scope, Customer, $filter, $rootScope) {
	$scope.types = ["ถูก", "กลาง", "Premium"];
	
	$scope.carts = [{"id":2, "count":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"}, {"id":3, "count":1, "initStock":20, "currentStock":18, "price":15, "cost":10, "name":"ทูหน้า", "type":"ถูก"}];

	$rootScope.menus = [{name:"Confirm", path:"/order/confirm", icon:"fa-check-square"}];
}

function OrderItemCtrl ($scope, $filter, $rootScope) {
	$rootScope.menus = [{name:"Back", path:"/order", icon:"fa-arrow-left"}]
	$scope.products = [{"id":1, "initStock":10, "currentStock":5, "price":15, "cost":10, "name":"แฮมมาโย", "type":"ถูก"},
		{"id":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"},
		{"id":3, "initStock":20, "currentStock":18, "price":15, "cost":10, "name":"ทูหน้า", "type":"ถูก"}]

		for(var i =0; i < $scope.products.length; i++)
			$scope.products[i].count = 0;

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

function PrintCtrl($scope, $rootScope)
{
	$rootScope.menus = [];


	var data = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				data : [65,59,90,81,56,55,40]
			},
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				data : [28,48,40,19,96,27,100]
			}
		]
	}
	var ctx = document.getElementById("overall-chart").getContext("2d");
	var myNewChart = new Chart(ctx).Bar(data);

	$scope.deSelectAll = function()
	{
		$scope.is_selected = false
		for(var i =0; i < $scope.orders.length; i++)
			$scope.orders[i].is_selected = false;
	}

	$scope.selectOrder = function(item){
		$scope.deSelectAll();
		$scope.order = item;
		$scope.is_selected = true;
		item.is_selected = true;
	}
	$scope.deSelectAll();
}

function ProductCtrl($scope, $rootScope)
{
	$rootScope.menus = [];
	for(var i =0; i < $scope.items.length; i++)
	{
		$scope.items[i].isEdit = false;
		$scope.items[i].save = function()
		{
			
			this.isEdit = false;
			
		}
	}
}

function CustomerCtrl($scope, Customer, $rootScope)
{
	$rootScope.menus = [];
	$scope.customers = Customer.query();
}