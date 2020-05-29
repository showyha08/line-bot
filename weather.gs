/** 
* rainyAndTemperatureForecast 気象庁の情報をxmlに変換しているページから情報取得、1日1回 AM 6:00 ごろ更新らしい
* @param selectedArea 天気予報取得対象
* @param getDays 取得したい日数
* @return {array} [1:最高気温/最低気温,2:傘予想,3:天気予報,4:天気絵文字]
*                 失敗したらnullを返す
*/
function rainyAndTemperatureForecast(selectedArea) {
  
  // no:URL番号
  // area:xml中のarea id
  const AREA  = {
    kanagawaEast : {area:'東部', no:'14'},
    kanagawaWest : {area:'西部', no:'14'},
    tokyo : {area:'東京地方',no:'13'},
    chiba : {area:'北東部',no:'12'},
    yamanashi : {area:'東部・富士五湖',no:'19'}
  }
  const weatherUrl = "https://www.drk7.jp/weather/xml/"+AREA[selectedArea].no+".xml"
  const options = {
    "contentType" : "text/xml;charset=utf-8",
    "method" : "get",
  };
  
  try{
    var response = UrlFetchApp.fetch(weatherUrl, options); 
    var xmlDoc = XmlService.parse(response.getContentText());
    var rootDoc = xmlDoc.getRootElement();
    var nsSoapenv = XmlService.getNamespace("soapenv", "http://schemas.xmlsoap.org/soap/envelope/");
    var nsDefault = XmlService.getNamespace("", "urn:partner.soap.sforce.com");  
    var targetRegion = parser.getElementById(rootDoc, AREA[selectedArea].area);
    var weather = parser.getElementsByTagName(targetRegion, 'weather');
    var temperature = parser.getElementsByTagName(targetRegion, 'range');
    //最高気温最低気温
    var tempmsg = temperature[0].getValue() + "℃/" + temperature[1].getValue() + "℃"
    //降水確率取得
    var rainyPercent = parser.getElementsByTagName(targetRegion, 'period');
    //傘予想
    var umbrellamsg = getUmbrellNecessary(rainyPercent[1].getValue(),rainyPercent[2].getValue(),rainyPercent[3].getValue());
    //絵文字取得
    var emoji = addEmoji(weather[0].getValue())
    var rainyTemperature = [tempmsg,umbrellamsg,weather[0].getValue(),emoji];
    Logger.log(rainyTemperature);
    return rainyTemperature
  }catch (e){
    return null
  }
}

// 傘を持って行くか判別
// 6:00~12:00,12:00~18:00,18:00~24:00 で判定している。
// お昼いらないかも？
function getUmbrellNecessary(mor,eve,nig){
  var msg = ""
  if (mor < 30 && eve < 30 && nig < 30 ) {
    msg = "傘は持たなくても良いわん！";
  }
  if (mor == 30 || eve == 30 || nig == 30 ) {
    msg = "折りたたみ傘があると安心わん！";
  }
  if (mor > 30 || eve > 30 || nig > 30 ) {
    msg = "傘を持って行ったほうが良いわん！";
  }
  return msg
}

//Livedoorからparseする処理
function weatherForecast() {
  var response = UrlFetchApp.fetch("http://weather.livedoor.com/forecast/webservice/json/v1?city=130010"); //URL+cityID
  var json=JSON.parse(response.getContentText());
  var todayWeather=(json["forecasts"][0].telop);
  Logger.log(todayWeather);  
  return todayWeather
}

/** 
* addEmoji 文字列→LINE絵文字に変換して返却
* @param {project.MyClass} forecast 天気予報の文言
* @return {string} LINE絵文字 
*/
function addEmoji(forecast){
  var tenkiTbl = new Array("晴れ","くもり","雨","のち","時々","一時","暴風","雷","雪"); 
  var emojiTbl = new Array("\uDBC0\uDCA9","\uDBC0\uDCAC","\uDBC0\uDCAA","→","/","一","\uDBC0\uDC3A\uDBC0\uDCA2","\uDBC0\uDC3A","\uDBC0\uDCAB"); 
  var emoji = ""; 
  //天気予報は長くとも天気+接続詞+天気で３ワード
  for (var i=0;i<3;i++){
    tenkiTbl.forEach(function(tenki){
      if(forecast.indexOf(tenki) == 0.0){
        emoji = emoji + emojiTbl[tenkiTbl.indexOf(tenki)];
        forecast = forecast.slice(tenki.length);
      }
    })
    if (forecast == "")break;
  }
  return emoji
}


