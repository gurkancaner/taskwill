Template.login.onRendered(function () {
    $("#login-logo-img").attr("src", '/static/login-logo.png').error(function () {
        $(this).attr("src", "/images/login-logo.png");
    })
});
Template.login.helpers({
    getApplicationName: function () {
        return safeGet(Settings.findOne({
            key: 'name'
        }), 'value', "TaskWill");
    }
});
Template.login.events({
    'submit #login-form': function (event, target) {
        event.preventDefault();
        //retrieve the input field values
        var email = target.find("#email").value;
        var password = target.find("#password").value;


        //Trim and validate your fields here...

        //If validation passes, supply the appropriate fields to the
        Meteor.loginWithPassword(email, password, function (error) {
            if (error) {
                console.log(error);
                console.log(error.reason);
                $("#error-list").text(error.reason);
            } else {
                Router.go("home");
            }
        });

        //you need to return false to prevent the form submission from reloading the page
        return false;
    },
    'click #login-with-twitter': function (event) {
        event.preventDefault(); //dont submit
        Meteor.loginWithTwitter();
    }
});