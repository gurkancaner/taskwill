Template.profile.onRendered(function () {
    $("#profile-form #tags").val(this.data.profile.tags);
    $('select').material_select();
});

Template.profile.helpers({
    Tags: function () {
        return Tags.find({}, {
            sort: {
                name: 1
            }
        });
    }
});

Template.profile.events({
  "submit  #profile-form": function (event, target) {
      event.preventDefault();
      var name = $("#profile-form #name").val();
      var about = $("#profile-form #about").val();
      var location = $("#profile-form #location").val();
      var phone = $("#profile-form #phone").val();
      var tags = $("#profile-form #tags").val();
      Meteor.call("updateProfile", name, phone, about, location, tags, function (error, result) {
        if (error)
          console.log(error);
        else
            Materialize.toast("Profil güncellendi", 4000);
      });
  }
});