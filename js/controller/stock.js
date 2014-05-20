
function StockCtrl ($scope, $rootScope) {
	// body...
	$rootScope.menus = [{name:"Import", path:"/stock/import", icon:"fa-download"}, {name:"Clear Stock", path:"/stock/clear", icon:"fa-circle"}]
	//{name:"Import", path:"/stock/import", icon:"fa-download"}
	$scope.items = LocalProduct.query();
}

function StockClearCtrl($scope, $rootScope, $location, $filter)
{
	$rootScope.menus = [{name:"Back", path:"/stock", icon:"fa-arrow-left"}]
	$scope.items = LocalProduct.query();
	for(var i = 0; i < $scope.items; i++)
		$scope.items[i].tossed = false;

	$scope.clearStock = function()
	{
		if(confirm('Are you sure to clear all these stock?'))
		{
			var tossed_items = $filter('filter')($scope.items,{tossed:true});
			
			LocalProduct.clearStock({items:tossed_items}, function(){
				$location.path('/stock')	
			})
			/*
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
			$location.path('/stock')	*/
		}	
	}
}

function StockImportCtrl($scope, $rootScope, $location)
{
	$rootScope.menus = []
	$scope.import_items = [];
	$scope.items = LocalProduct.query();
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
		LocalProduct.import({items:$scope.import_items}, function(){
			$location.path('/stock');
		})/*
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
		
		$rootScope.saveProducts($scope.items);
		$location.path('/stock');*/
	}
}