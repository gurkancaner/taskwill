Meteor.publish('notifications', function () {
    if (this.userId) {
        return Notifications.find({
            userId: this.userId
        });
    }
});
Meteor.methods({
    "markNotificationsAsRead": function () {
        Notifications.update({
            userId: Meteor.userId()
        },
            {
                $set: {
                    read: true
                }
            });
    }
});


/**
 * userId
 * actor
 * objectId
 * objectType
 * isRead
 * createdAt
 */
Notification = {
    send: function (type, id) {
        switch (type) {
            case "openTask":
                var task = Tasks.findOne(id);
                var filter = { "level": { $gte: task.level } };
                if (task.location)
                    filter["profile.location"] = task.location;
                if (task.tags)
                    filter["profile.tags"] = { '$in': task.tags };
                var userIdList = Meteor.users.find(filter);
                console.log("filter", filter);
                userIdList.forEach(function (user) {
                    Notification.sendToUser(user._id, id, type);
                }, this);
                break;

            default:
                break;
        }
        return
    },
    sendToUser: function (userId, objectId, objectType) {
        console.log("sendToUser", userId, objectId, objectType);
        Notifications.upsert({//if there is a notification with same objectId, override it
            objectId: objectId
        }, {
                userId: userId,
                actor: Meteor.userId(),
                objectId: objectId,
                objectType: objectType,
                read: false,
                createdAt: new Date()
            });
            

    }
}