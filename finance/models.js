Bills = new Meteor.Collection("bills", {transform: function(doc){
  if(doc.note && !doc.title) doc.title = doc.note;
  return new Bill(doc);
}});

Bills.allow({
  insert: function(userId, doc){
    console.log(Roles.userIsInRole(userId, ['admin']));
    return Roles.userIsInRole(userId, ['admin']);
  },
  update: function(userId, doc, fieldNames, modifier){
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function(userId, doc){
    return Roles.userIsInRole(userId, ['admin']);
  },  
});

Changes = new Meteor.Collection("changes", {transform: function(doc){
  return new Change(doc);
}});

Changes.allow({
  insert: function(userId, doc){
    return Roles.userIsInRole(userId, ['admin']);
  },
  update: function(userId, doc, fieldNames, modifier){
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function(userId, doc){
    return Roles.userIsInRole(userId, ['admin']);
  },
});

Bill = function (doc){
  _.extend(this, doc);
}

Bill.prototype = {
  constructor: Bill,
  
  /* Return all splits that are defined either by Changes.type or in the splitTYpes field */
  splits: function(){
    var c = _.chain(this.changes().fetch()).groupBy("type").value(),
        self = this;
    // Wrap
    for(n in c){
      c[n] =  { name: n, list: this.changes({type: n}) };
    }
    var t = _.chain(this.splitTypes || []).map(function(item){
      if(typeof item == 'string')
        return {name: item, list: self.changes({type: item})};
      if(typeof item == 'object' && item.name)
        return {name: item.name, list: self.changes({type: item.name})};
    }).indexBy('name').value();
    return _.values(_.extend(t, c));
  },
    
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
  
  /* Missing money: change - total in changes */
  difficiency: function(){
    var totalInChange = _.reduce(this.changes().map(function(doc){
      return doc.change;
    }), function(sum, i){ return sum+= i; }, 0);
    return this.change - totalInChange;
  },
  
  hasDifficiency: function(){
    return this.difficiency() > 0.01 || this.difficiency() < -0.01;
  },
  
  updateComputed: function(){
    var changes = _.groupBy(this.changes().fetch(), function(other){
      return other.computed ? 'computed': 'static';
    });
    var computedAmount = _.reduce(changes.computed, function(sum, i){
      return sum += parseFloat(i.amount) || 1;
    }, 0);
    var staticTotal = -_.reduce(changes.static, function(sum, i){
      return sum += parseFloat(i.change) || 0;
    }, 0);
    var costs = staticTotal + this.change;
    
    // Updated all Changes that have been altered
    _.map(changes.computed || [], function(doc){
      var c = doc.amount * costs / computedAmount;
      if(c != doc.change)
        Changes.update({_id: doc._id}, {$set: {change: c}});
    });
  }
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
  },
  bill: function(){
    return Bills.findOne({ _id: this.billId });
  }
}

var recalc = function(doc, old){
  var b = Bills.findOne({_id: doc.billId});
  if(b) b.updateComputed(); 
};
Changes.find({computed: true}).observe({
  added: recalc,
  removed: recalc,
  changed: function(doc, old){
    if(doc.amount != old.amount) recalc(doc, old);
  }
});
Changes.find({'$or': [{'computed': {'$exists': false}}, {'computed': false}]}).observe({
  added: recalc,
  changed: recalc,
  removed: recalc
});
if(Meteor.isServer)
Bills.find({}, {field: ['change']}).observeChanges({
  removed: function(id){
    Changes.remove({billId: id});
  },
  changed: function(id, fields){
    Bills.findOne({_id: id}).updateComputed();
  }
});

if(Meteor.isServer){
Meteor.publish(null, function () {
  return [
    Bills.find(),
    Changes.find()
  ];
});
Meteor.publish('bill', function(id){
  return Bills.find({_id: id});
});
}