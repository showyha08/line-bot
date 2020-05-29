/**
* updateMovieRanking
* @return スクリプトプロパティに最新情報を格納
*/
function updateMovieRanking() {
  const movieURL = 'https://eiga.com/ranking/';//映画ランキング（毎週火曜更新）
  var rankedMovieURLs = new Array;
  var rankedMovieImgURLs = new Array;
  var rankedMovieTitles = new Array;
  var rankedMovieDescriptions = new Array;
  
  const movieImgUrlRegexp = new RegExp('<meta property="og:image" content="([\\s\\S]*?)" \/> <meta property="og:description" content="');
  const movieTitleRegexp = new RegExp('<meta property="og:title" content="([\\s\\S]*?) : 作品情報 - 映画.com" \/>');
  const movieDescriptionRegexp = new RegExp('の作品情報。上映スケジュール、映画レビュー、予告動画。([\\s\\S]*?)" \/> <meta name="keywords"');
  
  try{
    var response = UrlFetchApp.fetch(movieURL);
    var json = response.getContentText('UTF-8');  
    
    // 全国週末興行成績の期間を取得
    var myRegexp = /<\/h2> <p>([\s\S]*?) （全国動員集計）/;
    var WeekendPerformancePeriod = json.match(myRegexp)[1];
    
    //期間が変わらない場合は終了
    if (dbValueGet('WeekendPerformancePeriod')==WeekendPerformancePeriod) {
      Logger.log('ランキング更新が無い為終了')
      return;
    } else {
      dbValueSet('WeekendPerformancePeriod',WeekendPerformancePeriod)
    }
    
    //JSON LDを取得
    myRegexp = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
    var jsonld = JSON.parse(json.match(myRegexp)[1]);
    var itemList = jsonld[0].itemListElement
    
    //URLを抽出しスクリプトプロパティに格納
    itemList.forEach(function(val){
      var url = val.url
      rankedMovieURLs.push(url)
      
      
      var response = UrlFetchApp.fetch(url);
      var json = response.getContentText('UTF-8')
      //og:titleを取得  特殊文字を変換
      var rankedMovieTitle = json.match(movieTitleRegexp);
      
      rankedMovieTitles.push(escapeHtml(rankedMovieTitle[1]))
      //descriptionを取得  特殊文字を変換
      var rankedMovieDescription = json.match(movieDescriptionRegexp);
      rankedMovieDescriptions.push(escapeHtml(rankedMovieDescription[1]))
      //og:imgを取得
      var highResolusionImgUrl = json.match(movieImgUrlRegexp);
      rankedMovieImgURLs.push(highResolusionImgUrl[1]);
    });
    dbValueSet('rankedMovieTitles',rankedMovieTitles.join(','))
    dbValueSet('rankedMovieImgURLs',rankedMovieImgURLs.join(','))
    dbValueSet('rankedMovieURLs',rankedMovieURLs.join(','))
    dbValueSet('rankedMovieDescriptions',rankedMovieDescriptions.join(','))
    Logger.log('ランキングを更新')
 
}catch(e){
  Logger.log(e)
  sendPushMessage(USER_ID,'ランキング更新に失敗したよ'+ e)
} 
}
/**
* createMovieCarousel
* @return カルーセルタイプで映画ランキングを返却
*/
function createMovieCarousel(userid,headers){
  var ranking = dbValueGet('movie_list').split(',,,,,');
  var WeekendPerformancePeriod= dbValueGet('WeekendPerformancePeriod')
  var rankedMovieTitles=    dbValueGet('rankedMovieTitles').split(',')
  var rankedMovieImgURLs =   dbValueGet('rankedMovieImgURLs').split(',')
  var rankedMovieURLs =   dbValueGet('rankedMovieURLs').split(',')
  var rankedMovieDescriptions =  dbValueGet('rankedMovieDescriptions').split(',')
  
  var carouselArry=[];
  var rank = 1;
  for (var i = 0;i < 10;i++){
    var actionObj = {};
    var itemsObj = {
      "type": "bubble",
      "hero": {
        "type": "image",
        "size": "full",
        "aspectRatio": "18:13",
        "aspectMode": "fit",
        "url": rankedMovieImgURLs[i],
        "backgroundColor": "#000000"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": rank + "位:"+rankedMovieTitles[i],
            "wrap": true,
            "weight": "bold",
            "size": "md",
            "color": "#ffffff",
            "maxLines": 2
          } , {
            "type": "text",
            "text": rankedMovieDescriptions[i],
            "wrap": true,
            "size": "xxs",
            "color": "#ffffff"
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
            "style": "link",
            "action": {
              "type": "uri",
              "label": "詳細を見る",
              "uri": rankedMovieURLs[i]
            }
          }
        ]
      },
      "styles": {
        "header": {
          "backgroundColor": "#000000"
        },
        "hero": {
          "separator": true,
          "backgroundColor": "#000000",
          "separatorColor": "#ffffff"
        },
        "body": {
          "separator": true,
          "backgroundColor": "#000000"
        },
        "footer": {
          "backgroundColor": "#000000",
          "separator": true,
          "separatorColor": "#ffffff"
        }
      }
    }
    carouselArry.push(itemsObj);
    rank++;
  }
  
  var postData = {
    "to": userid,
    "messages": [
      {
        "type": "flex",
        "altText": WeekendPerformancePeriod+"映画ランキングを取得したわんっ！",
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
    "payload": JSON.stringify(postData)
  };
  var response = UrlFetchApp.fetch(url, options);
}


function toraRankingGet() {
  const URL = 'https://ec.toranoana.jp/tora_r/ec/cot/ranking/daily/all/';//とらランキング
  try{
    var response = UrlFetchApp.fetch(URL);
    var json = response.getContentText('UTF-8');  
    console.log(json);
    var myRegexp = /<figure>([\s\S]*?) <\/th:bolock>/;
    var titleList = json.match(myRegexp);
    Logger.log(titleList);
    myRegexp = /<span>([\s\S]*?)<\/a><\/span>/;
    var movieTitle = titleList.toString().match(myRegexp);
    return "とら成年同人ランキング1位は、" + movieTitle[1] + "でした。";
  } catch(e){
    return "とら成年同人ランキング１位を取得出来ませんでした。";
  } 
}

function hhhhh(){
  // POSTデータ
  var payload = {
    "loginId" : "WKD15367",
    "password" : "Tora123",
  }
  // POSTオプション
  var options = {
    "method" : "POST",
    "payload" : payload,
    "followRedirects" : false,
    "muteHttpExceptions":true
  }
  
  // アクセス先（http headerなどでPOSTのURLなどを調べる）
  var url = "https://ec.toranoana.shop/ec/api/common/login/auth/"
  // POSTリクエスト
  var response = UrlFetchApp.fetch(url, options);
  
  console.log(response);
}

//JS実行用
function toraScraping() {
  
  // POSTデータ
  var payload = {
    "account" : "WKD15367",
    "password" : "Tora123",
  }
  // POSTオプション
  var options = {
    "method" : "POST",
    "payload" : payload,
    "followRedirects" : false
  }
  
  // アクセス先（http headerなどでPOSTのURLなどを調べる）
  var url = "https://ec.toranoana.shop/ec/app/common/login/"
  // POSTリクエスト
  var response = UrlFetchApp.fetch(url, options);
  
  
  const LOGINURL = 'https://ec.toranoana.shop/ec/app/common/login/'
  const URL = 'https://ec.toranoana.jp/tora_r/ec/cot/ranking/daily/all/';//とらランキング
  var key = 'ak-6hf6s-q65ch-kyz6q-1w75j-h66x4'; //ApiKey
  
  const postheader = {
    "accept":"gzip, */*",
    "timeout":"20000"
  }  
  
  const parameters = {
    "method": "get",
    "muteHttpExceptions": true,
    "headers": postheader
  }
  
  var payload = 
      {url:URL,
       renderType:'HTML',
       outputAsJson:true};
  payload = JSON.stringify(payload);
  payload = encodeURIComponent(payload);
  
  var url = 'https://phantomjscloud.com/api/browser/v2/'+ key +'/?request=' + payload;                
  var json = JSON.parse(UrlFetchApp.fetch(url).getContentText('UTF-8')); 
  console.log(json);
  var source = json["content"]["data"];  
  console.log(source);
  var myRegexp = /<figure>([\s\S]*?) <\/th:bolock>/;
  var title = source.match(myRegexp);
  console.log(title);
  myRegexp = /<span>([\s\S]*?)<\/a><\/span>/;
  var title2 = title.toString().match(myRegexp);
  
  console.log(title2[1]);
  Logger.log(title2[1]);
  
}


function hii() {
  Logger.log(toraRankingGet());
}


//JS実行用
function scraping() {
  const URL = 'https://movie.walkerplus.com/ranking/';//映画ランキング
  var key = 'ak-6hf6s-q65ch-kyz6q-1w75j-h66x4'; //ApiKey
  
  const postheader = {
    "accept":"gzip, */*",
    "timeout":"20000"
  }  
  
  const parameters = {
    "method": "get",
    "muteHttpExceptions": true,
    "headers": postheader
  }
  
  var payload = 
      {url:URL,
       renderType:'HTML',
       outputAsJson:true};
  payload = JSON.stringify(payload);
  payload = encodeURIComponent(payload);
  
  var url = 'https://phantomjscloud.com/api/browser/v2/'+ key +'/?request=' + payload;                
  
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(UrlFetchApp.fetch(url).getContentText('UTF-8')); 
  var source = json["content"]["data"];  
  var myRegexp = /<table class="rankingTable">([\s\S]*?)<\/table>/;
  var title = source.match(myRegexp);
  myRegexp = /<td><a href="\/mv[0-9]{1,8}\/">([\s\S]*?)<\/a><\/td>/;
  var title2 = title.toString().match(myRegexp);
  
  console.log(title2[1]);
  Logger.log(title2[1]);
  
}

function escapeHtml (string) {
  var entityMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    "&#39;": "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  return String(string).replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x60;|&#x3D;/g, function (s) {
    return entityMap[s];
  });
}

function aaaaaaa(){
  var aaa = "&#39;"
  Logger.log(escapeHtml(aaa))
  var exclusionURL = '(?!'+'https://eiga.k-img.com/images/ranking/rank_icon'.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')+')';
  Logger.log(escapeHtml(exclusionURL))
}