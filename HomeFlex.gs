//帰宅確認
function HomeFlexMessageSend(userid,headers){
  
  const quemsg = "お家に着いたかな?";
  const yesmsg = "着いたよ！";
  const nomsg = "着いてない・・・";
  const continuemsg = "帰宅中"
  const donemsg = "帰宅してるよ٩( 'ω' )و"
  const angrymsg = "怒ってる٩(๑`^´๑)۶"
  
  var postData = {
    "to": userid,
    "messages": [
      {
        "type": "flex",
        "altText": "お家に帰るわんっ！",
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
                "type": "button",
                "style": "secondary",
                "color": "#ffd700",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": continuemsg,
                  "text": continuemsg
                }
              },
              {
                "type": "button",
                "style": "secondary",
                "color": "#1E90FF",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": donemsg,
                  "text": donemsg
                }
              },
              {
                "type": "button",
                "style": "secondary",
                "color": "#d81c1c",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": angrymsg,
                  "text": angrymsg
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