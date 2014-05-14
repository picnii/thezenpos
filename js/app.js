//angular.module('myApp', ["mobile-angular-ui"]);
var app = angular.module('myApp', [
  "ngRoute",
  "itemServices",
  "mobile-angular-ui",
  "mobile-angular-ui.touch",
  "mobile-angular-ui.scrollable"
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
         templateUrl: 'pages/order.html',
         controller: 'OrderCtrl'
      }).when('/order/confirm', { 
         templateUrl: 'pages/order-confirm.html',
         controller: 'OrderConfirmCtrl'
      }).when('/order/payment', { 
         templateUrl: 'pages/order-payment.html',
         controller: 'OrderPaymentCtrl'
      }).when('/order/type/:name', { 
         templateUrl: 'pages/order-item.html',
         controller: 'OrderItemCtrl'
      }).when('/customer', { 
         templateUrl: 'pages/customer.html',
         controller: 'CustomerCtrl'
      }).when('/products', { 
         templateUrl: 'pages/products.html',
         controller: 'ProductCtrl'
      }).when('/register', { 
         templateUrl: 'pages/register.html',
         controller: 'RegisterCtrl'
      }).when('/stock', { 
         templateUrl: 'pages/stock.html',
         controller: 'StockCtrl'
      }).when('/stock/import', { 
         templateUrl: 'pages/import.html',
         controller: 'ImportCtrl'
      }).when('/stock/clear', { 
         templateUrl: 'pages/clearstock.html',
         controller: 'ClearStockCtrl'
      }).when('/bill', { 
         templateUrl: 'pages/bills.html',
         controller: 'BillCtrl'
      }).when('/bill/:id', { 
         templateUrl: 'pages/bill-print.html',
         controller: 'BillPrintCtrl'
      }).when('/report', { 
         templateUrl: 'pages/report.html',
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
