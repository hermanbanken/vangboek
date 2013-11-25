Router.map(function(){
  
  this.route('bills', {
    path: '/bills',
    inMenu: true,
    title: "bills",
    template: 'billPage',
    order: 11,
    
    data: function(){
      return Bills.find({}, {sort: [["date", "desc"]]});
    },
  })
  
  this.route('billNew', {
    path: '/bills/new',
    template: 'bill',
    
    before: function(){
      Router.go("billShow", {_id: Bills.insert({
        note: "",
        created: new Date(),
      })});
    }
  })
  
  this.route('billShow', {
    path: '/bills/:_id',
    template: 'bill',

    yieldTemplates: {
      //'userEdit': {to: 'overlay'}
    },
    
    waitOn: function(){
      return Meteor.subscribe('bill', this.params._id);
    },
    
    data: function(){
      return Bills.findOne({_id: this.params._id});
    },
  })
  
});