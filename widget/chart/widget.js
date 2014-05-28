angular.module('chartDirective', [])
.directive('chart', function(){
	return {
		restrict:'E',
		scope:{
			chartData:'=data'
		},
		templateUrl:'widget/chart/index.html',
		link:function(scope, element,  attrs){
			console.log('chart widget')
			var elm = angular.element(element);
			scope.canvas_chart = angular.element(elm[0].querySelector('.chart'))[0];
			scope.$watch(scope.chartData, function(){
				var ctx = scope.canvas_chart.getContext("2d");
				var match_arr = {'bar':"Bar", 'pie':'Pie', 'line':'Line', 'rader':'Radar', 'polar':'PolarArea', 'doughnut':'Doughnut'};
				var index = match_arr[attrs['type']];
				if(typeof scope.chartData != 'undefined')
					scope.gen_chart = new Chart(ctx)[index](scope.chartData);
			})
			
			
		}
	}
})