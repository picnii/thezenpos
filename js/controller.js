Array.prototype.isDuplicate = function(item)
{
	for(var i =0; i < this.length;i++)
		if(this[i] == item)
			return true;
	return false;
}

Array.prototype.isDuplicateById = function(item)
{
	for(var i =0; i < this.length;i++)
		if(this[i].id == item.id)
			return true;
	return false;
}

Array.prototype.findById = function(id)
{
	for(var i =0; i < this.length;i++)	
		if(this[i].id == id)
			return this[i];
	return -1;
}

Array.prototype.findByName = function(id)
{
	for(var i =0; i < this.length;i++)	
		if(this[i].name == name)
			return this[i];
	return -1;
}

Array.prototype.findIndexById = function(id)
{
	for(var i =0; i < this.length;i++)	
		if(this[i].id == id)
			return i;
	return -1;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function InitCtrl($rootScope, $location, $timeout, Item)
{
	$rootScope.appName = "Menu"
	$rootScope.storeName = "BizHode"

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

	$rootScope.loadProducts = function()
	{
		var biz_product = localStorage['BizProduct'];
		if(biz_product == '')
		{
			$rootScope.items = [
		{"id":1, "initStock":10, "currentStock":5, "price":15, "cost":10, "name":"แฮมมาโย", "type":"ถูก"},
		{"id":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"},
		{"id":9, "initStock":5, "currentStock":0, "price":30, "cost":20, "name":"โฮหวีตกรอบทูน่า", "type":"Premium"}
];
			var new_biz_product = {};
			new_biz_product.items = angular.copy($rootScope.items);
			localStorage['BizProduct'] = JSON.stringify(new_biz_product);
			return false
		}
		biz_product = JSON.parse(biz_product)
		$rootScope.items = angular.copy(biz_product.items);
		return true;
	}
	$rootScope.loadProducts();

	$rootScope.saveProducts = function(items)
	{
		var biz_product = localStorage['BizProduct'];
		if(biz_product == '')
		{

			return false;
		}
		biz_product = JSON.parse(biz_product)
		biz_product.items = angular.copy(items);
		localStorage['BizProduct'] = JSON.stringify(biz_product);
		return true;
	}

	$rootScope.carts = [];
	$rootScope.addToCart = function(item)
	{
		if(!$rootScope.carts.isDuplicateById(item))
		{
			var addedItem = angular.copy(item);
			if(typeof addedItem.count == 'undefined' || addedItem.count <= 0 )
				addedItem.count = 1;
			$rootScope.carts.push(addedItem);
		}else
		{
			var cart = $rootScope.carts.findById(item.id);
			if(cart.count +1 <= cart.currentStock)
				cart.count++;
		}
	}

	$rootScope.removeFromCart = function(item, count )
	{
		if(typeof count == 'undefined')
		{
			var index = $rootScope.carts.findIndexById(item.id);
			$rootScope.carts.splice(index, 1);
		}
		var cart = $rootScope.carts.findById(item.id);
		if(cart.count - 1 >= 0)
			cart.count--;
		
	}

	$rootScope.bills = [];
	$rootScope.getNextBillId = function()
	{
		if($rootScope.bills.length == 0)
			return 1
		else
			return $rootScope.bills[$rootScope.bills.length - 1].id + 1
	}

	$rootScope.addBill = function(carts)
	{
		var bill_obj = {};
		bill_obj.id = $rootScope.getNextBillId();
		bill_obj.current_time = new Date();
		bill_obj.isPrinted = false;
		bill_obj.carts = angular.copy(carts);
		//remove current stock
		for(var i =0; i < carts.length; i++)
		{
			var item = $rootScope.items.findById(carts[i].id);
			item.currentStock -= carts[i].count;
		}
		$rootScope.bills.push(bill_obj);
		$rootScope.carts=[];

		//save to local storage
		var str = JSON.stringify($rootScope.bills);
		localStorage["BizBill"] = str;
	}

	$rootScope.loadBills = function()
	{
		if(typeof localStorage["BizBill"] == 'undefined' || localStorage["BizBill"] == '')
			localStorage["BizBill"] = "[]";
		$rootScope.bills = JSON.parse(localStorage['BizBill']);
		for(var i =0; i < $rootScope.bills.length;i++)
		{
			var bill = $rootScope.bills[i];
			if(typeof bill.current_time == "string")
				bill.current_time = new Date(bill.current_time)
		}
	}
	$rootScope.loadBills();

	$rootScope.saveBill = function(bill)
	{
		for(var i =0; i < $rootScope.bills.length; i++)
			if($rootScope.bills[i].id == bill.id)
				$rootScope.bills[i] = bill;
		console.log('saved bill');
		console.log($rootScope.bills)
		localStorage['BizBill'] = JSON.stringify($rootScope.bills);
	}

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
		var d = index + 1;
		var r = ( d * 52)% 256;
		var g = ( d * 103) % 256;
		var b = ( d * 151) % 256;
		stock_obj.color = "rgb("+r+","+g+","+b+")"
		$scope.stocks.push(stock_obj)
	}

	for(var i =0; i < $scope.items.length; i++)
	{
		var current_item = $scope.items[i];
		console.log('search')
		console.log(types)
		console.log(current_item)
		if(current_item.currentStock > 0 && !types.isDuplicate(current_item.type))
		{
			$scope.addStock(current_item.type, current_item.currentStock, types.length)	
			types.push(current_item.type)
		}else{
			var item = $scope.stocks.findByName(current_item.type);
			item.value += current_item.currentStock;
		}
	}
	$scope.types = types;
	var ctx = document.getElementById("stock-chart").getContext("2d");
	$scope.stockChart = new Chart(ctx).Pie($scope.stocks);
	

	//find top 5 sales
	$scope.sales = [];
	for(var i =0; i < $scope.bills.length;i ++)
	{
		for(var j =0; j < $scope.bills[i].carts.length;j++)
		{
			var cart = $scope.bills[i].carts[j]
			var sale = cart.price * cart.count;
			
			if(!$scope.sales.isDuplicateById(cart.id))
			{
				cart.value = sale;
				$scope.sales.push(cart);
			}else
			{
				var index = $scope.sales.findIndexById(cart.id);
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
		var r = (255 + (206 * i)) % 256;
		var g = (0 + (52 * i)) % 256;
		var b = (0 + (73 * i)) % 256;
		$scope.sales[i].color = "rgb("+r+","+g+","+b+")";
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

function ClearStockCtrl($scope, $rootScope, $location)
{
	$rootScope.menus = [{name:"Back", path:"/stock", icon:"fa-arrow-left"}]
	for(var i = 0; i < $scope.items; i++)
		$scope.items[i].tossed = false;

	$scope.clearStock = function()
	{
		if(confirm('Are you sure to clear all these stock?'))
		{
			for(var i = 0; i < $scope.items.length; i++)
			{
				if($scope.items[i].tossed)
				{
					
					$scope.items[i].currentStock = 0;
					$scope.items[i].initStock = 0;
				}else
				{
					$scope.items[i].initStock = $scope.items[i].currentStock 
				}
				$scope.items[i].tossed = false;
			}
			$rootScope.saveProducts($scope.items);
			$location.path('/stock')	
		}	
	}
}

function ImportCtrl($scope, $rootScope, $location)
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
		if( obj = $scope.isDuplicate(new_obj))
		{
			$scope.import_items[obj.index].count += new_obj.count;
		}else
			$scope.import_items.push(new_obj);
		$scope.newImport = {}
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

	$scope.import  = function()
	{
		for(var i =0; i < $scope.import_items.length;i++)
		{
			var import_product = $scope.import_items[i];

			for(var j =0; j < $scope.items.length ;j++)
			{
				if($scope.items[j].id == import_product.product.id)
				{
					$scope.items[j].currentStock += import_product.count;
					if($scope.items[j].currentStock >= $scope.items[j].initStock)
						$scope.items[j].initStock = $scope.items[j].currentStock;
					break;
				}
			}
		}
		console.log('items')
		console.log($scope.items);
		$rootScope.saveProducts($scope.items);
		$location.path('/stock');
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
	
	//$scope.carts = [{"id":2, "count":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"}, {"id":3, "count":1, "initStock":20, "currentStock":18, "price":15, "cost":10, "name":"ทูหน้า", "type":"ถูก"}];
	var sum  = 0;
	for(var i = 0; i < $scope.carts.length;i++)
	{
		sum += $scope.carts[i].count * $scope.carts[i].price;
	}
	$scope.sum = sum;
	sum = $filter('number')(sum);
	sum = $filter('new_currency')(sum);



	/*
	* IF on mobile redirect back at order else redirect at bill print page
	*/
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 		$rootScope.menus = [
			{name:"Back", path:"/order", icon:"fa-arrow-left"},
			{name:"Confirm Payment(" + sum + ")", path:"/order", icon:"fa-check-square", click:function(){
				$scope.addBill($scope.carts);
				$scope.saveProducts($scope.items);
				$scope.carts = [];
			}}
		 ];
	}else
	{
		var nextBillId = $rootScope.getNextBillId();
		 $rootScope.menus = [
			{name:"Back", path:"/order", icon:"fa-arrow-left"},
			{name:"Confirm Payment(" + sum + ")", path:"/bill/"+nextBillId, icon:"fa-check-square", click:function(){
				$scope.addBill($scope.carts);
				$scope.saveProducts($scope.items);
				$scope.carts = [];
			}}
		 ];
	}
	

	 
}

function OrderCtrl ($scope, Customer, $filter, $rootScope) {
	

	$scope.getTypes = function()
	{
		var types = [];
		for(var i = 0; i < $scope.items.length; i++)
		{
			if(!types.isDuplicate($scope.items[i].type))
			{
				types.push($scope.items[i].type);
			}
		}
		return types;
	}
	$scope.types = [];
	$scope.types = $scope.getTypes();
	
	//$scope.carts = [{"id":2, "count":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"}, {"id":3, "count":1, "initStock":20, "currentStock":18, "price":15, "cost":10, "name":"ทูหน้า", "type":"ถูก"}];

	$rootScope.menus = [{name:"Confirm", path:"/order/confirm", icon:"fa-check-square"}];
}

function OrderItemCtrl ($scope, $filter, $rootScope, $routeParams, $location) {
	$rootScope.menus = [{name:"Back", path:"/order", icon:"fa-arrow-left"}]
	var type = $routeParams.name;


	$scope.products = $filter('filter')($scope.items, {type:type});

	//for(var i =0; i < $scope.products.length; i++)
	//	$scope.products[i].count = 0;

	for(var i = 0; i < $scope.products.length ;i++)
	{
		$scope.products[i].count = 0;
		$scope.products[i].add = function()
		{
			if(this.count + 1 <= this.currentStock)
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
				$scope.addToCart($scope.products[i]);
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

function ReportCtrl($scope, $rootScope)
{
	$rootScope.menus = [];

	var hour_time =[], sales =[], costs =[];
	
	var init_date = $scope.bills[0].current_time.getDate();
	var init_hour = $scope.bills[0].current_time.getHours() ;
	var last_index = $scope.bills.length - 1;
	var des_date =  $scope.bills[last_index].current_time.getDate();
	var des_hour = $scope.bills[last_index].current_time.getHours() ;
	console.log("start ("+ init_date + "," + init_hour + ")");
	console.log("end (" + des_date + "," + des_hour + ")");
	for(var d = init_date; d <= des_date; d++)
	{
		if(d == init_date)
			var start_hour = init_hour;
		else
			var start_hour = 0;
		
		for(var h = start_hour; h <= 23; h++)
		{
			var sum = 0;
			
			//check bill that match d and h range
			for(var b = 0; b < $scope.bills.length;b++)
			{
				var bill = $scope.bills[b];
				var correct_hour_range = bill.current_time.getHours() == h;
				var correct_date_range = bill.current_time.getDate() == d
				
				if(correct_date_range && correct_hour_range)
					for(var c =0; c < bill.carts.length; c++)
						sum += bill.carts[c].price * bill.carts[c].count
				if(correct_date_range && correct_hour_range)
				{
					console.log('found it')
					console.log(bill)
					console.log(sum)
				}
			}
			if((h == init_hour && d == init_date) || (h == des_hour && d == des_date) )
				hour_time.push(h + ".00");
			else
				hour_time.push(" ")
			//console.log('test')
			//console.log(sum)
			sales.push(sum);
		
		}
	}

	var data = {
	labels : hour_time,
	datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				data : sales
			}
		]
	}
	var ctx = document.getElementById("overall-chart").getContext("2d");
	var myNewChart = new Chart(ctx).Line(data);

	$scope.reports = [];
	for(var i =0; i < $scope.bills.length; i++)
	{
		
		for(var j =0; j < $scope.bills[i].carts.length; j++)
		{
			var report_obj = {};
			report_obj.current_time = $scope.bills[i].current_time;
			var item = $scope.bills[i].carts[j];
			report_obj.bill = $scope.bills[i].id;
			report_obj.name = item.name
			report_obj.price = item.price;
			report_obj.count = item.count;
			$scope.reports.push(report_obj);
		}
		
	}
	console.log($scope.reports)
}

function ProductCtrl($scope, $rootScope)
{
	$rootScope.menus = [];

	$scope.is_add_new = false;
	$scope.setCRUDforItem = function(item)
	{
		item.isEdit = false;
		item.save = function()
		{
			this.isEdit = false;
			$rootScope.saveProducts($scope.items);
		}
		item.delete = function()
		{
			var index = -1;
			for(var i =0; i < $scope.items.length ;i++)
				if($scope.items[i].id == this.id)
				{
					index = i;
					break;
				}
			if(confirm("Are you sure to delete this product?"))
				$scope.items.splice(index, 1);
			$rootScope.saveProducts($scope.items);
		}
		return angular.copy(item);
	}

	/*
	* Init Zone
	*/
	$rootScope.loadProducts();
	for(var i =0; i < $scope.items.length; i++)
	{
		$scope.items[i] = $scope.setCRUDforItem($scope.items[i]);
	}

	$scope.addItem = function(item)
	{
		item.id = $scope.items[$scope.items.length - 1].id + 1
		item = $scope.setCRUDforItem(item);

		$scope.items.push(item);
		$rootScope.saveProducts($scope.items);
		$scope.is_add_new = false;
	}



}

function CustomerCtrl($scope, Customer, $rootScope)
{
	$rootScope.menus = [];
	$scope.customers = Customer.query();
}

function BillCtrl($scope, $rootScope)
{
	$rootScope.menus = [];
	for(var i =0; i < $scope.bills.length; i++)	
	{
		var price = 0;
		for(var j=0; j< $scope.bills[i].carts.length ; j++)
			price += $scope.bills[i].carts[j].price * $scope.bills[i].carts[j].count
		$scope.bills[i].sum = price;
	}
	$scope.search={}
	$scope.resetSearch = function()
	{
		$scope.search = {};
		console.log('rest');
		console.log($scope.search)
	}
}

function BillPrintCtrl($scope, $rootScope, $routeParams, $location, $timeout)
{
	$scope.onEditBtn = function()
	{
		$scope.isEdit = true;
		$rootScope.menus = [{name:"Preview", path:"/bill/"+ $routeParams.id, icon:"fa-arrow-left", click:$scope.onBackBtn}
		
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
		$scope.saveBill($scope.bill);
		window.print();
	}

	$rootScope.menus = [{name:"Back", path:"/bill/"+ $routeParams.id, icon:"fa-arrow-left", click:$scope.onBackBtn},
		{name:"Print", path:"/bill", icon:"fa-print", click:$scope.onPrintBtn},
		{name:"Edit", path:"/bill/" + $routeParams.id, icon:"fa-edit", click:$scope.onEditBtn}
	];
	$scope.bill = $scope.bills.findById($routeParams.id);
	$scope.bill.sum = 0;
	for(var i =0; i < $scope.bill.carts.length ;i++)
		$scope.bill.sum +=  $scope.bill.carts[i].price * $scope.bill.carts[i].count
	$scope.bill.logo = "http://placehold.it/150x50";
	$scope.bill.address = "1010 สุทธิสาร ดินแดง ดินแดง กรุงเทพ 10400";
	$scope.bill.isShowSign = true;
	$scope.bill.signBy = "สมภพ กุละปาลานนท์";

}

function importXLS(){
		var dt = new Date();
        var day = dt.getDate();
        var month = dt.getMonth() + 1;
        var year = dt.getFullYear();
        var hour = dt.getHours();
        var mins = dt.getMinutes();
        var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
        //creating a temporary HTML link element (they support setting file names)
        var a = document.createElement('a');
        //getting data from our div that contains the HTML table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('report-table');
        //var table_html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
        table_html = table_div.outerHTML.replace(/ /g, '%20');
        //table_html += '</body></html>';
        a.href = data_type + ', ' + table_html;
        //setting the file name
        a.download = 'exported_table_' + postfix + '.xls';
        //triggering the function
        a.click();
        //just in case, prevent default behaviour
        
    }