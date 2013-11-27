var instance = false;
function MHistory(){
  if(instance) return instance;
  instance = this;
}
MHistory.prototype = {
  constructor: MHistory,
  
  history: new Meteor.Collection("history", {transform: function(doc){
    return _.extend(doc, {user: Meteor.users.findOne({_id: doc.userId})});
  }}),
  
  collections: [],
  handles: {},
  
  start: function(){
    var cs = this.collections;
    for(var i = 0, c = cs[0]; i < cs.length; c = cs[i], i++){
      if(!(c._collection.name in this.handles)){
        var n = c._collection.name;
        var go = { may: false };
        this.handles[n] = c.find({}).observe(this.getHandles(n, go));
        go.may = true;
      }
    }
    return this;
  },
  
  getHandles: function(name, go){
    var self = this;
    return {
      added: function(doc){
        // Cancel when called for initial documents
        console.log(go.may, name, Meteor.userId, "inserting");
        if(!go.may && Meteor.userId) return;
        self.history.insert({
          type: 'inserted',
          collection: name,
          date: new Date(),
          userId: Meteor.userId,
          doc: doc,
        });
      },
      changed: function(newDoc, oldDoc){
        console.log(go.may, name, Meteor.userId, "changing");
        if(!go.may && Meteor.userId) return;
        self.history.insert({
          type: 'changed',
          collection: name,
          date: new Date(),
          userId: Meteor.userId,
          doc: newDoc,
          oldDoc: oldDoc,
        })
      },
      removed: function(oldDoc){
        console.log(go.may, name, Meteor.userId, "removing");
        if(!go.may && Meteor.userId) return;
        self.history.insert({
          type: 'removed',
          collection: name,
          date: new Date(),
          userId: Meteor.userId,
          doc: oldDoc,
        })
      },
    };
  },
  
  subscribe: function(collection){
    this.collections.push.apply(this.collections, arguments);
    this.start();
    return this;
  },
};

var h = History = (new MHistory);

if(Meteor.isServer)
Meteor.publish(null, function () {
  if(this.userId)
  return [
    h.history.find({})
  ];
});

Router.map(function(){
  
  this.route('history', {
    path: '/history',
    inMenu: true,
    title: "history",
    template: 'history',
    order: 50,
    
    data: function(){
      var r = h.history.find({}, {sort: [["date", "desc"]]});
      console.log(r.count());
      return r;
    },
  })

});

Meteor.startup(function(){
  // h.history.find().map(function(doc){
//     h.history.remove({_id: doc._id});  
//   });
  if(Meteor.isServer)
  h.subscribe(Meteor.users, Bills, Changes);
});