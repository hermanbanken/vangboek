if(Meteor.isClient){
  Handlebars.registerHelper('allBills', function(){
    return Bills.find({}, {sort: [["date", "desc"]]});
  });
 
  Template.bills.userModel = function(){
    return Router.current().template == "user" && Router.current().data();
  }
  
  Template.bills.users = function(){
    var ids = this.changes().map(function(c){return c._id});
    return Meteor.users.find({_id: {$in: ids }});
  }
  
  Template.bill.payMethodText = function(){
    return this.payMethod && this.payMethod.name || "not payed";
  };
  Template.bill.hasMixedPayment = function(){
    return this.payMethod && "mixed" === this.payMethod.name
  };
      
  Template.bill.events = {
    "click": function(e, template){
      if($(e.target).attr("data-action") == 'remove'){
        e.preventDefault();
        var a = window.confirm("Sure?");
        if(a){
          Bills.remove({_id: this._id});
          Router.go('bills');
        }
      } else if(e.target.type == 'submit'){
        e.preventDefault();
        var data = {$set: {
          title: template.find("#title").value,
          note: template.find("#note").value,
          change: parseFloat(template.find("#change").value),
          date: new Date(template.find("#date").value),
          type: template.find("#type").value,
          created: this.created || new Date()
        }};
        Bills.update({_id: this._id}, data);
      } else if($(e.target).attr("data-action") == 'change-pay-method'){
        e.preventDefault();
        Bills.update({_id: this._id}, {$set: {
          'payMethod': { name: $(e.target).attr("data-pay-method") }
        }});
      }
    },
    
    "change": function(e, template){
      if(e.target.name.indexOf("payMethod") == 0 && this.payMethod && "mixed" === this.payMethod.name){
        var type = e.target.name.slice("payMethod.".length),
            other = type == 'cash' ? 'account' : 'cash',
            data = {};
        data[type] = parseFloat(template.find("#payMethod-"+type).value);
        data[other] = ~~((this.change - data[type])*100) / 100;
        template.find("#payMethod-"+other).value = data[other];
        Bills.update({_id: this._id}, {$set: {
          'payMethod': _.extend(this.payMethod, data) 
        }});
        e.preventDefault();
      }
    }
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
            billId: Router.current().data()._id,
            userId: userId,
            type: context.name,
            change: 0,
            amount: 1,
            computed: context.name === 'computed',
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
      // Update change value
      var value = parseFloat(e.target.value) || 0;
      changes[e.target.name.split(".").pop()] = value;
      Changes.update({_id: this._id}, {$set: changes});
    },
    /* Up count for person on bill type list */
    "up": function(e){
      Changes.update({_id: this._id}, {$set: { amount: .5+(this.amount||0) }});
    },
    /* Down count for person on bill type list, if count = 0 remove */
    "down": function(e){
      if(this.amount <= .5){
        $(e.target).closest("li").next().find("input[type=text]").focus();
        Changes.remove({_id: this._id});
      } else {
        Changes.update({_id: this._id}, {$set: { amount: (this.amount||0) - .5 }});
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
      if(this.computed && (e.keyCode == 109 || e.keyCode == 189)){
        Template.change.events.down.call(this, e);
        e.preventDefault();
      }
      if(this.computed && (e.keyCode == 107 || e.keyCode == 187 && e.shiftKey)){
        Template.change.events.up.call(this, e);
        e.preventDefault();
      }
    }
  };
}