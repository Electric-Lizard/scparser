#!/bin/sh
scriptName="giftparser.min.js"

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
babel -d $DIR/out/ $DIR/src/ --modules ignore
script=$DIR/out/$scriptName
out=$DIR/out
rm $script

cat $DIR/lib/jquery-2.1.4.js >> $script
echo -e "\n" >> $script
cat $DIR/lib/jquery.xdomainajax.js >> $script
echo -e "\n" >> $script

cat $DIR/lib/underscore.js >> $script
echo -e "\n" >> $script
cat $DIR/lib/backbone.js >> $script
echo -e "\n" >> $script

cat $out/scparser/Pool.js >> $script
echo -e "\n" >> $script
cat $out/scparser/SCPageParser.js >> $script
echo -e "\n" >> $script
cat $out/scparser/SteamCompanionParser.js >> $script
echo -e "\n" >> $script

cat $out/scparser/SCParserTable.js >> $script
echo -e "\n" >> $script
cat $out/scparser/SCBot.js >> $script
echo -e "\n" >> $script

cat $out/giftparser.js >> $script
