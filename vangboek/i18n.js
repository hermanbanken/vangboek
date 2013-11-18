/*
 * Uses: https://github.com/txgruppi/meteor-simple-i18n
 */

var i18n = Meteor.I18n({'collectionName': 'i18n', 'defaultLang': 'nl'});

var translations = {
  "user" : { nl: 'gebruiker', en: 'user' },
  "users" : { nl: 'gebruikers', en: 'users' },
  "realname" : { nl: 'naam', en: "name" },
  "nickname" : { nl: 'gebruikersnaam', en: 'username' },
  "email": { nl: 'e-mail', en: 'email' },
  "roles": { nl: 'rollen', en: 'roles' },
};

Meteor.startup(function(){
  for(var message in translations) {
    for(var lang in translations[message]){
      if(!i18n.collection.findOne({'lang': lang, 'base_str': message})){
        i18n.insert(lang, message, translations[message][lang]);
      }
    }
  }
});