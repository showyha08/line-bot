function setRemindMessage() {
  //スプレッドシートにメッセージと時間を記録
  //スプレッドを見て毎日登録するようにする
  //[明日の15時から」
  //「燃えるごみ」「毎週水曜日の朝8時」
  //「歯医者さん」「2月20日 10:00」
  //「カップラーメン」「3分後」
  //同時にタイマーをセット
  setRemindSchedule(repeat,datetime)
}

function pushRemindMessage(repeat,plusDay,plusHours,plusMinute,plusSecond) {
  //スプレッドシートから現在時刻のメッセージを取得して送信
  var today = new Date();
  today.setDate(today.getDate() + plusDay); 
  today.setHours(today.getHours() + plusHours); 
  today.setMinutes(today.getMinutes() + plusMinute); 
  today.setSeconds(today.getSeconds() + plusSecond); 
  Logger.log(today)
  setRemindSchedule(repeat,today);
}

function hhaa(){
  var message = "2019年11月1日";
  Logger.log(message.replace(/年|月|日/g,"\u002f") );
  
}

function hh(){
  var message = "1ヵ月後";
  var plusYear = 0;
  var plusMonth = 0;
  var plusDay = 0;
  var plusHours = 0;
  var plusMinute = 0;
  var plusSecond = 0;
  var repeat = "";
  //bit反転演算子を使用 indexOfは見つからないと-1を返す、つまり反転で0。javascriptで0はfalse.
  // TODO: 組み合わせ非対応、例えばx分y秒、
  if(~message.indexOf("明日")){
    plusDay++;
    plusHours = timeGet(message);
  } else if (~message.indexOf("明後日")){    
    plusDay = 2;
  } else if (~message.indexOf("明々後日")){
    plusDay = 3;
  } else if (~message.indexOf("来週")){
    plusDay = 7;
  } else if (~message.indexOf("再来週")){
    plusDay = 14;
  } else if (~message.indexOf("再々来週")){
    plusDay = 21;
  } else if (~message.indexOf("来月")){
    plusDay = 30;
  } else if (~message.indexOf("毎日")){
    plusDay = 0;
    repeat = "day";
    //日時を取得
  } else if (~message.indexOf("毎週")){
    plusDay = 0;  
    repeat = "week";
    //曜日と時間を取得
  } else if (~message.indexOf("毎月")){
    plusDay = 0;
    repeat = "month";
    //日付と時間を取得
  } else if (~message.indexOf("毎年")){
    plusDay = 0;
    repeat = "year"; 
  } else {}
  
   if (~message.indexOf("秒")){
    plusSecond = parseInt(timeGet(message));
   } 
   if (~message.indexOf("分")){
    plusMinute = parseInt(timeGet(message));
    } 
  
  if (~message.indexOf("時間")){
    plusHours = parseInt(timeGet(message));  
  } 
  
  if (~message.indexOf("日後")){
    plusDay = parseInt(timeGet(message));
  } 
  
  if (~message.indexOf("月後")){
    plusMonth = parseInt(timeGet(message));
  }
  
  if (~message.indexOf("年後")){
    plusYear = parseInt(timeGet(message));
  }
  
  Logger.log(plusYear);
  Logger.log(plusMonth);  
  Logger.log(plusDay);
  Logger.log(plusHours);
  Logger.log(plusMinute);
  Logger.log(plusSecond);
  //毎週の何曜日
  //毎月
  var today = new Date();
  today.setFullYear(today.getFullYear() + plusYear); 
  today.setMonth(today.getMonth() + plusMonth); 
  today.setDate(today.getDate() + plusDay); 
  today.setHours(today.getHours() + plusHours); 
  today.setMinutes(today.getMinutes() + plusMinute); 
  today.setSeconds(today.getSeconds() + plusSecond); 
  Logger.log(today)
  var setYear = today.getYear();
  var setMonth = today.getMonth();
  var setDate = today.getDate();
  var setHour = today.getHours();
  var setMinute = today.getMinutes();
  var setSeconds = today.getSeconds();
  var setTime = new Date();
  setTime.setYear(setYear);
  setTime.setMonth(setMonth);
  setTime.setDate(setDate);
  setTime.setHours(setHour);
  setTime.setMinutes(setMinute); 
  setTime.setSeconds(setSeconds);
  Logger.log(setTime.toLocaleString())
  
  // 繰り返しの場合シートに記録
  if (repeat){
    var spreadsheet = SpreadsheetApp.openById(RESTAURANT_SHEET_ID);
    var sheet = spreadsheet.getSheetByName('Remind');
    const columnBVals = sheet.getRange('B:B').getValues();
    const LastRow = columnBVals.filter(String).length + 1;
    var values = [[ today.getTime(), "hoge"]];
    sheet.getRange("B"+ LastRow + ":C" + LastRow).setValues(values);
    
  }else{
    // 単発
    var setTime = new Date();
    setTime.setHours(8);
    setTime.setMinutes(00); 
    //ScriptApp.newTrigger('push_main').timeBased().at(setTime).create();
  }
  
  //ScriptApp.newTrigger('bb').timeBased().at(setTime).create();
  //setRemindSchedule(repeat,today);
  //pushRemindMessage(repeat,plusDay,plusHours,plusMinute,plusSecond);
}


