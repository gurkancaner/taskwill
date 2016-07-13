const fs = require('fs');
const sizeOf = require('image-size');

Meteor.publish('settings', function () {
    return Settings.find();
});

Meteor.methods({
    saveFile: function (blob, name, path, encoding) {
        Meteor.checkUserCan("changeApplicationSettings");
        var properties = sizeOf(new Buffer(blob, "binary"));
        if (properties.type !== "png" || properties.width != 200 || properties.height != 34) {
            throw new Meteor.Error("Format Errror");
        }
        if (process.env.NODE_ENV === "production") {
            var path = '/var/www/static';
        } else {
            var path = process.env['METEOR_SHELL_DIR'] + '/../../../public/static';
        }
        var filename = "logo.png";
        fs.writeFile(path + "/" + filename, blob, encoding, Meteor.bindEnvironment(function (err) {
            if (err) {
                console.log("Error:" + err);
            } else {
                console.log("Success");
            }
        }));
    },
    updateApplicationSettings: function(name){
        Settings.upsert({key: "name"}, {$set:{
            value:name
        }});
        
    }
});