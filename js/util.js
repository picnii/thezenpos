Array.prototype.isDuplicate = function(item)
{
	
	if(typeof item != "object")
	{
	
		for(var i =0; i < this.length;i++)
			if(this[i] == item)
				return true;	
	}else
	{
		
		//assume it's a array
		var params = [];
		for(var key in item)
			params.push(key);
		
		for(var i =0; i < this.length;i++)
		{
			var count = 0;
			for(var k =0; k < params.length ; k++)
			{
				var key = params[k];
				if(this[i][key] == item[key])
					count++;
			}

			if(count == params.length && params.length > 0)
				return true;
		}
	}
	
	return false;
}

Array.prototype.findIndex = function(filter)
{
	if(typeof filter == "object")
	{
		var params = [];
		for(var key in filter)
			params.push(key);
		for(var i =0; i < this.length; i++)
		{
			var count = 0;
			for(var k =0; k < params.length ; k++)
			{
				var key = params[k];
				if(this[i][key] == filter[key])
					count++;
			}

			if(count == params.length && params.length > 0)
				return i;
		}
	}
	return null;
}

Array.prototype.find = function(filter)
{
	return this[this.findIndex(filter)];
}
