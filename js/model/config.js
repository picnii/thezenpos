var LocalStore = new LocalModel('BizConfig');
var LocalUser = new LocalModel('BizUser');
var LocalBill = new LocalModel('BizBilling');
var LocalProduct = new LocalModel('BizProduct');

LocalStore.authenticate  = function(params, callback)
{
	//store always have only 1
	var store = LocalStore.query()[0];
	if(store.user.email == params.email && store.user.password == params.password)
	{
		
		store.isLogin = true;
		LocalStore.update(store);
		if(typeof callback != "undefined")
		 	callback({email:store.user.email, status:true, user:store.user})
		return {email:store.user.email, status:true, user:store.user}
	}
	
	if(typeof callback != "undefined")
		callback({status:false, message:"user not found"})
	return {status:false, message:"user not found"};
}

LocalStore.isLogin = function(callback)
{
	var store = LocalStore.query()[0];
	if(typeof callback != "undefined")
		callback(store.isLogin)
	return store.isLogin;
}

LocalStore.logout = function(callback)
{
	var store = LocalStore.query()[0];
	store.isLogin = false;
	LocalStore.update(store);
	if(typeof callback != "undefined")
		callback();
	return true;
}

LocalStore.load = function(callback)
{
	var stores = LocalStore.query();
	
	if(typeof stores == 'undefined' || stores.length == 0)
	{
		var new_store = {};
		new_store.isNew  = true;
		new_store.isLogin = false;
		new_store.isEmpty = true;
		new_store.is_use_stock = false;
		new_store.currency = 'B'
		new_store.receiver_position = 'Manager';
		new_store.receiver = "Sompop Kulapalanont";
		new_store.address = "1010 Suthisan Rd. Dindang Dindang Bangkok 10400"
		new_store.user ={};
		if(typeof callback != 'undefined')
			callback(new_store);
		return new_store;
	}else{
		if(typeof callback != 'undefined')
			callback(stores[0]);
		return stores[0];
	}
}

LocalStore.register = function(store, callback)
{
	store.isNew = false;
	store.isLogin = true;
	store.isEmpty = false;
	var result = LocalStore.create(store);
	if(typeof callback != "undefined")
		callback(result);
	return result;
}

LocalProduct.import = function(params, callback)
{
	var import_items = params.items;
	for(var i =0; i < import_items.length;i++)
	{
		var import_product = import_items[i];
		var target = LocalProduct.get({id:import_product.product.id});
		if(target != null)
		{
			console.log(import_product);
			if(isNaN(target.currentStock) )
			{
				target.currentStock = import_product.count;
				target.initStock = import_product.count;
			}
			target.currentStock += import_product.count;
			if(target.currentStock >= target.initStock)
				target.initStock = target.currentStock;
			var result =LocalProduct.update({id:target.id, currentStock:target.currentStock, initStock:target.initStock});
		}
	}
	if(typeof callback != "undefined")
		callback();
}

LocalProduct.clearStock = function(params, callback)
{
	var tossed_items = params.items;
	//reset all initStock
	var items = LocalProduct.query();
	for(var i=0; i < items.length ;i++)
	{
		items[i].initStock = items[i].currentStock;
		for(var j =0; j <tossed_items.length ; j++)
		{
			if(tossed_items[j].id == items[i].id)
			{
				console.log('found')
				items[i].initStock = items[i].currentStock = 0;
				break;	
			}
		}
	}
	console.log('gonna save items');
	console.log(items);
	LocalProduct._saveItems(items);
	if(typeof callback != "undefined")
		callback();
}


LocalBill.addBill = function(params, callback)
{
	var store = LocalStore.load();
	var bill_obj = {};
	bill_obj.isPrinted = false;
	bill_obj.carts = angular.copy(params.carts);
	var carts = params.carts
	//remove current stock
	for(var i =0; i < carts.length; i++)
	{
		var item = LocalProduct.get({id:carts[i].id});
		//$rootScope.items.findById(carts[i].id);
		if(store.is_use_stock)
			item.currentStock -= carts[i].count;
		LocalProduct.update({id:item.id,currentStock:item.currentStock});
	}
	var bill = LocalBill.create(bill_obj)
	if(typeof callback != "undefined")
		callback(bill);
}

LocalBill.clearBills = function(callback)
{
	var items = [];
	LocalBill._saveItems(items);
	if(typeof callback != "undefined")
		callback();
}

LocalBill.removeBill = function(params, callback)
{
	var store = LocalStore.load();
	var bill = LocalBill.get({id:params.id});
	for(var i =0; i < bill.carts.length ;i++)
	{
		var cart = bill.carts[i];
		var item = LocalProduct.get({id:cart.id});
		if(store.is_use_stock)
			var oldCurrentStock = item.currentStock + cart.count;
		LocalProduct.update({id:cart.id, currentStock:oldCurrentStock});
	}
	LocalBill.delete({id:bill.id});


	if(typeof callback != "undefined")
		callback();
}