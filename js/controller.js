function InitCtrl($rootScope, $location, $timeout, Item)
{
	$rootScope.appName = "Menu"
	$rootScope.storeName = "The Zen Pos"
	//$rootScope.items = Item.query();
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

	if(typeof localStorage['BizProduct'] == "undefined")
		localStorage['BizProduct'] = '';

	$rootScope.items = LocalProduct.query();


	
	$rootScope.addToCart = function(item)
	{
		if(!$rootScope.carts.isDuplicate(item))
		{
			var addedItem = angular.copy(item);
			if(typeof addedItem.count == 'undefined' || addedItem.count <= 0 )
				addedItem.count = 1;
			$rootScope.carts.push(addedItem);
		}else
		{
			var cart = $rootScope.carts.find({id:item.id});
			if(cart.count +1 <= cart.currentStock)
				cart.count++;
		}
	}

	$rootScope.removeFromCart = function(item, count )
	{
		if(typeof count == 'undefined')
		{
			var index = $rootScope.carts.findIndex({id:item.id});
			$rootScope.carts.splice(index, 1);
		}
		var cart = $rootScope.carts.find({id:item.id});
		if(cart.count - 1 >= 0)
			cart.count--;
		
	}

	$rootScope.clearCarts = function()
	{
		$rootScope.carts = [];
	}
	$rootScope.clearCarts();
	$rootScope.device = {};
	$rootScope.device.name = navigator.userAgent;
	$rootScope.device.isMobile =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


}

app.run(InitCtrl)

function HomeCtrl ($scope, $rootScope, $filter) {
	// body...
	$rootScope.menus = [];
	var used_space = JSON.stringify(localStorage).length;
	var limit_space = 5 * 1024 * 1024;
	var data = [
		{
			value: used_space,
			color:"#F38630"
		},
		{
			value : (limit_space - used_space),
			color : "#69D2E7"
		}			
	]
	var ctx = document.getElementById("space-chart").getContext("2d");
	
	var spaceChart = new Chart(ctx).Pie(data);

	//find stock piechart
	$scope.stocks = [];
	var types = [];
	$scope.addStock = function(name, value, index)
	{

		var stock_obj = {};
		stock_obj.value = value;
		stock_obj.name = name;
		var stock_color = Color.getColorByIndex(index + 1, new Color(0,0,0), new Color(52, 103, 151))
		stock_obj.color = stock_color.getRGB();//"rgb("+r+","+g+","+b+")"
		$scope.stocks.push(stock_obj)
	}

	LocalProduct.query(function(items){
		$scope.items = items;
		for(var i =0; i < $scope.items.length; i++)
		{
			var current_item = $scope.items[i];
			if(current_item.currentStock > 0 && !types.isDuplicate(current_item.type))
			{
				$scope.addStock(current_item.type, current_item.currentStock, types.length)	
				types.push(current_item.type)
			}else if(types.isDuplicate(current_item.type)){
				console.log('find stocks');
				console.log($scope.stocks)
				var item = $scope.stocks.find({name:current_item.type});
				item.value += current_item.currentStock;
			}
		}
		$scope.types = types;
		var ctx = document.getElementById("stock-chart").getContext("2d");
		
		$scope.stockChart = new Chart(ctx).Pie($scope.stocks);
	})
	

	//find top 5 sales
	LocalBill.query(function(bills){
		$scope.bills = bills;
		for(var i =0; i < $scope.bills.length;i++)
		{
			var bill = $scope.bills[i];
			if(typeof bill.create_time == "string")
				bill.create_time = new Date(bill.create_time)
		}
		$scope.sales = [];
		for(var i =0; i < $scope.bills.length;i ++)
		{
			for(var j =0; j < $scope.bills[i].carts.length;j++)
			{
				var cart = $scope.bills[i].carts[j]
				var sale = cart.price * cart.count;
				
				if(!$scope.sales.isDuplicate(cart))
				{
					cart.value = sale;
					$scope.sales.push(cart);
				}else
				{
					var index = $scope.sales.findIndex({id:cart.id});
					$scope.sales[index].value += sale;
				}
			}
		}
		$scope.sales = $filter('orderBy')($scope.sales, 'value', true)
		//modify sales before use
		var sales_label =[];
		for(var i =0; i < $scope.sales.length;i++)
		{
			sales_label.push($scope.sales[i].name);
			var sale_color = Color.getColorByIndex(i, new Color(255,0,0), new Color(206, 52, 73))
			$scope.sales[i].color = sale_color.getRGB();
		}
		var sales_set_data =[];
		sales_set_data[0] = {
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)"
		}
		sales_set_data[0].data = [];
		for(var i =0; i < $scope.sales.length ; i++)
		{

			sales_set_data[0].data.push($scope.sales[i].value)
		}

		var ctx = document.getElementById("sales-chart").getContext("2d");
		console.log(ctx)
		console.log({labels:sales_label, datasets:sales_set_data})
		
		$scope.sales_chart = new Chart(ctx).Bar({labels:sales_label, datasets:sales_set_data}, {scaleOverlay : true});
	})
	

}

function ProfileCtrl ($scope, $rootScope) {
	// body...
	
	$scope.save = function(){
		$rootScope.store = $scope.store;
		$rootScope.storeName = $scope.store.name;
		$rootScope.user = $scope.user;
		$rootScope.saveStore($scope.store)
		$rootScope.saveMember($scope.user)
	}
	$rootScope.menus = [{name:"Save", path:"/profile", icon:"fa-save", click:$scope.save }];
}

function LoginCtrl($scope, $location, $rootScope, $timeout) {
	
	$scope.login = function()
	{
		$scope.authenticate($scope.email, $scope.password, function(){
			$location.path('/');

		});
		return false;
	}
	$rootScope.menus = [{name:"LOGIN", path:"/login", icon:"fa-sign-in", click:function(){
		$timeout($scope.login, 50);
	} }];
	if($scope.isLogin())
		$location.path('/');
}

function RegisterCtrl($scope, $location, $rootScope)
{
	
	$scope.register = function(){
		if($scope.password == $scope.re_password)
		{
			$scope.saveMember({email:$scope.email, key:$scope.password});
			$scope.saveStore($scope.store);
			$scope.authenticate($scope.email, $scope.password, function(){
				$location.path('/')	
			})
			
		}else
		{
			document.getElementById('noob').click();
		}
	}
	$rootScope.menus = [{name:"REGISTER", path:"/register", icon:"fa-certificate", click:function(){
		$timeout($scope.register, 50);
	} }];
}


function CustomerCtrl($scope, Customer, $rootScope)
{
	$rootScope.menus = [];
	$scope.customers = Customer.query();
}

