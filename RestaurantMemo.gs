// URLと店名をシートに追記
function sheetWriteRestaurant(sheetName,URL){
  var spreadsheet = SpreadsheetApp.openById(RESTAURANT_SHEET_ID);
  var sheet = spreadsheet.getSheetByName(sheetName);
  const columnBVals = sheet.getRange('B:B').getValues();
  const LastRow = columnBVals.filter(String).length + 1;
  var values = [[ URLtoTitle(URL), URL]];
  sheet.getRange("B"+ LastRow + ":C" + LastRow).setValues(values);
}

function URLtoTitle(url) {
  var response = UrlFetchApp.fetch(url);
  var myRegexp = /<title>([\s\S]*?)<\/title>/i;
  var match = myRegexp.exec(response.getContentText());
  var title = match[1];
  title = title.replace(/(^\s+)|(\s+$)/g, "");
  return(title);
}

//flex
function RestaurantMessageSend(userid,headers){
  var ss = SpreadsheetApp.openById(RESTAURANT_SHEET_ID);
  var sheet = ss.getSheetByName('RestaurantMemo');
  const columnBVals = sheet.getRange('B:B').getValues();
  const LastRow = columnBVals.filter(String).length + 1;
  var actionObj = {};
  var itemsObj = {};
  var itemsArr =[];
  for (var i = 2;i < LastRow;i++){
    var shopName = sheet.getRange("B"+i).getValue();
    var shopURL = sheet.getRange("C"+i).getValue();
    actionObj = {
      "type": "message",
      "label": shopName.slice( 0, 20 ),
      "text": shopURL
    };
    itemsObj = {
      "type": "action",
      "action": actionObj
    }
    itemsArr.push(itemsObj);
  }
  
  var postData = {
    "to": userid,
    "messages": [
      {
        "type": "text", 
        "text": "",
        "quickReply": { 
          "items": itemsArr
        }
      }
    ]};
  
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  var response = UrlFetchApp.fetch(url, options);
  
}