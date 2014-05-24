describe('util.js', function(){

   it('should be able to findItemBy find() and other attribute', function(){
	   	var peoples = [
        {id:0, name:"sompop", age:25},
        {id:1, name:"best", age:50}
      ];

      var ppl = peoples.find({id:0});
      expect(ppl.name).toBe("sompop");
      expect(ppl.age).toBe(25);
      var ppl_best = peoples.find({age:50});
      expect(ppl_best.name).toBe("best");
      expect(ppl_best.id).toBe(1)
   });

   it('should be able to find an Duplicate Item by isDuplicate()', function(){
       var types = ['gas', 'o2', 'do2'] ;
       expect(types.isDuplicate('ga')).toBe(false);
       expect(types.isDuplicate('gas')).toBe(true);
       var peoples = [
          {id:0, name:"sompop", age:25},
          {id:1, name:"best", age:50}
        ];
        expect(peoples.isDuplicate({id:0, name:"sompop", age:25})).toBe(true);
        expect(peoples.isDuplicate({id:0, name:"sompop", age:27})).toBe(false);
   });



});