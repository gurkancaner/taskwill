Meteor.publish('tags', function () {
    return Tags.find();
});


Meteor.methods({
    //creates or updates role
    "createTag": function (name, color) {
        Meteor.checkUserCan("changeSettings");
        Tags.update({
            name:name},
            {
            name: name,
            color: color
        },{upsert:true});
    },
    "updateTag": function (id, name, color) {
        Meteor.checkUserCan("changeSettings");
        Tags.update({
            _id: id,
        }, 
        {
            name: name,
            color: color
        });
    },
    "deleteTag": function (id) {
        Meteor.checkUserCan("changeSettings");

        Tags.remove(id);
        Tasks.update({ tags: id }, {
            $pull: {
                tags: id
            }
        });

    }
});

