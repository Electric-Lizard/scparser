/**
 * Created by username on 10/4/15.
 */
class SCPageParser {
    props;
    aDoc;
    $body;
    pool;

    /** @type {Map.<string, SCGift>} */
    gifts;

    /** @type {function} */
    promisedExecutor;

    /** @type {number} */
    _pendingQueries;
    _completeQueries;

    constructor(properties, aDoc = document) {
        let props = {};
        _.extend(props, properties);
        this.props = props;
        this.aDoc = aDoc;

        _.extend(this, Backbone.Events);
        this.$body = $(aDoc.getElementsByTagName('body'));
        this.pool = new Pool(props.coolDown);
        this.gifts = new Map();
    }

    fetch() {
        let links = this.$('.giveaway-links');
        links.each((i, link) => this.parseLink($(link).attr('href')));
    }

    waitForSync(count) {
        this._completeQueries = 0;
        this._pendingQueries = count;
    }

    addGift(link, gift) {
        this.gifts.set(link, gift);
        this.trigger('linkParsed', {link: link, gift: gift});
        if (this._completeQueries == ++this._pendingQueries) {
            this.trigger('sync');
        }
    }

    /**
     * @param {string} link
     */
    parseLink(link) {
        $.ajax({
            url: link,
            success: (data, status, jXhr) => {
                let dom = (new DOMParser()).parseFromString(data, 'text/html');
                let $body = $(dom.getElementsByTagName('body'));
                let $giveaway = $body.find('#enter-giveaway');

                let giftID = $body.find("#hero .row").attr('data-giftID');
                let header = $body.find('#hero .details-wrapper h2').text();
                let tokens = header.match(/(\S+)\s+\((\d+)\w\)/);
                let name = tokens[1];
                let price = parseFloat(tokens[2]);

                let gift = new SCGift(SCGift.Status.INFO_SUCCESS, data, name, giftID, price, $giveaway.length > 0);
                this.addGift(link, gift);
            },
            error: (data) => {
                let gift = new SCGift(SCGift.Status.INFO_ERROR, data);
                this.addGift(link, gift);
            }
        });
    }

    $() {
        return this.$body.find(...arguments);
    }

}