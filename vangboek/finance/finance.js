/*Meteor.publish("liquidity", function(userId){
  var billsForUser = bills.find({users: {
      $elemMatch: {
        'userId': this._id
      }
    }});
  return _.reduce(billsForUser, function(sum, bill){ 
    sum += _.reduce(bill.users, function(sum, user){
      if(user.userId == userId) sum += user.change;
    }, 0);
  }, 0);  
});*/

Meteor.startup(function(){
  
  /*bills.insert({date: new Date, change: 188, type: 'event', note: "Drinking at Wednesday", users: [{
    userId: "4WgGXjQeSGSySWHsW",
    change: 10,
    note: 'ho'
  }]})*/
  
});

if(Meteor.isClient){
  Template.bills.bills = function(){
    if(this._id){
      var ids = Changes.find({userId: this._id}, {fields: { billId: 1 }}).fetch();
      return Bills.find({_id: { $in: _.pluck(ids, "billId") }});
    }
    else
    return Bills.find();
  }
  
  Template.bill.model = function(){
    return Bills.findOne({
      _id: Router.current().params._id
    });
  }
  Template.bill.changes = function(){
    return Changes.find({
      billId: Router.current().params._id
    });
  }
  
  Template.bill.allUsersWithChanges = function(){
    
  }
  
  Template.bill.events = {
    "keyup .changes .add": function(e, template){
      Session.set(e.target.getAttribute("data-typeahead"), e.target.value);
      // If comma or enter: add user to list
    },
    "focus .changes .change input": function(e){
      $(e.target).closest(".change").addClass("selected");
    },
    "blur .changes .change input": function(e){
      $(e.target).closest(".change").removeClass("selected");
    },
  };
  
  Template.change.events = {
    "change input": function(e){
      var changes = {};
      changes[e.target.name.split(".").pop()] = parseFloat(e.target.value);
      Changes.update({_id: this._id}, {$set: changes});
    }
  };
}

Router.map(function(){
  
  this.route('bills', {
    path: '/bills',
    inMenu: true,
    title: "bills",
    template: 'billPage',
    order: 11
  })
  
  this.route('billShow', {
    path: '/bills/:_id',
    template: 'bill',

    yieldTemplates: {
      //'userEdit': {to: 'overlay'}
    }
  })
	
});