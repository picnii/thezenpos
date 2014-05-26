Array.prototype.isDuplicate = function(item, options)
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
		if(typeof options == 'undefined')
			for(var key in item)
				params.push(key);
		else
			for(var i =0; i < options.length ; i++)
				params.push(options[i]);
		
		for(var i =0; i < this.length;i++)
		{
			var count = 0;
			for(var k =0; k < params.length ; k++)
			{
				var key = params[k];
				if(this[i][key] == item[key])
					count++;
			}
			console.log('check');
			console.log(this[i]);
			console.log(params);
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
	var result = this[this.findIndex(filter)];
	if(typeof result != "undefined")
		return result;
	return null;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Color()
{
	if(arguments.length == 1)
	{
		this.hex = arguments[0]
	}else if(arguments.length == 3 || arguments.length == 4)
	{
		this.r = arguments[0];
		this.g = arguments[1];
		this.b = arguments[2];
		if(arguments.length == 4)
			this.a = arguments[3]
		else
			this.a = 1;
		
	}

	var self = this;
	this.getRGB = function()
	{
		return "rgba(" + self.r + "," + self.g + "," + self.b +"," + self.a + ")";
	}
}

Color.getColorByIndex = function(index, color, color_added)
{
	if(typeof color_added == 'undefined')
		color_added = {r:200, g:0, b:0};

	var r = (color.r + color_added.r * index) % 256
	var g = (color.g + color_added.g * index) % 256;
	var b = (color.b + color_added.b * index) % 256;

	return new Color(r,g,b);
}

