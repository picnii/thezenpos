describe('model/model.js', function(){
	it('create name, localStorage, items[] after init Model', function(){
		localStorage['testModel'] = undefined;
		var model = new LocalModel('testModel');
		expect(model.name).toBe('testModel');
		expect(model.localStorage).toBe(localStorage['testModel']);
		expect(model.items.length).toBe(0);
		expect(angular.isArray(model.items) ).toBe(true);
	})

	it('_save() = Parse Object into localStorage', function(){
		var model = new LocalModel('testModel');
		var new_model = {test:'1234', yo:12};
		model._save(new_model);
		var tmp = localStorage['testModel'];
		var expected = JSON.stringify(new_model);
		expect(tmp).toBe(expected);
	})

	it('save() = create object{name:"somename", items:[]} then _save()', function(){
		localStorage['testModel'] = undefined;
		var model = new LocalModel('testModel');
		model.items = [1,2,3,4,5];
		model.save();
		var expected = JSON.stringify({name:'testModel', items:[1,2,3,4,5]});
		expect(localStorage['testModel']).toBe(expected);
	})

	it('_saveItems() = save only items in model', function(){
		localStorage['testModel'] = undefined;
		var model = new LocalModel('testModel');
		model._saveItems([1,2,3])
		var expected = JSON.stringify({name:'testModel', items:[1,2,3]});
		expect(localStorage['testModel']).toBe(expected);
	})

	it('load() = load localStorage to model', function(){
		localStorage['testModel'] = undefined;
		var model = new LocalModel('testModel');
		model.items = [1,2,3,4,5];
		model.save();
		var load_model = new LocalModel('testModel');
		load_model.load();
		expect(load_model.name).toBe(model.name);
		expect(load_model.items).toEqual(model.items);
	})

	describe('CRUD in model.js', function(){
		var model, load_model
		beforeEach(function(){
			localStorage['testModel'] = undefined;
			model = new LocalModel('testModel');
			model.items = [];
			for(var i =0; i < 10; i++)
			{
				var new_obj = {id:i+1, name:i+'x', age:i};
				model.items.push(new_obj);
			}
			model.save();
			load_model = new LocalModel('testModel');
			load_model.load();
		})

		it('query() = get all items in model', function(){
			
			var items = load_model.query();
			expect(items).toEqual(model.items);
		})

		it('get() = get item in items by attribute', function(){
			var first_item = load_model.get({id:1});
			expect(first_item).toEqual(model.items[0]);
			var second_item_by_name = load_model.get({name:'1x'});
			expect(second_item_by_name).toEqual(model.items[1]);
			var third_item_by_age = load_model.get({age:2});
			expect(third_item_by_age).toEqual(model.items[2]);
			var none_item = load_model.get({id:1, age:2});
			expect(none_item).toEqual(null);
		})

		it('update() = find item by id then update other attribute', function(){
			model.update({id:1, name:'test'}, function(){
				expect(model.items[0]).toEqual({id:1, name:'test', age:0})
			})
			expect(model.items[0]).toEqual({id:1, name:'test', age:0});
			load_model.load();
			expect(load_model.items[0]).toEqual(model.items[0])
		})

		it('create() = create new item for items', function(){
			var create_index = model.items.length ;
			var create_id = model.get_next_id();
			var create_time = new Date();
			var new_item = {name:'test_create', age:20};
			model.create(new_item, function(create_item){
				expect(model.items[create_index]).toEqual(create_item);
				expect(create_item.name).toEqual('test_create')
				expect(create_item.id).toEqual(create_id)
				expect(create_item.age).toEqual(20)
				expect(create_item.create_time+'').toEqual(create_time+'')
			})
			
		})
	})

});