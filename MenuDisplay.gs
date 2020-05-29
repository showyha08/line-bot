//flex
function FlexMessageSendMenu(userid,headers){
  var postData = {
    "to": userid,
    "messages": [
      {
        "type": "flex",
        "altText": "デートするわんっ！",
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://3.bp.blogspot.com/-4TEoxm0L3fM/VoX5K5zU6CI/AAAAAAAA2S0/kEyNKzeJLHI/s400/couple_date.png",
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
                  "label":"デート予定を登録",
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
                  "label": "デート予定を確認",
                  "text": "デート予定を確認"
                }
              },
              {
                "type": "button",
                "style": "primary",
                "color": "#cccccc",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "デート予定を削除",
                  "text": "デート予定を削除"
                }
              },
              {
                "type": "button",
                "style": "primary",
                "color": "#dab1f9",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "レストラン",
                  "text": "レストラン"
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
