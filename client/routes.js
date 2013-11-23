var Mutations = new Meteor.Collection("mutations");

Router.configure({
	layoutTemplate: 'layout',
});

Router.dep = new Deps.Dependency;
Router.map(function(){
	
	/* Home */
	this.route('home', {
		path: '/home',
		template: 'home',
    
    inMenu: true,
    title: "Overview",
    order: 1,
	});
	
	this.route('admin', {
		path: '/admin',
		template: 'admin',
    
    inMenu: true,
    title: 'Admin',
    order: 99
	});
  
  this.route('landing', {
    path: '/',
    action: function(){
      this.redirect('home');
    }
  })
  
  Router.dep.changed();
  
});

if(Meteor.isClient){
  Template.menu.helpers({
    routeClass: function() {
      var context = Router.current();
      var args = Array.prototype.slice.call(arguments);
      return _.some(arguments, function(route){
        return context.route.originalPath.indexOf(route) == 0;
      }) && 'active';
    },
    
    menuItems: function(){
      Router.dep.depend();
      var routes = 
      _.chain(Router.routes)
      .filter(function(route){ return route.options.inMenu })
      .sortBy(function(route){ return route.options.order })
      .value();
      return routes;
    }
  });
}