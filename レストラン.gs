// URLと店名をシートに追記
// クラス名 rate__scoreが変更されると死ぬ
function writeSheetRestaurant(URL){
  
  //GHI列初期値
  const G=dbValueGet('meeting_place');
  const H='19:30'
  const I='20:00'
  
  //スマホサイト対策
  URL = URL.replace('s.tabelog.com','tabelog.com')
  URL = URL.replace('top_amp/','')
  URL = URL.replace('spn.ozmall.co.jp','www.ozmall.co.jp')
  Logger.log(URL)
  
  try{
    var response = UrlFetchApp.fetch(URL);
    var json = response.getContentText('UTF-8');
    var spreadsheet = SpreadsheetApp.openById(RESTAURANT_SHEET_ID);
    var sheet = spreadsheet.getSheetByName("RestaurantMemo");
    const columnBVals = sheet.getRange('B:B').getValues();
    const LastRow = columnBVals.filter(String).length + 1;
    
    //ozmallは★がdiscriptionに無いので評価点から生成する必要がある
    if (URL.indexOf("https://www.ozmall.co.jp/restaurant/") == 0.0){
      var titleRegexp = /<meta property="og:title" content="([\s\S]*?)" \/>/;
      var imgRegexp = /<meta property="og:image" content="([\s\S]*?)" \/>/;
      var descriptionRegexp = /<meta property="og:description" content="([\s\S]*?)" \/>/;
      var urlRegexp = /<meta property="og:url" content="([\s\S]*?)" \/>/;
      var ogTitle = json.match(titleRegexp);
      var ogImg = json.match(imgRegexp);
      var ogDescription = json.match(descriptionRegexp);
      var scoreRegexp = /<span class="rate__score">([\s\S]*?)<\/span>/;
      var scoreRate = json.match(scoreRegexp);
      const onStarCount = Math.floor(scoreRate[1])
      const offStarCount = 5-Math.floor(scoreRate[1])
      var values = [[ ogTitle[1], ogImg[1], Array(onStarCount+1).join('★')+Array(offStarCount+1).join('☆')+scoreRate[1]+ogDescription[1], URL,0,G,H,I]];  
    } else {
      var titleRegexp = /<meta property="og:title" content="([\s\S]*?)">/;
      var imgRegexp = /<meta property="og:image" content="([\s\S]*?)">/;
      var descriptionRegexp = /<meta property="og:description" content="([\s\S]*?)">/;
      var urlRegexp = /<meta property="og:url" content="([\s\S]*?)">/;
      var ogTitle = json.match(titleRegexp);
      var ogImg = json.match(imgRegexp);
      var ogDescription = json.match(descriptionRegexp);
      var values = [[ ogTitle[1], ogImg[1], ogDescription[1], URL,0,G,H,I]];    
    }
    
    sheet.getRange("B"+ LastRow + ":I"+ LastRow).setValues(values);
    return 0
  } catch(e){
    return 1
  }
}

// お店の削除フラグをON
function deleteSheetRestaurant(shopName){
  try{
    var spreadsheet = SpreadsheetApp.openById(RESTAURANT_SHEET_ID);
    var sheet = spreadsheet.getSheetByName("RestaurantMemo");
    var shopList = sheet.getRange("B:B").getValues();
    var row = 1;
    shopList.some(function( value ) {
      if(shopName==value){
        Logger.log("該当の店名が見つかりました")
        if(sheet.getRange("F"+ row).getValue()=="0"){
          sheet.getRange("F"+ row).setValue("1");
          Logger.log("書き込めました")
          return true
        }
      }
      row++
    });
    return 0
  } catch(e){
    return 1
  }
}

