Template.tags.onRendered(function () {
    $('.modal-trigger').leanModal();
    $("#color").spectrum({
        showPaletteOnly: true,
        showPalette: true,
        preferredFormat: "hex",
        color: '#ffffff',
        palette: [
            ['#b71c1c', '#880E4F', '#4A148C', '#311B92', '#1A237E', '#0D47A1', '#01579B', '#006064', '#004D40', '#1B5E20', '#33691E',
                '#827717', '#F57F17', '#FF6F00', '#E65100', '#BF360C', '#3E2723', '#212121', '#263238', '#f44336', '#E91E63', '#9C27B0',
                '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
                '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
            ]
        ]
    });
});

Template.tags.helpers({
    Tags: function () {
        return Tags.find({}, {
            sort: {
                name: 1
            }
        });
    }
});

Template.tags.events({
    "submit #add-tag-form": function (event, target) {
        event.preventDefault();
        var id = target.find("#id").value;
        var name = target.find("#name").value;
        var color = $(target.find("#color")).val();
        if (id) {
            Meteor.call("updateTag", id, name, color, function (error, result) {
                if (error)
                    console.log(error);
            });
        }else{
            Meteor.call("createTag", name, color, function (error, result) {
                if (error)
                    console.log(error);
            });
        }

        //clear form
        $('#add-tag input').val("");
    },
    "click #tag-add-button": function (event, target) {
        //clear form
        $('#add-tag input').val("");
    },
    "click .tag-edit-button": function (event, target) {
        $('#add-tag #name').val(this.name);
        $('#add-tag #id').val(this._id);
        $('#add-tag #color').spectrum("set", this.color);
        $('#add-tag').openModal();
    },
    "click .tag-delete-button": function (event, target) {
        $('#delete-tag #tag-name').html(this.name);//set permissions
        $('#confirm-tag-delete').data("id", this._id);
        $('#delete-tag').openModal();
    },
    "click #confirm-tag-delete": function (event, target) {
        Meteor.call("deleteTag", $('#confirm-tag-delete').data("id"), function (error, result) {
            if (error)
                console.log(error);
        });
    }

})