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
  };
  
  Template.changeslist.events = {
    /* Typeahead suggesting users */
    "keyup .changes .add": function(e, template){
      // If comma or enter: add user to list
      if(e.keyCode == 188 || e.keyCode == 13){
        var context = this,
            ids = template.findAll(".suggestions li").map(function(li){ return li.getAttribute('data-id'); });
        _(ids).each(function(userId){
          Changes.insert({
            billId: context.model._id,
            userId: userId,
            type: context.group,
            change: 0,
            amount: 1
          })
        });
        Session.set(e.target.getAttribute("data-typeahead"), "");
        e.target.value = "";
      } else {
        Session.set(e.target.getAttribute("data-typeahead"), e.target.value);
      }
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
    },
    /* Up count for person on bill type list */
    "up": function(e){
      this.amount = .5+(this.amount||0);
      Changes.update({_id: this._id}, {$set: { amount: this.amount }});
    },
    /* Down count for person on bill type list, if count = 0 remove */
    "down": function(e){
      this.amount = (this.amount||0) - .5;
      Changes.update({_id: this._id}, {$set: { amount: this.amount }});
      if(this.amount <= 0){
        $(e.target).closest("li").next().find("input[type=text]").focus();
        Changes.remove({_id: this._id});  
      }
    },
    "click [data-action]": function(e){
      var action = e.target.getAttribute("data-action");
      if(action == 'up'){
        Template.change.events.up.call(this, e);
      }
      if(action == 'down'){
        Template.change.events.down.call(this, e);
      }
    },
    "keydown input": function(e){
      if(e.keyCode == 109 || e.keyCode == 189){
        Template.change.events.down.call(this, e);
        e.preventDefault();
      }
      if(e.keyCode == 107 || e.keyCode == 187 && e.shiftKey){
        Template.change.events.up.call(this, e);
        e.preventDefault();
      }
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