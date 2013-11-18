var Mutations = new Meteor.Collection("mutations");

Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function(){
	
	/* Home */
	this.route('home', {
		path: '/',
		template: 'home'
	});
	
	this.route('admin', {
		path: '/admin',
		template: 'admin'
	});
  
  this.route('users', {
    path: '/users',
  })
  
  this.route('userShow', {
    path: '/users/:_id',
    template: 'user'
  })
	
});

if(Meteor.isClient){
  Template.menu.helpers({
    routeClass: function() {
      var context = Router.current();
      var args = Array.prototype.slice.call(arguments);
      return context && (args.indexOf(context.route.name) >= 0 && 'active');
    }
  });
}