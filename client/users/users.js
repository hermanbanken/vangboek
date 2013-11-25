Template.user.model = function(){
  return Meteor.users.findOne({
    _id: Router.current().params._id
  });
};
Template.user.bills = function(){
  var ids = Changes.find({userId: this._id}).map(function(c){ return c.billId });
  return Bills.find({_id: {$in: ids}}, { sort: [["date", "desc"]] });
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

Template.user.rendered = function(){
  if($('.highstock').empty() && this.data._id){
    var changes = Changes.find({userId: this.data._id}).fetch();
    highCharts(changes, ".highstock", this.data.profile.nickname);
  }
}