describe('model/config.js', function(){

	describe('LocalStore', function(){

		it('register() should have create model with some attribute', function(){
			localStorage['BizConfig'] = '';
			var user = {email:'sompop', password:'1234'}
			var new_store = {name:'sompop',user:user};
			var create_store = LocalStore.register(new_store);
			expect(create_store.name).toEqual('sompop');
			expect(create_store.user).toEqual(user);
			expect(create_store.isEmpty).toEqual(false);
			expect(create_store.isNew).toEqual(false);
			expect(create_store.isLogin).toEqual(true);
		});

		it('load() should have load current store', function(){
			localStorage['BizConfig'] = '';
			var store = LocalStore.load();
			expect(store).toEqual({isNew:true, isEmpty:true, isLogin:false, is_use_stock:false, currency:'B', user:{}})
			store.name = "picnii";
			store.user = {email:'sompop@picnii.me', password:'1234'}
			LocalStore.register(store);
			var load_store = LocalStore.load();
			expect(load_store.name).toEqual('picnii');
			expect(load_store.user).toEqual(store.user);
			expect(load_store.isEmpty).toEqual(false);
			expect(load_store.isNew).toEqual(false);
			expect(load_store.isLogin).toEqual(true);
			expect(load_store.is_use_stock).toEqual(false);
			expect(load_store.currency).toEqual('B');
		});

		it('logout() should make isLogin = false', function(){
			var store = LocalStore.load();
			expect(store.isLogin).toEqual(true);
			LocalStore.logout();
			store = LocalStore.load();
			expect(store.isLogin).toEqual(false);
		});

		it('authenticate() should login to make change of store.isLogin', function(){
			var store = LocalStore.load();
			expect(store.isLogin).toEqual(false);
			var user = {email:'sompop', password:'1234'};
			LocalStore.authenticate(user);
			store = LocalStore.load();
			expect(store.isLogin).toEqual(false);
			user = {email:'sompop@picnii.me', password:'1234'};
			expect(store.user).toEqual(user);
			LocalStore.authenticate(user);
			store = LocalStore.load();
			expect(store.isLogin).toEqual(true);
		});

		it('isLogin() should work properly', function(){
			var store = LocalStore.load();
			expect(store.isLogin).toEqual(true);
			expect(LocalStore.isLogin()).toEqual(store.isLogin);
			LocalStore.logout();
			store = LocalStore.load();
			expect(store.isLogin).toEqual(false);
			expect(LocalStore.isLogin()).toEqual(store.isLogin);
		})

	})

	describe('LocalProduct', function(){
		it('import()', function(){

		});

		it('clearStock()', function(){

		});
	});

	describe('LocalBill', function(){
		it('addBill()', function(){
			
		});

		it('clearBills()', function(){

		});

		it('removeBill()', function(){

		});
	});
});
