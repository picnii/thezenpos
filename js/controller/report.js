
function ReportCtrl($scope, $rootScope)
{
	$rootScope.menus = [];
	 LocalBill.query(function(bills){
	 	$scope.bills =bills;
		for(var i =0; i < $scope.bills.length;i++)
		{

			var bill = $scope.bills[i];
			if(typeof bill.create_time == "string")
				bill.create_time = new Date(bill.create_time)
		}
	})
	var hour_time =[], sales =[], costs =[];
	var init_date = $scope.bills[0].create_time.getDate();
	var init_hour = $scope.bills[0].create_time.getHours() ;
	var last_index = $scope.bills.length - 1;
	var des_date =  $scope.bills[last_index].create_time.getDate();
	var des_hour = $scope.bills[last_index].create_time.getHours() ;
	
	for(var d = init_date; d <= des_date; d++)
	{
		if(d == init_date)
			var start_hour = init_hour;
		else
			var start_hour = 0;
		
		for(var h = start_hour; h <= 23; h++)
		{
			var sum = 0;
			
			//check bill that match d and h range
			for(var b = 0; b < $scope.bills.length;b++)
			{
				var bill = $scope.bills[b];
				var correct_hour_range = bill.create_time.getHours() == h;
				var correct_date_range = bill.create_time.getDate() == d
				
				if(correct_date_range && correct_hour_range)
					for(var c =0; c < bill.carts.length; c++)
						sum += bill.carts[c].price * bill.carts[c].count
				if(correct_date_range && correct_hour_range)
				{
					console.log('found it')
					console.log(bill)
					console.log(sum)
				}
			}
			if((h == init_hour && d == init_date) || (h == des_hour && d == des_date) )
				hour_time.push(h + ".00");
			else
				hour_time.push(" ")
			//console.log('test')
			//console.log(sum)
			sales.push(sum);
		
		}
	}

	var data = {
	labels : hour_time,
	datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				data : sales
			}
		]
	}
	var ctx = document.getElementById("overall-chart").getContext("2d");
	var myNewChart = new Chart(ctx).Line(data);

	$scope.reports = [];
	for(var i =0; i < $scope.bills.length; i++)
	{
		
		for(var j =0; j < $scope.bills[i].carts.length; j++)
		{
			var report_obj = {};
			report_obj.create_time = $scope.bills[i].create_time;
			var item = $scope.bills[i].carts[j];
			report_obj.bill = $scope.bills[i].id;
			report_obj.name = item.name
			report_obj.price = item.price;
			report_obj.count = item.count;
			$scope.reports.push(report_obj);
		}
		
	}
	console.log($scope.reports)
}


function importXLS(){
		var dt = new Date();
        var day = dt.getDate();
        var month = dt.getMonth() + 1;
        var year = dt.getFullYear();
        var hour = dt.getHours();
        var mins = dt.getMinutes();
        var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
        //creating a temporary HTML link element (they support setting file names)
        var a = document.createElement('a');
        //getting data from our div that contains the HTML table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('report-table');
        //var table_html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
        table_html = table_div.outerHTML.replace(/ /g, '%20');
        //table_html += '</body></html>';
        a.href = data_type + ', ' + table_html;
        //setting the file name
        a.download = 'exported_table_' + postfix + '.xls';
        //triggering the function
        a.click();
        //just in case, prevent default behaviour
        
    }