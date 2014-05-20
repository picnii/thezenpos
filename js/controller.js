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
		var cart = $rootScope.carts.findById(item.id);
		if(cart.count - 1 >= 0)
			cart.count--;
		
	}

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
	LocalBill.query(function(bills){
		$scope.bills = bills;
		for(var i =0; i < $scope.bills.length;i++)
		{
			var bill = $scope.bills[i];
			if(typeof bill.create_time == "string")
				bill.create_time = new Date(bill.create_time)
		}
	})
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

function ReportCtrl($scope, $rootScope)
{
	$rootScope.menus = [];
	 LocalBill.query(function(bills){
	 	$scope.bills =bills;
		for(var i =0; i < $scope.bills.length;i++)
		{

			var bill = $scope.bills[i];
			if(typeof bill.create_time == "string")
				bill.create_time = new Date(bill.create_time)
		}
	})
	var hour_time =[], sales =[], costs =[];
	var init_date = $scope.bills[0].create_time.getDate();
	var init_hour = $scope.bills[0].create_time.getHours() ;
	var last_index = $scope.bills.length - 1;
	var des_date =  $scope.bills[last_index].create_time.getDate();
	var des_hour = $scope.bills[last_index].create_time.getHours() ;
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
				var correct_hour_range = bill.create_time.getHours() == h;
				var correct_date_range = bill.create_time.getDate() == d
				
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
			report_obj.create_time = $scope.bills[i].create_time;
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

function CustomerCtrl($scope, Customer, $rootScope)
{
	$rootScope.menus = [];
	$scope.customers = Customer.query();
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