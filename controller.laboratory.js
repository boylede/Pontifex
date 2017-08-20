/*
controller loop for the resource mining, enrichment, and sale

determine what our goal is
* raw material sale (cheapest, quickest)
* resource enrichment (use labs to combine materials, purchase ingredients we lack from market, sell)
* resource hoarding (same as above but don't sell)

raw material sale: bypass laboratories -> request markets be filled with resource and request market controller make the sale at any price
resource enrichment -> figure out what the most profitable resource we can make baased on the ones we have access to, make and sell that one

*/

const SELL =  1;
const ENRICH = 2;
const HOARD = 3;

const MODES = [
	SELL,
	ENRICH,
	HOARD
];

const run = function(lab) {
	// lab.room.Memory.laboratories
};

module.exports = {
	run: run
};