//flex
function FlexMessageSend(userid,headers){
  
  var dp = PropertiesService.getScriptProperties();
  var exec_count = dp.getProperty('exec_count');
  var remind_flg = dp.getProperty('remind_flg');
  var test_flg = dp.getProperty('test_flg');
  var quemsg = "";
  var yesmsg = "";
  var nomsg = "";
  
  //服薬中
  if (exec_count < 22) {
    quemsg = "さて、お薬は飲んだかな?";
    yesmsg = "飲んだよ！";
    nomsg = "飲んでない・・・";
    nomsg = "不満がある٩(๑`^´๑)۶"
  }
  //休薬中
  if (exec_count > 21) {
    quemsg = "シートは折ったかな？";
    yesmsg = "折った！";
    nomsg = "折ってない・・・";
  }
  //治った？
  if (test_flg > 0) {
    quemsg = "機能は治ったかな？";
    yesmsg = "治った！";
    nomsg = "治ってない・・・";
  }  
  
  var postData = {
    "to": userid,
    "messages": [
      {
        "type": "flex",
        "altText": "通知するわんっ！",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": quemsg,
                "weight": "bold",
                "size": "xs"
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
                  "type": "message",
                  "label": yesmsg,
                  "text": yesmsg
                }
              },
              {
                "type": "button",
                "style": "secondary",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": nomsg,
                  "text": nomsg
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
