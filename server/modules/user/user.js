Meteor.methods({
  "updateProfile": function (name, phone, about, location, target, tags) {
      Meteor.users.update({
        _id: Meteor.userId(),
      }, {
          $set: {
            "profile.name": name,
            "profile.phone": phone,
            "profile.about": about,
            "profile.location": location,
            "profile.target": target,
            "profile.tags": tags,
          }
        });
  },
  "updateUserSettings": function (key, value) {
    var setPair ={};
    setPair[key] = value;
      Meteor.users.update({
        _id: Meteor.userId(),
      }, {
          $set: setPair
        });
  }
});