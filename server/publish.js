Meteor.publish(null, function () {
  return [
    Meteor.users.find({}, {fields: {
      'services.google.email': 1,
      'services.vangboek.email': 1,
      'services.google.picture': 1
    }})
  ];
});