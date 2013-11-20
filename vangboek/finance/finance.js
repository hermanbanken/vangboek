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
    var bill = Bills.findOne({
      _id: Router.current().params._id
    });
    return bill;
  }
  
  Template.bill.allUsersWithChanges = function(){
    
  }
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