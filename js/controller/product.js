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
			LocalProduct.update(this, function(){
				$scope.items = LocalProduct.query();
			})
		}
		item.delete = function()
		{
			if(confirm("Are you sure to delete this product?"))
				LocalProduct.delete(this, function(){
					$scope.items = LocalProduct.query();
				})
		}
		return angular.copy(item);
	}

	/*
	* Init Zone
	*/
	//$rootScope.loadProducts();
	
	$scope.items = LocalProduct.query();
	for(var i =0; i < $scope.items.length; i++)
	{
		$scope.items[i] = $scope.setCRUDforItem($scope.items[i]);
	}

	$scope.addItem = function(item)
	{
		item.initStock = 0;
		item.currentStock =0;
		LocalProduct.create(item, function(){
			$scope.items = LocalProduct.query();
		});
		$scope.is_add_new = false;
	}
}