Template.tags.suggest = function(){
  var self = this;
  Session.get("dummy");
  (this.roles.source() || []).forEach(function(s){
    s.parent = self;
  });
  return this.roles.source();
}

Template.tags.selected = function(){
  var self = this;
  Session.get("dummy");
  (this.roles || []).forEach(function(s){
    s.parent = self;
  });
  return this.roles;
}

Template.tags.events = {
  "click .suggestion": function(event, template){
    this.parent.roles.push({
      title: this.title,
      value: this.value
    });
  },
  "click .remove": function(event, template){
    var i = this.parent.roles.indexOf(this);
    delete this.parent.roles[i];
    Session.set("dummy", !Session.get("dummy"));
  },
  "keydown .type": function(event){
    if([188,13,8].indexOf(event.keyCode) >= 0){
      if(event.keyCode == 8){
        if(event.target.value == '') this.roles.pop();
        else return;
      }else{
        this.roles.push({title: event.target.value, value: event.target.value});
        event.target.value = "";  
      }
      Session.set("dummy", !Session.get("dummy"));
      $(event.target).focus();
      event.preventDefault();
      return false;
    }
  }
};

Template.tags.rendered = function(){
  this.find("textarea").focus();
  var ui = $(this.find("textarea"))[0].parentNode.parentNode;
  $(ui).on("click", function(){
    $(this).find("textarea").focus();
  });
};