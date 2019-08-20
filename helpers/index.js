var register = function(Handlebars) {
    var helpers = {
        ifeq: function(a, b, options){
            if(a === b)
                return options.fn(this);
            return options.inverse(this);
        },
        embedsrc: function(object){
            if(typeof object != 'string')
                return "";
            return "https://www.youtube.com/embed/"+object.substr(-11);
        },
        checkArr: function(a, b, options){
            if(a == null)
                return options.inverse(this);
            if(!Array.isArray(a))
                return options.inverse(this);
            if(a.includes(b))
                return options.fn(this);
            return options.inverse(this);
        },
        checkNArr: function(a, b, options){
            if(a == null)
                return options.fn(this);
            if(!Array.isArray(a))
                return options.fn(this);
            if(a.includes(b))
                return options.inverse(this);
            return options.fn(this);
        },
        for: function(n, block) {
            var accum = '';
            for(var i = 0; i < n; ++i){
                block.data.index = i;
                block.data.adjindex = i + 1;
                accum += block.fn(i);
            }
            return accum;
        }
    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      for (var prop in helpers) {
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        return helpers;
    }
  
  };
  
  module.exports.register = register;
  module.exports.helpers = register(null);
