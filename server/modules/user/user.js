Meteor.methods({
  "updateProfile": function (name, phone, about, location, tags) {
      Meteor.users.update({
        _id: Meteor.userId(),
      }, {
          $set: {
            "profile.name": name,
            "profile.phone": phone,
            "profile.about": about,
            "profile.location": location,
            "profile.tags": tags,
          }
        });
  },
  "updateUserSettings": function (key, value) {
      Meteor.users.update({
        _id: Meteor.userId(),
      }, {
          $set: {
            key:value
          }
        });
  }
});