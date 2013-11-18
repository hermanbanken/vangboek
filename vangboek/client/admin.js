if(Meteor.isClient){
  Template.admin.users = Template.users.users = function(){
    return Meteor.users.find();
  };
  
  Template.admin.userServiceField = 
  Template.users.userServiceField = 
  Template.user.userServiceField = function(services, field){
    return _.first(_.map(_.values(services), function(service){
      return service[field];
    }));
  };
}