/*
 * Uses: https://github.com/txgruppi/meteor-simple-i18n
 */

var i18n = Meteor.I18n({'collectionName': 'i18n', 'defaultLang': 'nl'});

var translations = {
  "user" : { nl: 'gebruiker', en: 'user', oc: 'maat' },
  "users" : { nl: 'gebruikers', en: 'users', oc: 'maats' },
  "realname" : { nl: 'naam', en: "name", oc: 'naam' },
  "nickname" : { nl: 'gebruikersnaam', en: 'username', oc: 'armennaam' },
  "email": { nl: 'e-mail', en: 'email', oc: 'e-mail' },
  "roles": { nl: 'rollen', en: 'roles', oc: 'rollen' },
  "liquidity over time": { nl: 'liquiditeitsverloop', oc: 'standverloop' },
  "bills": { nl: 'mutaties', oc: 'mutaties' },
  "no entries yet": { nl: 'nog geen data', oc: 'nog geen data' },
};

if(Meteor.isServer)
Meteor.startup(function(){
  for(var message in translations) {
    for(var lang in translations[message]){
      if(!i18n.collection.findOne({'lang': lang, 'base_str': message})){
        i18n.insert(lang, message, translations[message][lang]);
      }
    }
  }
});