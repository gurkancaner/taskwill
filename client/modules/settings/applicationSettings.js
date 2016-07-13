Template.applicationSettings.onRendered(function () {
    $("#selected-logo").attr("src", '/static/logo.png').error(function () {
        $(this).attr("src", "/images/no-image-box.png");
    })
    $("#selected-login-logo").attr("src", '/static/login-logo.png').error(function () {
        $(this).attr("src", "/images/login-logo.png");
    })
});
Template.applicationSettings.helpers({
    applicationName: function () {
        return Settings.findOne({ key: "name" }).value;
    }
});
Template.applicationSettings.events({
    'submit #application-settings-form': function (event, template) {
        event.preventDefault();
        var applicationName = $('#name').val();
        Meteor.call("updateApplicationSettings", applicationName, function (error, result) {
            if (!error)
                Materialize.toast("Ayarlar güncellendi", 4000);
        });

        var file = $('#logo-file')[0].files[0];
        var file2 = $('#login-logo-file')[0].files[0];
        uploadImage(file, "logo");
        uploadImage(file2, "login-logo");

    }
});
var uploadImage = function (file, type) {
    var fileReader = new FileReader();
    var encoding = "binary";
    if (!file)
        return;
    var name = file.name;
    var regex = new RegExp("(.*?)\.(png)$");
    if (!(regex.test(name))) {
        alert("Only png allowed!");
        return;
    }
    fileReader.onload = function () {
        if (fileReader.readAsBinaryString) {
            Meteor.call('saveFile', fileReader.result, name, '', encoding, type, function (error, result) {
                if (!error) {
                    $("#selected-logo").attr("src", "/static/logo.png?" + d.getTime());
                    $("#logo-img").attr("src", "/static/logo.png?" + d.getTime());
                }
            });
        } else {
            var binary = "";
            var bytes = new Uint8Array(fileReader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            Meteor.call('saveFile', binary, name, '', encoding, function (error, result) {
                if (!error) {
                    $("#selected-logo").attr("src", "/static/logo.png?" + d.getTime());
                    $("#logo-img").attr("src", "/static/logo.png?" + d.getTime());

                }
            });
        }
    };
    fileReader.onloadend = function (e) {
        console.log(e);
    };
    fileReader.onloadstart = function (e) {
        console.log(e);
    };
    fileReader.onprogress = function (e) {
        console.log(e);
    };
    fileReader.onabort = function (e) {
        console.log(e);
    };
    fileReader.onerror = function (e) {
        console.log(e);
    };
    if (fileReader.readAsBinaryString) {
        fileReader.readAsBinaryString(file);
    } else {
        fileReader.readAsArrayBuffer(file);
    }
}