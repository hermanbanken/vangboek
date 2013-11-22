(function(){
  // Register a Handlebars helper named `tags`
  //
  // Usage:
  Handlebars.registerHelper('tags', function(name, selected, source){
    var l = typeof source == 'function' ? source() : source;
    var d = document.createElement("div");
    d.className = "tags-ui";
    d.innerHTML = _.map(selected, function(item){
                    return "<div class='tag'>"+item+"<input type='hidden' name='"+name+"[]' value='"+item+"' /></div>";
                  });
    d.innerHTML += "<textarea></textarea>";
    $(d).on("click", function(e){
      if(e.target == this) $(this).find("textarea").focus();
    }).on("keyup", function(e){
      if([13,188].indexOf(e.keyCode)){
        var t = $(this).find('textarea'),
            value = t.val();
        t.val("").prepend("<div class='tag'>"+item+"<input type='hidden' name='"+name+"[]' value='"+value+"' /></div>");
        selected.push(value);
      }
    });
      d.addEventListener("click", function(e){
        if(e.target.className == 'tags-ui'){
          
        }
      }, false);
  });
  
  Handlebars.registerHelper('datef', function(date, format){
    return moment(date).format(format);
  });
  
  /* Mimic Meteor's idStringify function */
  /* @see: https://github.com/meteor/meteor/blob/00884756993234ce3d42f24170f06d58d9682e0f/packages/handlebars/evaluate-handlebars.js#L43-L61 */
  var idStringify = Package.minimongo
    ? Package.minimongo.LocalCollection._idStringify
    : function (id) { return id; };

  /* Mimic Meteor's each helper */
  /* @see: https://github.com/meteor/meteor/blob/00884756993234ce3d42f24170f06d58d9682e0f/packages/handlebars/evaluate-handlebars.js#L43-L61 */
  Handlebars.registerHelper('groupBy', function(data, groupKey, options){
    var parentData = this;
    if(typeof groupKey != 'string') {
      options = groupKey;
      groupKey = "type";
    }
  
    if (data.fetch) data = data.fetch();
  
    if (data && data.length > 0)
      return _.chain(data).groupBy(groupKey).map(function(list, groupId) {
        // infer a branch key from the grouping parameter
        var branch = "branch." + groupId;
        return Spark.labelBranch(branch, function(){
          return options.fn({ group: groupId, list: list });
        });
      }).value().join('');
    else
      return Spark.labelBranch(
        'else',
        function () {
          return options.inverse(parentData);
        });
  });

  Handlebars.registerHelper('stringify', function(arg){
    return JSON.stringify(arg);
  });
  
  Handlebars.registerHelper('suggest', function(field, unique, collection){
    return Template['suggest']({
      field: field,
      key: unique,
      collection: collection
    });
  });
  
  Template.suggest.suggestions = function(){
    var key = this.key;
    var fields = Session.get(this.key) && _(this.field.split(';')).map(function(field){
      var o = {};
      o[field] = new RegExp(Session.get(key),'ig');
      return o;
    }) || false;
    return this.collection.find(fields && {$or: fields} || {_id:"notfound"});
  };
  Template.suggest.events = {};
  
})();