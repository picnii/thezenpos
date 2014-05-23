
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
	$scope.store_tmp = angular.copy($scope.store);
	$scope.save = function(){
		$rootScope.store = $scope.store_tmp;
		$rootScope.storeName = $scope.store.name;
		$rootScope.user = $scope.user;
		//$rootScope.saveStore($scope.store)
		//$rootScope.saveMember($scope.user)
		$scope.store.user = $scope.user;
		LocalStore.update($scope.store, function(){
			$scope.store_tmp =  angular.copy($scope.store);
		});
	}

	$scope.MAX_EXPORT_MODEL = 4;
	$scope.export = function()
	{
		$scope.export_count = 0;
		LocalStore.query(function(stores){
			$scope.export_stores = stores;
			$scope.doCallBackExportIfDone();
		})
		LocalUser.query(function(users){
			$scope.export_users = users;
			$scope.doCallBackExportIfDone();
		})
		LocalProduct.query(function(products){
			$scope.export_products = products;
			$scope.doCallBackExportIfDone();
		});
		LocalBill.query(function(bills){
			$scope.export_bills= bills;
			$scope.doCallBackExportIfDone();
		});
	}

	$scope.doCallBackExportIfDone = function()
	{
		$scope.export_count++;
		if($scope.export_count == $scope.MAX_EXPORT_MODEL)
			$scope.afterAllCallBackExport();
	}

	$scope.afterAllCallBackExport = function()
	{
		$scope.export_text = {
			stores:$scope.export_stores,
			users:$scope.export_users,
			products:$scope.export_products,
			bills:$scope.export_bills
		}

		$scope.export_text = JSON.stringify($scope.export_text);
		$scope.is_show_export = true;
		var data = "text/json;charset=utf-8," + encodeURIComponent($scope.export_text);
		$scope.export_href = 'data:' + data;
		var  a =document.createElement('a');
		a.href = $scope.export_href ;
		a.download = "data.json";
		a.click();
	}

	$rootScope.menus = [{name:"Save", path:"/profile", icon:"fa-save", click:$scope.save }];
}

function LoginCtrl($scope, $location, $rootScope, $timeout) {
	
	$scope.login = function()
	{
		$scope.authenticate({email:$scope.email, password:$scope.password}, function(){
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

function RegisterCtrl($scope, $location, $rootScope, $timeout)
{
	
	$scope.register = function(){
		if($scope.password == $scope.re_password)
		{
			//$scope.saveMember({email:$scope.email, key:$scope.password});
			//$scope.saveStore($scope.store);
			var user = {email:$scope.email, password:$scope.password};
			$scope.store.user = user;
			LocalStore.register($scope.store, function(store){
				console.log('done register');
				console.log(store);
				$scope.authenticate($scope.store.user, function(){
					console.log('done authen');
					console.log($scope.store.user)
					$location.path('/')		
				})
			})
			//$scope.authenticate($scope.email, $scope.password, function(){
			//	$location.path('/')	
			//})
			
		}else
		{
			document.getElementById('noob').click();
		}
	}
	$rootScope.menus = [{name:"REGISTER", path:"/register", icon:"fa-certificate", click:function(){
		$timeout($scope.register, 50);
	} }];
}
