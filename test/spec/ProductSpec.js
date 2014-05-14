describe('productCtrl', function(){

  var scope = {}, rootScope = {}, location = {}, timeOut = {}, item = {};
  var ctrl, initCtrl;
  
  beforeEach(module('ngRoute'));
  beforeEach(module('ngResource'));  
  beforeEach(module('itemServices'));  
  beforeEach(module('myApp')); 

 beforeEach(inject(function($injector) {
      
      //$httpBackend = _$httpBackend_;
        $httpBackend = $injector.get('$httpBackend');
           
      //$httpBackend.expectPOST('/admin/index.php?r=user/authenticate',{email:"sompop@picnii.me", password:"sompopcool"} ).
      $httpBackend.when("GET", 'data/products.json').
          respond([
				{"id":1, "initStock":10, "currentStock":5, "price":15, "cost":10, "name":"แฮมมาโย", "type":"ถูก"},
				{"id":2, "initStock":15, "currentStock":10, "price":15, "cost":10, "name":"หยองมาโย", "type":"ถูก"},
				{"id":3, "initStock":20, "currentStock":18, "price":15, "cost":10, "name":"ทูหน้า", "type":"ถูก"},
				{"id":4, "initStock":10, "currentStock":7, "price":20, "cost":12, "name":"โฮหวีตแฮมมาโย", "type":"กลาง"},
				{"id":5, "initStock":10, "currentStock":3, "price":20, "cost":12, "name":"โฮหวีตหยองมาโย", "type":"กลาง"},
				{"id":6, "initStock":5, "currentStock":1, "price":20, "cost":12, "name":"โฮหวีตทูน่า", "type":"กลาง"},
				{"id":7, "initStock":5, "currentStock":2, "price":30, "cost":20, "name":"โฮหวีตกรอบแฮมชีส", "type":"Premium"},
				{"id":9, "initStock":5, "currentStock":0, "price":30, "cost":20, "name":"โฮหวีตกรอบทูน่า", "type":"Premium"}
		]);
  
       // Get hold of a scope (i.e. the root scope)
     $rootScope = $injector.get('$rootScope');
     location = $injector.get('$location');
     browser =  $injector.get('$browser');
      scope = $rootScope.$new();
      rootScope = $rootScope;
      $controller = $injector.get('$controller');

      initCtrl = $controller(InitCtrl, {$scope: scope, $rootScope:rootScope, $location:location,  $timeout:timeOut});
      $httpBackend.expectGET('data/products.json');
	  $httpBackend.flush();
      ctrl = $controller(ProductCtrl, {$scope: scope, $rootScope:rootScope});
      
    }));
 
  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   }); 

  it('should have empty "menus" ', 	function(){
    expect(rootScope.menus.length).toBe(0);
  });

  it('should have localStorage "BizProduct" ', function(){
    var case_empty = localStorage['BizProduct'] == "";
    var case_got_one = typeof JSON.parse(localStorage['BizProduct']) == "object";
    expect(case_empty || case_got_one).toBe(true);
    if(case_got_one)
    {

    }
  })

  it('should have localStorage "BizProduct" ', function(){
    var case_empty = localStorage['BizProduct'] == "";
    var case_got_one = typeof JSON.parse(localStorage['BizProduct']) == "object";
    expect(case_empty || case_got_one).toBe(true);
  })


  it('rootScope.loadProducts should work with localStorage BizProduct', function() {
    if(localStorage['BizProduct'] != "")
    {
      var biz_product = JSON.parse(localStorage['BizProduct']) 
      rootScope.loadProducts(localStorage['BizProduct']);
      for(var i =0; i < biz_product.items; i++)
        expect(scope.items[i].id).toBe(biz_product.items[i].id);
    }
  })


  it('should create "items" model with 3 items if localStorage was empty', 	function(){
    var case_empty = localStorage['BizProduct'] == "";
    expect(typeof scope.items).toBe("object");
    if(case_empty)
    {
      
      expect(scope.items.length).toBe(3);  
    }
    
  });

  it('each "item" should have isEdit = false as default', 	function(){
    for(var i = 0; i < scope.items.length;i++)
    	expect(scope.items[i].isEdit).toBe(false);
  });

  it('each "item" should have save() should make isEdit = false', 	function(){
    for(var i = 0; i < scope.items.length;i++)
    {
    	expect(scope.items[i].isEdit).toBe(false);
    	scope.items[i].isEdit = true;
    	expect(scope.items[i].isEdit).toBe(true);
    	scope.items[i].save();
    	expect(scope.items[i].isEdit).toBe(false);
    }
  });

  it('should have is_add_new default as false', function(){
  	expect(scope.is_add_new).toBe(false);
  });

  it('should have addItem(item) that will add item to "items"', function(){
  	var current_count = new_index = scope.items.length;
  	var new_id = scope.items[scope.items.length - 1].id + 1;
  	var new_item = {name:"yo", price:40, type:"test", "initStock":5, "currentStock":5, cost:20}
  	scope.addItem(new_item);
  	expect(scope.items.length).toBe(current_count + 1);
  	expect(scope.items[new_index].id).toBe(new_id);
  	expect(scope.items[new_index].isEdit).toBe(false);
  	expect(typeof scope.items[new_index].save).toBe('function');
  })

   it('should have addItem(item) that will make is_add_new = false when succeed to add', function(){
	   	var new_item = {name:"yo", price:40, type:"test", "initStock":5, "currentStock":5, cost:20}
	   	scope.is_add_new = true;
	   	expect(scope.is_add_new).toBe(true);
	   	scope.addItem(new_item);
	   	expect(scope.is_add_new).toBe(false);
   });


});