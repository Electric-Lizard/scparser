/**
 * Created by username on 10/3/15.
 */
import Pool from 'Pool.js';

export class SteamCompanionParser {
    props;
    domain;

    /** @type {Map.<string, SCGift>} */
    giftList;

    constructor(properties) {
        this.domain = 'https://steamcompanion.com';
        let props = {
            coolDown: 3,
            maxBid: 20
        };
        $.extend(props, properties);
        _.extend(this, Backbone.Events);
        this.props = props;
        this.giftList = new Set();
    }

    parse() {
        this.on('nextPage', link => this._parsePage(link));
        let link = this.domain + '/gifts/';
        this._parsePage(link);
    }

    _parsePage(link) {
        $.ajax({
            url: link,
            success: data => {
                let dom = (new DOMParser()).parseFromString(data, 'text/html');
                let parser = new SCPageParser({}, dom);
                parser.on('linkParsed', ({gift: gift}) => this.addGift(gift));
                parser.fetch();

                let nextPage = $(dom.getElementsByTagName('body')).find('.pagination a:contains("Next")');
                if (nextPage.length > 0) {
                    let nextPageLink = nextPage.attr('href');
                    this.trigger('nextPage',
                        nextPageLink.substr(0, 1) == '/' ? this.domain + nextPageLink : link + nextPageLink);
                }
            }
        });
    }

    addGift(gift) {
        this.giftList.add(gift);
        this.trigger('giftAdded', gift);
    }

    $() {
        return this.$body.find(...arguments);
    }
}
class SCGift {
    _status;
    _giftId;
    _price;
    _isAvailable;
    _rawResponse;
    _name;

    constructor(status, rawResponse, name = null, giftId = null, price = -1, isAvailable = false) {
        this._status = status;
        this._rawResponse = rawResponse;
        this._name = name;
        this._giftId = giftId;
        this._price = price;
        this._isAvailable = isAvailable;
        _.extend(this, Backbone.Events);
    }

    getStatus() {
        return this._status;
    }

    setStatus(value) {
        this._status = value;
        this.trigger('change', this);
    }

    getName() {
        return this._name;
    }

    getGiftId() {
        return this._giftId;
    }

    setGiftId(value) {
        this._giftId = value;
    }

    getPrice() {
        return this._price;
    }

    setPrice(value) {
        this._price = value;
    }

    getIsAvailable() {
        return this._isAvailable;
    }

    setIsAvailable(value) {
        this._isAvailable = value;
    }
}
SCGift.Status = {
    INFO_SUCCESS: 'Got info',
    INFO_ERROR: 'ERROR: unable to get info',
    AUTO_PENDING: 'in queue of auto entering',
    AUTO_SUCCESS: 'Entered',
    AUTO_ERROR: 'ERROR: unable to enter'
};