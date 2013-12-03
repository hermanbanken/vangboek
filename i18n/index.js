if (Meteor.isServer) {
  Meteor.publish('all_language_records', function(){
    return Meteor.I18n().collection.find();
  });
}

if(Meteor.isClient)
Template.translations.keyMapped = function(object, map){
  return _.map(map, function(key){
    return { value: object[key], key: key };
  });
}

Router.map(function(){
  
  this.route('i18n', {
    path: '/i18n',
    inMenu: true,
    title: "translations",
    template: 'translations',
    order: 50,
    
    data: function(){
      // Subscribe to the selected language
      if (Meteor.isClient) {
        Meteor.subscribe("all_language_records");
      }
      var i18n = Meteor.I18n();
      return {
        translations: _.chain(i18n.collection.find().fetch()).groupBy("base_str").map(function(group, key){
          return _.reduce(group, function(r, t){
            r[t.lang] = t.new_str;
            return r;
          }, {key: key});
        }).value(),
        languages: _.unique(i18n.collection.find().map(function(item){ return item.lang; }))
      };
    },
  })
  
});