/** 
* rainyAndTemperatureForecast 気象庁の情報をxmlに変換しているページから情報取得、1日1回 AM 6:00 ごろ更新らしい
* @param selectedArea 天気予報取得対象
* @param getDays 取得したい日数
* @return {array} [1:最高気温/最低気温,2:傘予想,3:天気予報,4:天気絵文字]
*                 失敗したらnullを返す
*/
function rainyAndTemperatureForecastWeek(selectedArea) {
  
  // ハードコーディング過ぎる
  // no:URL番号
  // area:xml中のarea id
  const AREA  = {
    kanagawaEast : {area:'東部', no:'14'},
    kanagawaWest : {area:'西部', no:'14'},
    hokkaido : {area:'上川地方',no:'01'},
    aomori : {area:'三八上北',no:'02'},
    iwate : {area:'内陸',no:'03'},
    miyagi : {area:'東部',no:'04'},
    akita : {area:'内陸',no:'05'},
    yamagata : {area:'庄内',no:'06'},
    fukushima : {area:'中通り',no:'07'},
    ibaraki : {area:'北部',no:'08'},
    tochigi : {area:'北部',no:'09'},
    gunma : {area:'北部',no:'10'},
    saitama : {area:'北部',no:'11'},  
    chiba : {area:'北東部',no:'12'},
    tokyo : {area:'東京地方',no:'13'},
    kanagawa : {area:'西部', no:'14'},
    niigata : {area:'上越',no:'15'},
    toyama : {area:'東部',no:'16'},
    ishikawa : {area:'加賀',no:'17'},
    fukui : {area:'嶺北',no:'18'},
    yamanashi : {area:'東部・富士五湖',no:'19'},
    nagano : {area:'中部',no:'20'},
    gifu : {area:'美濃地方',no:'21'},
    shizuoka : {area:'伊豆',no:'22'},
    aichi : {area:'東部',no:'23'},
    mie : {area:'北中部',no:'24'},
    shiga : {area:'北部',no:'25'},
    kyoto : {area:'北部',no:'26'},
    osaka : {area:'大阪府',no:'27'},
    hyogo : {area:'北部',no:'28'},
    nara : {area:'北部',no:'29'},
    wakayama : {area:'北部',no:'30'},
    tottori : {area:'中・西部',no:'31'},
    shimane : {area:'東部',no:'32'},
    okayama : {area:'北部',no:'33'},
    hiroshima : {area:'北部',no:'34'},
    yamaguchi : {area:'中部',no:'35'},
    tokushima : {area:'北部',no:'36'},
    kagawa : {area:'香川県',no:'37'},
    ehime : {area:'中予',no:'38'},
    kouchi : {area:'中部',no:'39'},
    fukuoka : {area:'北九州地方',no:'40'},
    saga : {area:'北部',no:'41'},
    nagasaki : {area:'五島',no:'42'},
    kumamoto : {area:'天草・芦北地方',no:'43'},
    oita : {area:'中部',no:'44'},
    miyazaki : {area:'北部山沿い',no:'45'},
    kagoshima : {area:'大隅地方',no:'46'},
    okinawa : {area:'与那国島地方',no:'47'}
  }
  const weatherUrl = "https://www.drk7.jp/weather/xml/"+AREA[selectedArea].no+".xml"
  const options = {
    "contentType" : "text/xml;charset=utf-8",
    "method" : "get",
  };
  
  try{
    var response = UrlFetchApp.fetch(weatherUrl, options); 
    var json = response.getContentText('UTF-8');  
    var xmlDoc = XmlService.parse(response.getContentText());
    
    var rootDoc = xmlDoc.getRootElement();
    var myRegexp = /<info date="([\s\S]*?)">/;
    var getDate = json.match(myRegexp);
    var nsSoapenv = XmlService.getNamespace("soapenv", "http://schemas.xmlsoap.org/soap/envelope/");
    var nsDefault = XmlService.getNamespace("", "urn:partner.soap.sforce.com");  
    var area = parser.getElementsByTagName(rootDoc, 'area');
    var stDay = getDate[1];
    var dt = new Date(stDay.substr(0,4), Number(stDay.substr(5,2))-1,Number(stDay.substr(8,2)));
    var targetRegion = parser.getElementById(rootDoc, AREA[selectedArea].area);
    var weather = parser.getElementsByTagName(targetRegion, 'weather');
    var temperature = parser.getElementsByTagName(targetRegion, 'range');
    var period = parser.getElementsByTagName(targetRegion, 'period');
    
    var tempmsg =""
    var weatherMsg =""
    var rainyPercent = ""
    var umbrellamsg =""
    var rainyAverage =""
    
    var sum = function(arr) {
      var total = 0, i = 0, len = 0;
      if (Object.prototype.toString.call(arr) !== '[object Array]') return;
      for (i = 0, len = arr.length; i < len; i++) total += Number(arr[i]);
      return total;
    };
    var     date = parser.getElementsByTagName(targetRegion, 'info');
    //最高気温最低気温
    for (var i = 0;i < 14;i=i+2){
      weatherMsg = weatherMsg + Utilities.formatDate( dt, 'Asia/Tokyo', 'yyyy年M月d日') +"\n"+addEmoji(weather[i/2].getValue())+weather[i/2].getValue()+"("+ temperature[i].getValue() + "℃/" + temperature[i+1].getValue() + "℃)\n"
      //降水確率取得
      //rainyPercent = parser.getElementsByTagName(targetRegion, 'period');
      //var rainyAverageArr = [rainyPercent[i].getValue(),rainyPercent[i+1].getValue(),rainyPercent[i+2].getValue(),rainyPercent[i+3].getValue()];
      //rainyAverage = sum(rainyAverageArr)/rainyAverageArr.length
      dt.setDate(dt.getDate() + 1);
    }
    Logger.log(weatherMsg);
    return weatherMsg
  }catch (e){
    Logger.log(e)
    return null
  }
}

function fuaga(){
  rainyAndTemperatureForecastWeek("kanagawaWest") 
  
}
