//angular.module('myApp', ["mobile-angular-ui"]);
var app = angular.module('myApp', [
  "ngRoute",
  "itemServices",
  "mobile-angular-ui",
  "mobile-angular-ui.touch",
  "mobile-angular-ui.scrollable",
  'ui.bootstrap'
])

app.config(function($routeProvider) {
      $routeProvider.when('/', { 
         templateUrl: 'pages/home.html',
         controller: 'HomeCtrl'
      }).when('/profile', { 
         templateUrl: 'pages/profile.html',
         controller: 'ProfileCtrl'
      }).when('/login', { 
         templateUrl: 'pages/login.html',
         controller: 'LoginCtrl'
      }).when('/order', { 
         templateUrl: 'pages/order/index.html',
         controller: 'OrderCtrl'
      }).when('/order/confirm', { 
         templateUrl: 'pages/order/confirm.html',
         controller: 'OrderConfirmCtrl'
      }).when('/order/payment', { 
         templateUrl: 'pages/order/payment.html',
         controller: 'OrderPaymentCtrl'
      }).when('/order/type/:name', { 
         templateUrl: 'pages/order/item.html',
         controller: 'OrderItemCtrl'
      }).when('/customer', { 
         templateUrl: 'pages/customer.html',
         controller: 'CustomerCtrl'
      }).when('/products', { 
         templateUrl: 'pages/product/index.html',
         controller: 'ProductCtrl'
      }).when('/products/create', { 
         templateUrl: 'pages/product/create.html',
         controller: 'ProductCreateCtrl'
      }).when('/register', { 
         templateUrl: 'pages/register.html',
         controller: 'RegisterCtrl'
      }).when('/stock', { 
         templateUrl: 'pages/stock/index.html',
         controller: 'StockCtrl'
      }).when('/stock/import', { 
         templateUrl: 'pages/stock/import.html',
         controller: 'StockImportCtrl'
      }).when('/stock/clear', { 
         templateUrl: 'pages/stock/clear.html',
         controller: 'StockClearCtrl'
      }).when('/bill', { 
         templateUrl: 'pages/bill/index.html',
         controller: 'BillCtrl'
      }).when('/bill/:id', { 
         templateUrl: 'pages/bill/print.html',
         controller: 'BillPrintCtrl'
      }).when('/report', { 
         templateUrl: 'pages/report/index.html',
         controller: 'ReportCtrl'
      })      ;
      // ...
  });

app.filter('new_currency', function() {
  return function(input) {
    return input + " B";
  };
});

var itemServices = angular.module('itemServices', ['ngResource']);

itemServices.factory('Item', ['$resource',
  function($resource){
    return $resource('data/:name.json', {}, {
      query: {method:'GET', params:{name:'products'}, isArray:true}
    });
  }]);

itemServices.factory('Customer', ['$resource',
  function($resource){
    return $resource('data/:name.json', {}, {
      query: {method:'GET', params:{name:'customers'}, isArray:true}
    });
  }]);


itemServices.factory('Store', ['$resource',
  function($resource){
    return $resource('data/:name.json', {}, {
      get: {method:'GET', params:{name:'store'}, isArray:false}
    });
  }]);

