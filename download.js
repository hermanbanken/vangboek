Router.map(function () {
  this.route('download', {
    path: '/download',
    where: 'server',

    action: function () {
      var filename = this.params.filename;
      
      var data = {
        bills: Bills.find().fetch(),
        users: Meteor.users.find({}, {fields: {'profile.name': 1}}).map(function(user){
          user.changes = Changes.find({userId: user._id}).fetch();
          return user;
        })
      };

      this.response.writeHead(200, {'Content-Type': 'text/html'});
      this.response.end(JSON.stringify(data));
    }
  });
});