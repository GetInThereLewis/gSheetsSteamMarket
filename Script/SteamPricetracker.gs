//base settings
const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
const cacheSpreadSheet = spreadSheet.getSheetByName("cache");
const now = new Date();
const delayPerFetch = 120000;

const options = { 
  day: 'numeric', 
  month: 'numeric', 
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
  timeZone: 'Europe/Berlin' // Set the timezone to a region of your choice
};
const currentDateTime = now.toLocaleString('de-DE', options);

//Map of steam items to track
const itemToLink = new Map();
itemToLink.set("Capsule", "https://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=Stockholm%202021%20Challengers%20Sticker%20Capsule");
itemToLink.set("ClutchCase", "https://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=Clutch%20Case");
itemToLink.set("Cs20Case", "https://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=CS20%20Case");
itemToLink.set("DangerZoneCase", "https://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=Danger%20Zone%20Case");
itemToLink.set("Capsule2", "https://steamcommunity.com/market/listings/730/Stockholm%202021%20Legends%20Sticker%20Capsule");
//Cached prices
const cachedPrices = new Map();

const cacheSheet = SpreadsheetApp.getActiveSpreadsheet();
const cellStart = cacheSheet.getRange("A2");

const cellEnd = cacheSheet.getRange(`A${itemToLink.size}`); 

const testFunction = async () => {
  let i = 2;
  for(const item of itemToLink.keys()) {
    //Fill column A with item names
    currentCellA = cacheSheet.getRange(`A${i}`);
    currentCellA.setValue(item);

    //request Prices
    let currentItem = itemToLink.get(item);
    console.log(currentItem);
    let itemPrice = await priceTracker(itemToLink.get(item));
    //set column B to the prices
    currentCellB = cacheSheet.getRange(`B${i++}`);
    currentCellB.setValue(itemPrice);
    Utilities.sleep(delayPerFetch);

  }
  cacheSpreadSheet.getRange("D1").setValue(`Successfully update ${currentDateTime}`);

}
async function priceTracker(itemUrl) {
  try {
    console.log("inside pricetracker: " + itemUrl);
    const jsondata = UrlFetchApp.fetch(itemUrl);
    const objData = JSON.parse(jsondata);
    const lowestPrice = objData.lowest_price;
    return lowestPrice;
  } catch(err) {
    console.error(err);
    return -1;
  }
}
