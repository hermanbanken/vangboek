Template.user.model = function(){
  var user = Meteor.users.findOne({
    _id: Router.current().params._id
  });
  user.roles = user.roles || [];
  user.roles.source = function(){
    return [{title: 'Admin', value: 'admin'}, {title: 'View', value: 'view'}];
  }
  return user;
};

Router.map(function(){
  
  this.route('users', {
    path: '/users',
    inMenu: true,
    title: "Users",
    order: 10
  })
  
  this.route('userShow', {
    path: '/users/:_id',
    template: 'user',

    yieldTemplates: {
      'userEdit': {to: 'overlay'}
    }
  })
	
});