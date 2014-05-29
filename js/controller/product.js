function ProductCtrl($scope, $rootScope)
{
	$rootScope.menus = [{name:"Add New", path:"/products/create", icon:"fa-plus"}];
	if($scope.store.is_use_stock)
		$rootScope.menus.push({name:"Import", path:"/stock/import", icon:"fa-download"});
	$scope.is_add_new = false;
	$scope.setCRUDforItem = function(item)
	{
		item.isEdit = false;
		item.save = function()
		{
			this.isEdit = false;
			LocalProduct.update(this, function(){
				$scope.refresh();
			})
		}
		item.delete = function()
		{
			if(confirm("Are you sure to delete this product?"))
				LocalProduct.delete(this, function(){
					$scope.refresh();
				})
		}
		return angular.copy(item);
	}

	/*
	* Init Zone
	*/
	//$rootScope.loadProducts();
	
	$scope.refresh = function()
	{
		$scope.items = LocalProduct.query();
		for(var i =0; i < $scope.items.length; i++)
		{
			$scope.items[i] = $scope.setCRUDforItem($scope.items[i]);
		}
	}
	$scope.refresh();

	$scope.addItem = function(item)
	{
		item.initStock = 0;
		item.currentStock =0;
		LocalProduct.create(item, function(){
			$scope.refresh();
		});
		$scope.is_add_new = false;
	}
}

function ProductCreateCtrl($scope, $rootScope, $location, $timeout)
{
	$scope.onClickForSave = function()
	{
		$timeout(function(){
			$scope.addItem($scope.item);
		}, 50)
		
	}

	$rootScope.menus = [{name:"BACK", path:"/products", icon:"fa-arrow-left" }, {name:"Save", path:"/products/create", icon:"fa-save", click:$scope.onClickForSave }];	

	$scope.addItem = function(item)
	{
		item.initStock = 0;
		item.currentStock =0;
		if(item.have_photo)
			item.img_src  = $scope.img_src;
		LocalProduct.create(item, function(){
			$location.path('/products');
		});
	}

	$scope.capturePhoto = function(type)
	{
		if (!navigator.camera) {
          alert("Camera API not supported", "Error");
	          return;
	      }
		navigator.camera.getPicture(function(imageURI){
				$scope.$apply(function(){
					$scope.successPhoto(imageURI);
				})
			}, function(message){
				$scope.$apply(function(){
					$scope.failPhoto(message);
				})
			}, { quality: 40,
				sourceType:type,
	    	destinationType: Camera.DestinationType.DATA_URL,
	    		targetWidth: 150,
  				targetHeight: 150
	    	 });
	}

	$scope.takePhoto = function()
	{
		$scope.capturePhoto( Camera.PictureSourceType.CAMERA);
	}

	$scope.loadPhoto = function()
	{
		$scope.capturePhoto( Camera.PictureSourceType.PHOTOLIBRARY);
	}

	$scope.item = {};
	$scope.img_src = ""
	$scope.item.have_photo = false;
	$scope.successPhoto = function(imageURI)
	{
		$scope.img_src = "data:image/jpeg;base64," + imageURI;
		$scope.item.have_photo = true;
	}

	$scope.failPhoto = function(message)
	{
		setTimeout(function() {
		    // do your thing here!
		    alert('Failed because: ' + message);
		}, 0);
		
	}
}

function ProductUpdateCtrl($scope, $rootScope, $location, $timeout, $routeParams)
{	
	$scope.item = LocalProduct.get({id:$routeParams.id}, function(item){
		if(!item.have_photo)
			$scope.img_src = ""
		else
			$scope.img_src = item.img_src
	});

	$scope.saveItem = function(item)
	{
		if(item.have_photo)
			item.img_src = $scope.img_src;
		else
			item.img_src = "";
		LocalProduct.update(item, function(){
			$location.path('/products');
		});
	}

	$scope.successPhoto = function(imageURI)
	{
		$scope.img_src = "data:image/jpeg;base64," + imageURI;
		$scope.item.have_photo = true;
	}

	$scope.failPhoto = function(message)
	{
		setTimeout(function() {
		    // do your thing here!
		    alert('Failed because: ' + message);
		}, 0);
		
	}

	$scope.capturePhoto = function(type)
	{
		if (!navigator.camera) {
          alert("Camera API not supported", "Error");
	          return;
	      }
		navigator.camera.getPicture(function(imageURI){
				$scope.$apply(function(){
					$scope.successPhoto(imageURI);
				})
			}, function(message){
				$scope.$apply(function(){
					$scope.failPhoto(message);
				})
			}, { quality: 40,
				sourceType:type,
	    	destinationType: Camera.DestinationType.DATA_URL,
	    		targetWidth: 150,
  				targetHeight: 150
	    	 });
	}

	$scope.takePhoto = function()
	{
		$scope.capturePhoto( Camera.PictureSourceType.CAMERA);
	}

	$scope.loadPhoto = function()
	{
		$scope.capturePhoto( Camera.PictureSourceType.PHOTOLIBRARY);
	}

	$scope.onClickForSave = function()
	{
		$timeout(function(){
			$scope.saveItem($scope.item);
		}, 50)
		
	}

	$rootScope.menus = [{name:"BACK", path:"/products", icon:"fa-arrow-left" }, {name:"Save", path:"/products/update/"+$routeParams.id, icon:"fa-save", click:$scope.onClickForSave }];	


}