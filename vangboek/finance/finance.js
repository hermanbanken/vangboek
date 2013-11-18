var bills = new Meteor.Collection("bills", {transform: function(doc){
  doc;
  return doc;
}});

if(Meteor.isClient){
  Template.bills.bills = function(){
    return bills.find({user: this._id});
  }
}