//Enum
//命名規則
//大文字のスネークケース
//曖昧な略語や、文字数を省略した略語は使わない
var RESTAURANT_SHEET_ID = dbValueGet('restaurant_sheet_id');
var CHANNEL_ACCESS_TOKEN = dbValueGet('channel_access_token');
var USER_ID = dbValueGet('user_id');
var GIRL_FRIEND_ID = dbValueGet('girl_friend_id');

// Reply API は 30秒以内に Reply API を返す事。返信で30秒を超える場合はpushを使う。
var LINE_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';
var url = "https://api.line.me/v2/bot/message/push";

//Bearer(ベラー)持参人払い、映画のチケットみたいな使い方をされるもの
var headers = {
  "Content-Type": "application/json",
  'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
};

// モジュールパターンとは
// 名前空間 ＋ プライベートメンバ、パブリックメンバの使い分け ＋ 即時関数 で作る

//push機能 8:00
function push_main(){
  //返答フラグリセット
  dbValueSet('pill_drinked_flg', 0);
  dbValueSet('get_home_res_flg', 9);

  push_message(GIRL_FRIEND_ID); 
  push_message(USER_ID);
}

//占いpush機能 8:30
function horoscope_push_main(){
  var HoroscopesMsg = getHoroscopes()
  sendPushMessage(GIRL_FRIEND_ID,HoroscopesMsg)
  sendPushMessage(USER_ID,HoroscopesMsg)
}

//レストランpush機能 9:00
function restaurant_push_main(){
  var RestaurantMsg = getTheDayRestaurant()
  if (RestaurantMsg !=""){
    sendPushMessage(GIRL_FRIEND_ID,RestaurantMsg)
    sendPushMessage(USER_ID,RestaurantMsg)
  }
}

//帰宅チェック機能 21:00
function home_push_main(){
  
  //返答フラグが立ってない場合、忘れてるフラグON
  if (dbValueGet('pill_drinked_flg') == 0) {
    dbValueSet('forget_flg', 1)
  }
  
  //帰宅フラグリセット
  dbValueSet('pill_drinked_flg', 9);
  dbValueSet('get_home_res_flg', 0);
  HomeFlexMessageSend(GIRL_FRIEND_ID,headers); 
  HomeFlexMessageSend(USER_ID,headers); 
}

//返答がない場合の帰宅チェック機能 00:00
function late_home_push_main(){
  
  //返答フラグが立ってない場合、催促
  if (dbValueGet('get_home_res_flg') == 0) {
    var lateMsg = "う〜ん。お家に帰ったかどうかわからないわん〜\uDBC0\uDC5E"
    sendPushMessage(GIRL_FRIEND_ID,lateMsg)
    sendPushMessage(USER_ID,lateMsg)
  }
 
}


//通知機能
function push_message(userid) {
  var today = new Date();
  var toWeekday = toWD(today);
  var togetherMessage = "";
  var togethePeriod = getTogether()
  if (togethePeriod%50 == 0){
    togetherMessage = "２人が付き合ってちょうど" + togethePeriod +"日目だね\uDBC0\uDCB1\n" 
  }
  var birthMessage = birthDayChk(dbValueGet('risa_birthday'));
  var dogmsg = "";
  var datemsg = "";
  var rAndTmsg = rainyAndTemperatureForecast("tokyo");
  var weatherMessage = "";
  if (rAndTmsg != null){
    weatherMessage = "■気温：("+rAndTmsg[0]+")\n■天気：" + rAndTmsg[2] + rAndTmsg[3] + "\n" + rAndTmsg[1] + "\n" + dogmsg + datemsg;
  } else {
    weatherMessage = "天気を取得出来なかったわん・・・";
  }
  var dp = PropertiesService.getScriptProperties();
  var exec_count = dp.getProperty('exec_count')
  var noticeMessage = "";

  //日数に応じてメッセージを変更
  dogmsg = sentenceBranch();
  datemsg = getDateEvents();
  
  var sendMessage = birthMessage + "おはようございます、ご主人様！\n" + noticeMessage + "今日は、" + Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy年M月d日') + toWeekday + "だよ！\n"+ togetherMessage + weatherMessage + dogmsg
  
  sendPushMessage(userid,sendMessage)
  
  //服薬期間中はFlexMessageを送る
  if (exec_count < 22 ){
    FlexMessageSend(userid,headers);
  }else {
    dp.setProperty('pill_drinked_flg', '2');
  }
}

//タイマーセット
function setTrigger(){
  
  //関数リテラル_無名関数
  //@param time 設定する時間
  //@param execFunc 設定するFunction名
  var setTriggerFunc = function(time,execFunc){
    var setTimeArr = time.split(":")
    var setTime = new Date()
    setTime.setHours(Number(setTimeArr[0]))
    setTime.setMinutes(Number(setTimeArr[1]))
    ScriptApp.newTrigger(execFunc).timeBased().at(setTime).create();
  }
  //薬
  setTriggerFunc('8:00','push_main')
  //占い
  setTriggerFunc('8:30','horoscope_push_main')
  //レストラン
  setTriggerFunc('9:00','restaurant_push_main')
  //帰宅
  //setTriggerFunc('21:00','home_push_main')
  //帰宅2
  //setTriggerFunc('00:00','late_home_push_main')
}

