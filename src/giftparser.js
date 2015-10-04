/**
 * Created by username on 10/3/15.
 */
import SteamCompanionParser from 'scparser/SteamCompanionParser.js';

$(function () {
    let table = new SCParserTable({el: $('<div>')[0]});
    $('#target').html(table.el);
    let bot = new SCBot(table, {});
    table.sync();
});