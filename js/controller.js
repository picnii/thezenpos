function InitCtrl($rootScope, $location, $timeout, Item)
{
	$rootScope.appName = "Menu"
	$rootScope.storeName = "The Zen Pos"
	//$rootScope.items = Item.query();
	$rootScope.orders = [];
	$rootScope.isLogin = function()
	{
		return LocalStore.isLogin();
	}

	$rootScope.authenticate = function(user, callback)
	{

		//authenticaate local
		LocalStore.authenticate(user, function(user_info){
			if(user_info.status){
				$rootScope.is_user_login = true;
				$rootScope.user = user_info;
				$rootScope.store.user = user_info;
				callback();
			}
			else
			{
				$rootScope.is_user_login = false;
				document.getElementById('login-overlay').click();
			}	
		})
		
	}

	$rootScope.logout = function()
	{
		//localStorage.iv_user = "";

		LocalStore.logout(function(){
			$rootScope.is_user_login = false;
			$rootScope.checkLogin();
		})
		
	}

	$rootScope.checkLogin = function()
	{
		console.log('check login before');
		return  LocalStore.isLogin(function(status){
			console.log('check login')
			console.log(status)
			$rootScope.is_user_login = status;
			if(!$rootScope.is_user_login)
				$location.path('/login');
		})
		
	}

	$rootScope.addToCart = function(item)
	{
		if(!$rootScope.carts.isDuplicate(item, ['id']))
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
	//initApp
	$rootScope.clearCarts();
	$rootScope.device = {};
	$rootScope.device.name = navigator.userAgent;
	$rootScope.device.isMobile =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	$rootScope.store = LocalStore.load(function(store){
		$rootScope.user = store.user;
		
		if(store.isEmpty)
			$location.path('/register')
		else
		{
			
			$rootScope.storeName = store.name;
			$rootScope.checkLogin();
		}
	});
	console.log('InitCtrl')
}

app.run(InitCtrl)


function CustomerCtrl($scope, Customer, $rootScope)
{
	$rootScope.menus = [];
	$scope.customers = Customer.query();
}

