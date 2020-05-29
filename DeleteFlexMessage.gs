//flex
function DeleteMessageSend(userid,headers){
  dbValueSet('delete_flg','1');
  var now = new Date();
  var week = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));// 一週間後 2017-12-25t00:00
  var initialDate = Utilities.formatDate( now, 'Asia/Tokyo', 'yyyy-MM-dd')
  var events = CalendarApp.getDefaultCalendar().getEvents(now, week,{search: '[デート]'});
  
  if (events.length === 0) {
    //body += "残念ながら見当たらないね・・・";
    //return body;
  }
  var idArr = [];
  var dayArr = [];
  events.forEach(function(event) {
    var title = event.getTitle();
    title = title.substr(5,title.length); 
    var day = toMMdd(event.getStartTime());
    idArr.push(event.getId());
    dayArr.push(day);
  });
  
  var actionObj = {};
  var hoge = {};
  var arr = [];
  var huga = {
    "type": "spacer",
    "size": "sm"
  };
  
  for (var i = 0;i < idArr.length;i++){
    actionObj = {
      "type": "message",
      "label": dayArr[i],
      "text": "[削除]" + idArr[i]
    };
    hoge = {
      "type": "button",
      "style": "primary",
      "height": "sm",
      "action": actionObj                
    };
    arr.push(hoge);
  };
  
  arr.push(huga);
  
  var postData = {
    "to": userid,
    "messages": [
      {
        "type": "flex",
        "altText": "削除するわんっ！",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "削除するスケジュールを選んでね",
                "weight": "bold",
                "size": "xs"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": arr
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