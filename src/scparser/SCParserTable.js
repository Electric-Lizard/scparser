/**
 * Created by username on 10/4/15.
 */
class SCParserTable extends Backbone.View {
    giftMap;
    parser;

    initialize(options) {
        super.initialize(options);
        this.template = _.template($('#scparser-table').html());
        this.render();

        this.giftMap = new Map();

        this.parser = new SteamCompanionParser();
        window.PARSER = this.parser;

        this.parser.on('giftAdded', gift => {
            let row = new SCParserTableRow({el: $('<tr>')[0], gift: gift}).render();
            this.giftMap.set(gift, row);
            this.$table.append(row.el);
        });
    }

    render() {
        let $table = $(this.template());
        this.$el.html();
        this.$table = $table.appendTo(this.$el);
    }

    sync() {
        this.parser.parse();
    }
}

class SCParserTableRow extends Backbone.View {
    gift;
    initialize(options) {
        super.initialize(options);
        this.gift = options.gift;
        this.gift.on('change', m => this.render());
        this.template = _.template($('#scparser-table-row').html());
    }

    render() {
        this.$el.html(this.template({gift: this.gift}));
        return this;
    }
}