$(function() {
    
    window.Item = Backbone.Model.extend({
        
        DEFAULT_ID: "DEFAULT_ID",
        DEFAULT_DESCRIPTION: "DEFAULT_DESCRIPTION",
        
        // url: "/items",
        
        itemId: null,
        description: null,
        
        initialize: function() {
            if(!this.get("itemId")) {
                this.set({"itemId": this.DEFAULT_ID});
            }
            if(!this.get("description")) {
                this.set({"description": this.DEFAULT_DESCRIPTION});
            }
        },
        
        clear: function() {
            this.destroy();
            this.view.remove();
        }
        
    });
    
    window.ItemList = Backbone.Collection.extend({
        
        model: Item,
        
        localStorage: new Store("items"),
        
        // url: "/items",
        
        comparator: function(item) {
            return item.get("itemId");
        }
    });
    
    window.Items = new ItemList;    
    
    window.ItemView = Backbone.View.extend({
        
        tagName: "li",
        
        template: _.template($("#item-template").html()),
        
        events: {
            "click .item-destroy" : "clear",
            "click .item-update" : "update"
        },
        
        initialize: function() {
            _.bindAll(this, 'render', 'close');
            this.model.bind('change', this.render);
            this.model.view = this;
        },
        
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            this.setContent();
            return this;
        },
        
        setContent: function() {
            var itemId = this.model.get('itemId');
            var description = this.model.get('description');
            this.$('.item-id').text(itemId);
            this.$('.item-description').text(description);
        },
        
        toggleDone: function() {
            this.model.toggle();
        },
        
        edit: function() {
            $(this.el).addClass('editing');
        },
        
        update: function() {
            this.model.save({itemId: this.$('.item-id-update').val(), description: this.$('.item-description-update').val()});
        },
        
        remove: function() {
            $(this.el).remove();
        },
        
        clear: function() {
            this.model.clear();
        }
        
    });
    
    
    window.AppView = Backbone.View.extend({
        
        el: $("#itemapp"),
        
        events: {
            "click .new-item-create" : "createItem"
        },
        
        initialize: function() {
            _.bindAll(this, 'addOne', 'addAll', 'render');
            
            this.itemId = this.$('#new-item-id');
            this.description = this.$('#new-item-description');
            
            Items.bind('add',       this.addOne);
            Items.bind('refresh',   this.addAll);
            Items.bind('all',       this.render);
            
            Items.fetch();
            
        },
        
        render: function() {},
        
        addOne: function(item) {
            var view = new ItemView({model: item});
            this.$("#item-list").append(view.render().el);
        },
        
        addAll: function() {
            Items.each(this.addOne);
        },
        
        newAttributes: function() {
            return {
                itemId: this.itemId.val(),
                description: this.description.val()
            };
        },
        
        createItem: function() {
            Items.create(this.newAttributes());
            this.itemId.val('');
            this.description.val('');
        }   
        
    });
    
    window.App = new AppView;
});