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
			
			console.log('gonna update');
			console.log(target);
			var result =LocalProduct.update({id:target.id, currentStock:target.currentStock, initStock:target.initStock});
			console.log(result)
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

LocalBill.removeBill = function(params, callback)
{

}