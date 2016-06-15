Template.register.events({
    'submit #register-form': function (event, target) {
        event.preventDefault();
        var email = target.find('#email').value;
        var password = target.find('#password').value;
    }
});

Template.register.onRendered(function () {
    $('#register-form').validate({
        submitHandler: function (event) {
            var name = $('#name').val();
            var email = $('#email').val();
            var password = $('#password').val();

            Accounts.createUser({
                email: email,
                password: password,
                profile: {
                    name: name
                }
            }, function (error) {
                if (error) {
                    console.log(error.reason);
                    $("#status").html(error.reason);
                } else {
                    Router.go("home");
                }
            })
        }
    });
});