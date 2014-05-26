/*
* Author Sompop Kulapalananont: sompop@picnii.me
*/
/*
* Sample of model in localstorage
* 
{
  name:'bizModel',
  items:[]
}
*/
function LocalModel(storageName)
{
	var self = this;
	this.name = this.localStorageName = storageName;
	this.localStorage = localStorage[this.localStorageName];
	this.items = [];
	if(typeof this.localStorage == "undefined")
	{
		this.localStorage = ''
	}

	this._save = function(model)
	{
		
		self.localStorage = JSON.stringify(model);
		localStorage[self.localStorageName] = self.localStorage;
		return true;
	}

	this._saveItems = function(items)
	{
		var model = {name:self.name, items:items};
		return this._save(model);
	}

	this.load = function()
	{
		var obj = JSON.parse(localStorage[self.localStorageName]);
		for(key in obj)
		{
			self[key] = obj[key];
		}
	}


	this.save = function()
	{
		return this._save({name:self.name, items:self.items});
	}

	this.query = function(callback)
	{
		if(typeof localStorage[self.localStorageName] == 'undefined' || localStorage[self.localStorageName] == '')
		{
			self.items = [];
			self.save();
			return [];
		}
		

		if(typeof localStorage[self.localStorageName] == "string" )
			self.localStorage = JSON.parse(localStorage[self.localStorageName])
		self.items = angular.copy(self.localStorage.items);
		if(typeof callback != 'undefined')
			callback(self.items);
		return self.items;
	}

	this.get = function(params, callback)
	{
		var items = self.query();
		var target = items.find(params)
		if(typeof callback != "undefined")
			callback(target);
		return target;
	}

	this.update = function(params, callback)
	{
		var items = self.query();
		var index = items.findIndex({id:params.id});
		for(var key in params)
		{
			
			items[index][key]  = params[key];	
		}
		
		self.items = items;
		
		self.save();
		if(typeof callback != "undefined")
			callback(params);
		return params;
	}

	this.delete = function(params, callback)
	{
		var items = self.query();
		var index = items.findIndex({id:params.id});
		var del_arr = items.splice(index, 1);
		self.items = items;
		self.save();
		if(typeof callback != "undefined")
			callback(del_arr[0]);
		if(index != -1)
			return true;
		return false;
	}

	this.get_next_id = function()
	{
		var items = self.query();
		if(typeof items == 'undefined' || items.length == 0)
			return 1;
		var id = items[items.length - 1].id + 1;
		return id;
	}

	this.create = function(params, callback)
	{
		var items = self.query();
		params.id = self.get_next_id();
		params.create_time = new Date();
		items.push(params);
		self.items = items;
		self.save();
		if(typeof callback != "undefined")
			callback(params);
		return params;
	}

}