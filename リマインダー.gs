var remindModeOff = 0
var remindScheduleRegisterMode = 1
var remindMessageRegisterMode = 2

//リマインドモード起動
function remaindStartUpCheck(message){
  var startUpMessage = "リマインダー"
  
  if (message == startUpMessage){
    dbValueSet('remind_flg',remindScheduleRegisterMode);
    return true;
  } else {
    return false;
  };
  
}

//リマインドを確認
function remaindConfirmation(message){
  var startUpMessage = "リマインドを確認"
  
  if (message == startUpMessage){
    return true;
  } else {
    return false;
  };
  
}


//時間登録モード
function remaidScheduleRegister(datetime,source){
  
  if(dbValueGet('remind_flg') == remindScheduleRegisterMode){
    
    dbValueSet('remind_temp_'+source+'_datetiime',datetime);
    
    var setTriggerFunction = function(datetime,execFunc){
      
       var setTime = new Date()
      //202005241110
      var tfullYear = datetime.slice(0,4)
      var tmonth = datetime.slice(4,6)
      var tdate = datetime.slice(6,8)
      var tHours = datetime.slice(8,10)
      var tMinutes = datetime.slice(8,10)
      
      setTime.setFullYear(tfullYear);
      setTime.setMonth(tmonth);
      setTime.setDate(tdate);
      setTime.setHours(tHours)
      setTime.setMinutes(tMinutes)
      ScriptApp.newTrigger(execFunc).timeBased().at(setTime).create();
    }
    
    setTriggerFunction(datetime,'reminder_push_main')

    dbValueSet('remind_flg',remindMessageRegisterMode);
    return true;
  } else {
    return false;
  };
  
}


//入力例 2020/05/24 11:10
//出力例 202005241110
function dateTimeSeparaterDelete(datetime){
    let replaceWord = /\//g;
    var datetimenow = new Date()
    console.log(toyyyyMMddHHmm(datetimenow))
    datetime = datetime.replace(replaceWord, "").replace(" ","").replace(":","");
    return datetime
}



//メッセージ登録モード
function remaidMessageRegister(message,source){
  
  if (dbValueGet('remind_flg') == remindMessageRegisterMode){
    
    if (message == "やめる"){
      dbValueSet('remind_flg',remindModeOff);
      return false;
    } 
    
    var datetime = dbValueGet('remind_temp_'+source+'_datetiime')
    datetime = dateTimeSeparaterDelete(datetime)
    dbValueSet(datetime+'_remind', source + "," + message);
    dbValueSet('remind_flg',remindModeOff);
    return true
  } 
  
}

//リマインドメッセージ送信
function reminder_push_main(){
  var dateTimeNow = new Date()
  dateTimeNow = toyyyyMMddHHmm(dateTimeNow)
  
  var remaindArr = dbValueGet(dateTimeNow + '_remind').split(",");
  var remindTo = remaindArr[0]
  var remindMsg = remaindArr[1];
  
  //リマインド送信
  sendPushMessage(remindTo,remindMsg)
  
  dbValueDelete(dateTimeNow + '_remind')
  
}

//flex
function reminderFlexMessageSendMenu(userid,headers){
  var postData = {
    "to": userid,
    "messages": [
      {
        "type": "flex",
        "altText": "リマインドするわんっ！",
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://cdn.wikiwiki.jp/to/w/glspam/%E4%B8%96%E7%95%8C%E5%90%8D%E4%BD%9C%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%AC%E3%83%81%E3%83%A3/::ref/2433_l_f_sp.gif?rev=a5d9bf81a9ed3e134f092dc8f87ad18e&t=20180121222840",
            "size": "md",
            "aspectRatio": "1:1",
            "aspectMode": "cover"
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
                  "type":"datetimepicker",
                  "label":"リマインドを登録",
                  "data":"datetimepicker",
                  "mode":"datetime"
                }
              },      
              {
                "type": "button",
                "style": "primary",
                "color": "#7ebea5",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "リマインドを確認",
                  "text": "リマインドを確認"
                }
              },
              {
                "type": "button",
                "style": "primary",
                "color": "#cccccc",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "リマインドを削除",
                  "text": "リマインドを削除"
                }
              },
              {
                "type": "spacer",
                "size": "sm"
              }
            ]
          }
        }}
      
    ]};
  
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  var response = UrlFetchApp.fetch(url, options);
}
