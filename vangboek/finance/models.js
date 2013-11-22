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