var bills = new Meteor.Collection("bills", {transform: function(doc){
  doc;
  if(doc.note && !doc.title) doc.title = doc.note;
  doc.changeFor = function(user){
    return _.reduce(this.users.map(function(u){
      console.log(u, user);
      return u.userId == user || u.userId == user._id ? u.change : 0;
    }), function(sum, item){ return sum + item }, 0);
  };
  return doc;
}});

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
    if(this._id)
    return bills.find({users: {
      $elemMatch: {
        'userId': this._id
      }
    }});
    else
    return bills.find();
  }
  
  Template.bill.model = function(){
    var bill = bills.findOne({
      _id: Router.current().params._id
    });
    return bill;
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