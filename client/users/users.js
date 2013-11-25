Template.user.model = function(){
  return Meteor.users.findOne({
    _id: Router.current().params._id
  });
};
Template.user.bills = function(){
  var ids = Changes.find({userId: this._id}).map(function(c){ return c.billId });
  return Bills.find({_id: {$in: ids}});
}

Template.user.events = {
  "submit": function(e, template){
    var form = $(template.find("form"));
    var updates = form.serializeObject();
    Meteor.users.update(this._id, {$set: {"profile.nickname": updates.nickname}});
    e.preventDefault();
    return false;
  }
};

Router.map(function(){
  
  this.route('users', {
    path: '/users',
    inMenu: true,
    title: "users",
    order: 10,
    
    data: function () {
      return Meteor.users.find({});
    },
  })
  
  this.route('userShow', {
    path: '/users/:_id',
    template: 'user',

    yieldTemplates: {
      //'userEdit': {to: 'overlay'}
    },
    
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    },
  })
});

Handlebars.registerHelper("allUsers", function(){
  return Meteor.users;
});

Handlebars.registerHelper("canEdit", function(scope){
  if(scope == 'user' && this._id === Meteor.user()._id) 
    return true;
  if(scope == 'rights' && Roles.userIsInRole(Meteor.user()._id, ['admin'])) 
    return true;
  if(scope == 'groups' && Roles.userIsInRole(Meteor.user()._id, ['admin'])) 
    return true;
  console.log("canEdit", this, arguments);
  return false;
});

Handlebars.registerHelper("userServiceField", function(services, field, otherwise){
  return _.chain(services).map(function(service, key){
    return service[field];
  }).first().value() || typeof(otherwise) == 'string' && otherwise || "";
});

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};