// 本日のレストラン情報取得
// なにもないときはブランクを返す
function getTheDayRestaurant(){
  var message=""
  try{
    var spreadsheet = SpreadsheetApp.openById(RESTAURANT_SHEET_ID);
    var sheet = spreadsheet.getSheetByName("RestaurantMemo");
    var dateList = sheet.getRange("K:K").getValues();
    var row = 1;
    var today = new Date()
    dateList.some(function( value ) {
      if(Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy-MM-dd')==value ){
        Logger.log("該当の日付が見つかりました")
        var meetPlace = sheet.getRange("G"+row).getValue()
        var meetTime = sheet.getRange("H"+row).getValue()
        var reserveFlg = sheet.getRange("L"+row).getValue()
        var reserveTime = sheet.getRange("I"+row).getValue()
        var url = sheet.getRange("E"+row).getValue()
        message = "今日はデート日！\uDBC0\uDCB1\n【"+meetTime+"】に["+meetPlace+"]で待ち合わせわん！\uDBC0\uDC5E\n"
        if(reserveFlg==0){
          message+="予約はしてないわん♪\n今夜はごうそうかな！?\uDBC0\uDC54\n"
        }else{
          message+="お店の予約は【"+reserveTime+"】だよ！\uDBC0\uDC57\n"
        }
        message+=url
        return true
      }
      row++
    });
    
    return message
  } catch(e){
    console.log(e)
    message = "取得エラーわん・・・"
    return message
  }
}

function createRestaurantCarousel(userid,headers){
  var spreadsheet = SpreadsheetApp.openById(RESTAURANT_SHEET_ID);
  var sheet = spreadsheet.getSheetByName("RestaurantMemo");
  // 最終行を取得、空白を除き、配列の数を取得
  const columnBVals = sheet.getRange('F:F').getValues();
  const LastRow = columnBVals.filter(String).length+1; 
  var carouselArry=[];
  for (var row = 0;row < LastRow;row++){
    //お店が削除されていない場合は生成
    if(columnBVals[row][0] == "0"){
      var exactRow = row + 1
      var rawVals = sheet.getRange('B'+(exactRow)+':I'+(exactRow)).getValues();
      var ogTitle = rawVals[0][0];
      var ogImg = rawVals[0][1];
      var ogDescription = rawVals[0][2];
      var ogUrl = rawVals[0][3];
      var meetPlace = rawVals[0][5].replace('T',' ')
      var meetTime = rawVals[0][6].replace('T',' ')
      var reservedTime = rawVals[0][7].replace('T',' ')
      ogDescription = ogDescription.slice(0,9);
      
      //星の数を数える
      var starCount = 0;
      var starContents =[];
      var goldStar = {
        "type": "icon",
        "size": "sm",
        "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
      }
      var silverStar = {
        "type": "icon",
        "size": "sm",
        "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
      }
      var starLastContents = {
        "type": "text",
        "text": ogDescription.slice(5,9),
        "size": "sm",
        "color": "#999999",
        "margin": "md",
        "flex": 0
      }
      for (var i = 0 ; i < 5; i++){
        if(ogDescription.charAt(i)=="★"){
          starCount++
            starContents.push(goldStar);
        }else{
          starContents.push(silverStar);
        }
      }
      starContents.push(starLastContents);    
      var actionObj = {};
      var itemsObj = {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": ogImg,
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "uri": ogUrl
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": exactRow+"_"+ogTitle,
              "weight": "bold",
              "size": "md",
              "wrap" : true,
              "maxLines": 3
            },
            {
              "type": "box",
              "layout": "baseline",
              "margin": "md",
              "contents": starContents
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "集合",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": meetPlace,
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "待合",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": meetTime,
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "予約",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": reservedTime,
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "style": "primary",
              "height": "sm",
              "action": {
                "type": "uri",
                "label": "変更",
                "uri": "line://app/1588462611-AodzmEla?id="+exactRow
              }
            },
            {
              "type": "button",
              "style": "secondary",
              "height": "sm",
              "action": {
                "type": "message",
                "label": "削除",
                "text": "[お店削除]"+ogTitle
              }
            },
            {
              "type": "spacer",
              "size": "sm"
            }
          ],
          "flex": 0
        }
        
      }
      carouselArry.push(itemsObj);
    }
  }
  
  var postData = {
    "to": userid,
    "messages": [
      {
        "type": "flex",
        "altText": "お店一覧を取得したわんっ！",
        "contents":
        
        {
          "type": "carousel", 
          "contents": carouselArry
        }
      }
    ]};
  
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData),
    "muteHttpExceptions":true
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response)
}