//実行回数加算と交際日数加算
function plusExecCount() {
  console.log('加算処理開始')
  var exec_count = dbValueGet('exec_count');
  var together_period = dbValueGet('together_period');
  if (exec_count == 28.0) {
    exec_count = 0;
  }
  exec_count++;
  together_period++;
  dbValueSet('exec_count', exec_count);
  dbValueSet('together_period', together_period);
  console.log('加算処理正常終了：exec_count = '+exec_count + 'together_period=' + together_period)
}

//実行回数加算と交際日数加算
function modExecCount() {
  console.log('加算処理開始')
  var exec_count = dbValueGet('exec_count');
  exec_count--;
  dbValueSet('exec_count', exec_count);
}


//ユーザー名取得
function getUsername(userId) {
  var urlProfile = 'https://api.line.me/v2/bot/profile/' + userId;
  var response = UrlFetchApp.fetch(urlProfile, {
    'headers': {
      'method' : 'get',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    }
  });
  return JSON.parse(response.getContentText()).displayName;
}

//交際期間取得
function getTogether() {
  var dp = PropertiesService.getScriptProperties();
  var together_period = dp.getProperty('together_period');
  //小数点削除
  together_period = together_period.substr(0,together_period.length - 2)
  Logger.log('交際期間:'+together_period)
  return together_period;
}

function birthDayChk(birthday){
  var today = new Date();
  if (Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy年MM月dd日').slice(5,11) == birthday.slice(5,11))
  {
    return String((Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy年MM月dd日').slice(0,4)-birthday.slice(0,4))+'歳のお誕生日おめでとう！\uDBC0\uDC76\uDBC0\uDC2D\n');
  } else {
    return '';
  }
}

//当日Googleカレンダー予定からデート予定を取得
function getDateEvents() {
  var now = new Date();
  var week = new Date(now.getTime() + (180 * 24 * 60 * 60 * 1000));// 一番左の数字が未来の日数
  var initialDate = Utilities.formatDate( now, 'Asia/Tokyo', 'yyyy-MM-dd')
  var events = CalendarApp.getDefaultCalendar().getEvents(now, week,{search: '[デート]'});
  var body = "";
  
  if (events.length === 0) {
    return body;
  }
  body += "今後のデート予定は\n";
  events.forEach(function(event) {
    var title = event.getTitle();
    title = title.substr(5,title.length); 
    var day = toMMdd(event.getStartTime());
    var wd = toWD(event.getStartTime());
    var start = toHHmm(event.getStartTime());
    var end = toHHmm(event.getEndTime());
    body += "★" + day + wd + start + " ~ " + end + "\n";
  });
  body += "今から楽しみだね！\uDBC0\uDCB1";
  return body;
}

////////////////////////////////////////////////////////////////////////////////////////
////Util

// Propety値取得
function dbValueGet(property) {
  var dp = PropertiesService.getScriptProperties();
  return dp.getProperty(property);
}

// Propety値保存
function dbValueSet(property,value) {
  var dp = PropertiesService.getScriptProperties();
  dp.setProperty(property, value);
}

// Propety値削除
function dbValueDelete(property) {
  var dp = PropertiesService.getScriptProperties();
  dp.deleteProperty(property)
}

function toyyyyMMddHHmm(date){
  return Utilities.formatDate(date, "JST", "yyyyMMddHHmm");
}

function toHHmm(date){
  return Utilities.formatDate(date, "JST", "HH:mm");
}

function toMMdd(date){
  return Utilities.formatDate(date, "JST", "MM/dd");
}

function toWD(date){
  var myTbl = new Array("日","月","火","水","木","金","土","日"); 
  var myDay = Utilities.formatDate(date, "JST", "u");
  return "(" + myTbl[myDay] + ")";
}


////////////////////////////////////////////////////////////////////////////////////////
////API

// 応答メッセージを送る
// 応答トークンは一定の期間が経過すると無効。応答トークンは1回のみ使用可能。
function sendReplyMessage(replyToken,resMessage) {
  
  var replyDate = {
    'replyToken': replyToken,
    'messages': [{
      'type': 'text',
      'text': resMessage,
    }]
  }
  
  var options =  {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(replyDate)
  };
  
  UrlFetchApp.fetch(LINE_ENDPOINT,options);
}

// プッシュメッセージを送るAPIを利用
function sendPushMessage(source,message) {
  
  var postData = {
    "to": source,
    "messages": [{
      "type": "text",
      "text": message
    }]}
  
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  
  UrlFetchApp.fetch(url, options);
}


//
function post_back(e){
  var data = e.postback.data;
  console.log(data)
  var replay_text = "";
  if (data == "datetimepicker") {
    if(e.postback.params['datetime']){
    replay_text = e.postback.params['datetime'];
    replay_text = replay_text.slice(0,4)+"/"+replay_text.slice(5,7)+"/"+replay_text.slice(8,10)+" "+replay_text.slice(11,16)
    }else if (e.postback.params['time']){
    replay_text = e.postback.params['time'];
    }
  } 
  return replay_text;
}
