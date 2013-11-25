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