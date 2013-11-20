Bills = new Meteor.Collection("bills", {transform: function(doc){
  if(doc.note && !doc.title) doc.title = doc.note;
  return new Bill(doc);
}});

Changes = new Meteor.Collection("changes", {transform: function(doc){
  return new Change(doc);
}});

Bill = function (doc){
  _.extend(this, doc);
}

Bill.prototype = {
  constructor: Bill,
  
  changes: function(filter, options){
    // Remove options from Handlebars, only allow internal use
    if(typeof filter != 'object' || filter.hash) filter = {};
    if(typeof options != 'object' || options.hash) options = {};
    
    _.extend(filter, {billId: this._id});
    return Changes.find(filter, options);
  },

  sumFor: function(user){
    return _.reduce(this.changesFor(user).fetch(), function(sum, item){ 
      return sum + item.change 
    }, 0);
  },
  changesFor: function(user){
    return this.changes({$or: [{userId: user && user._id}, {userId: user}]});
  },
  
  changesByType: function(type){
    return this.changes({type: type});
  },
};

/* Mimic Meteor's idStringify function */
/* @see: https://github.com/meteor/meteor/blob/00884756993234ce3d42f24170f06d58d9682e0f/packages/handlebars/evaluate-handlebars.js#L43-L61 */
var idStringify = Package.minimongo
  ? Package.minimongo.LocalCollection._idStringify
  : function (id) { return id; };

if(Meteor.isClient)
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

if(Meteor.isClient)
Handlebars.registerHelper('stringify', function(arg){
  return JSON.stringify(arg);
});

Change = function (doc){
  _.extend(this, {
    change: 0,
    userId: null,
    billId: null,
    type: "",
    note: "",
  }, doc);
}

Change.prototype = {
  constructor: Change,
  
  user: function(){
    return Meteor.users.findOne({ _id: this.userId });
  }
}