function timeGet(message){
  Logger.log("timeGet開始")
  var time;
  //bit反転演算子を使用 indexOfは見つからないと-1を返す、つまり反転で0。javascriptで0はfalse.
  if(~message.indexOf("日後")){
    Logger.log("日後取得")
    time = timeGetFor(message,"日後")
  } else if (~message.indexOf("時")){
    Logger.log("時取得")
    time = timeGetFor(message,"時")
  } else if (~message.indexOf("分")){    
    Logger.log("分取得")
    time = timeGetFor(message,"分")
  } else if (~message.indexOf("秒")){  
    Logger.log("秒数取得")
    time = timeGetFor(message,"秒")
  } else if (~message.indexOf("年")){
    Logger.log("年")
    time = timeGetFor(message,"年") 
  } else if (~message.indexOf("ヶ月")){  
    Logger.log("ヶ月取得")
    time = timeGetFor(message,"ヶ月")
  } else if (~message.indexOf("か月")){  
    Logger.log("か月取得")
    time = timeGetFor(message,"か月")
  } else if (~message.indexOf("ヵ月")){  
    Logger.log("ヵ月取得")
    time = timeGetFor(message,"ヵ月")     
  } else if (~message.indexOf(":00")){    
    time = message.slice(message.indexOf(":00")-2,message.indexOf(":00"))
    if(Number(time).isNaN){
      time = message.slice(message.indexOf(":00")-1,message.indexOf(":00"))
    }; 
  } else {
    Logger.log("該当なし")
  }
  return(time);
}

function timeGetFor(message,timeName){
  Logger.log(message)
  Logger.log(timeName)
  var time;
  for (var i = 10; 0<i; i-- ){
    //文字列が少なすぎるときの救済
    if(message.indexOf(timeName)-i < 0)continue;
    time = message.slice(message.indexOf(timeName)-i,message.indexOf(timeName)) 
    //秒数を取得できたら終了
    if(isFinite(time))break;
  } 
  return time;
}

function b(time){
  //bit反転演算子を使用 indexOfは見つからないと-1を返す、つまり反転で0。javascriptで0はfalse.
  if(~message.indexOf("朝")||~message.indexOf("午前")){
    plusDay++;
  } else if (~message.indexOf("夕方")||~message.indexOf("夜")||~message.indexOf("午後")){    
    plusDay = 2;
  } else if (~message.indexOf("明々後日")){
    
  } else {
    
  }
}

function bb(){
  var   a = 1 && 0;
  Logger.log(a)
  a = 0 && 1;
  Logger.log(a)
  a = 1 && 1;
  Logger.log(a)
  a = 0 && 0;
  Logger.log(a)
  
  if (1 && 0) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
  if (0 && 1) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
    if (1 && 1) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
  if (0 && 0) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
}


//タイマーセット
// 0 false 1 true
function setRemindSchedule(repeat,datetime){
  //単発か繰り返しか判別
  
}