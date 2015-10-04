/**
 * Created by username on 10/4/15.
 */
class SCBot {
    table;
    maxBid;
    pool;

    constructor(csTable, {maxBid: maxBid = 100, coolDown: coolDown = 3}) {
        this.table = csTable;
        this.maxBid = maxBid;
        this.pool = new Pool(coolDown);
        _.bindAll(this, 'handleGift');
        csTable.parser.on('giftAdded', this.handleGift);
    }

    handleGift(gift) {
        if (!gift.getIsAvailable()) return;
        gift.setStatus(SCGift.Status.AUTO_PENDING);
        this.pool.dip(x => {
            $.ajax({
                type: "POST",
                url: `${this.table.parser.domain}/gifts/steamcompanion.php`,
                dataType: "JSON",
                data: {
                    script: "enter", giftID: gift.getGiftId(), token: "", action: "enter_giveaway"
                },
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                headers: {
                    'test': '123',
                    'Origin': 'https://steamcompanion.com',
                    'X-Requested-With' : 'XMLHttpRequest'
                },
                success: e => gift.setStatus(SCGift.Status.AUTO_SUCCESS),
                error: e => gift.setStatus(SCGift.Status.AUTO_ERROR)
            })
        })
    }
}