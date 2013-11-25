Meteor.users._transform = function(doc) { 
  return new User(doc);
} 

User = function (doc){
  _.extend(this, doc);
}

User.prototype = {
  constructor: User,
  
  saldo: function(){
    return _.reduce(
      Changes.find({userId: this._id}).map(function(doc){ return doc.change }),
      function(sum, i){ return sum += i; },
      0
    ); 
  }
};