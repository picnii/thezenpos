var LocalStore = new LocalModel('BizStore');
var LocalUser = new LocalModel('BizUser');
LocalUser._do_login = function(user)
{
	LocalUser.isLogin = true;
	LocalUser.user = user;
	LocalUser.save();
}

LocalUser.authenticate  = function(params, callback)
{
	var user  = LocalUser.get({name:params.user, password:params.password});
	if(user !== null)
	{
		LocalUser._do_login(user);
		return {id:user.id, email:user.email, status:login}
	}
	
	return {status:false, message:"user not found"};
}

LocalUser.isLogin = function(callback)
{
	var status = {status:false, message:"not login"};
	i
}

var LocalProduct = new LocalModel('BizProduct');
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

var LocalBill = new LocalModel('BizBilling')
LocalBill.addBill = function(params, callback)
{
	var bill_obj = {};
	bill_obj.isPrinted = false;
	bill_obj.carts = angular.copy(params.carts);
	var carts = params.carts
	//remove current stock
	for(var i =0; i < carts.length; i++)
	{
		var item = LocalProduct.get({id:carts[i].id});
		//$rootScope.items.findById(carts[i].id);
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
	var bill = LocalBill.get({id:params.id});
	for(var i =0; i < bill.carts.length ;i++)
	{
		var cart = bill.carts[i];
		var item = LocalProduct.get({id:cart.id});
		var oldCurrentStock = item.currentStock + cart.count;
		LocalProduct.update({id:cart.id, currentStock:oldCurrentStock});
	}
	LocalBill.delete({id:bill.id});


	if(typeof callback != "undefined")
		callback();
}