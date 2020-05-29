//response機能
//ポストで送られてくるので、送られてきたJSONをパース
function doPost(e) {
  
  var json = JSON.parse(e.postData.contents);
  console.log(json)
  var events = json["events"];
  var message = "";
  var resMessage ="LINEを転送したわん！";
  var datetime = "";
  
  //返信するためのトークン取得
  var reply_token= json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  
  //送信者IDと送信者名を取得
  var source = json.events[0].source.userId;
  var username = getUsername(source)
  
  
  // スケジュール登録か確認
  if (events[0].type == "postback") {
      datetime = post_back(events[0])
      
    //リマインド登録モード
    if(remaidScheduleRegister(datetime,source)){
      resMessage = "リマインドしたい言葉をおしえて欲しいわん！"
      sendReplyMessage(reply_token,resMessage);
      return;
    }else{
      //スケジュール登録
      scheduleSet(datetime);
      message = datetime + "に約束!\uDBC0\uDC5E";
      resMessage = message;
    }
    
  } 
  else if (events[0].type == "message"){
    //送られたメッセージを取得
    message = json.events[0].message.text;
    
    // おくすりチェック
    if(dbValueGet('pill_drinked_flg') == 0){
      resMessage = pillDrinkTimeJudge(message);
    }
    
    //未帰宅の場合は帰宅に関する返答かチェック
    if(dbValueGet('get_home_res_flg') == 0){
      resMessage = getHomeTimeJudge(message)
    }
    
  }
  
  // ラブスタイル発動
  if (message == "やめる"){
    resMessage = "ラブスタイルをやめるわん！"
    dbValueSet('love_style_flg','-1');
          //初期化
      dbValueSet('eros','0');
      dbValueSet('mania','0');
      dbValueSet('agape','0');
      dbValueSet('ludas','0');
      dbValueSet('storge','0');
      dbValueSet('pragma','0');
  }
  
  // ラブスタイル発動
  if (message == "ラブスタイル"){
        
    resMessage = "最も親しい異性を一人思い浮かべ、その人に対するあなたの気持ちや行動について、「全く当てはまらない」を1点、「良くあてはまる」を５点として質問に答えてほしいわん！"
    sendReplyMessage(reply_token,resMessage)
    Utilities.sleep(7000);
    
    dbValueSet('love_style_flg','0');
    loveCheck(source,0)
    return
  }
  
  //ラブスタイル回答
  if (Number(dbValueGet('love_style_flg'))>=0 && (message == "1" || message == "2" || message == "3" || message == "4" || message == "5") ){

    sheetWrite(message,'ResTime');
    //加算
    if(Number(dbValueGet('love_style_flg')) < 4){
      dbValueSet('eros',Number(dbValueGet('eros')) + Number(message));
    } else if (Number(dbValueGet('love_style_flg')) < 8){
      dbValueSet('mania',Number(dbValueGet('mania')) + Number(message));
    } else if (Number(dbValueGet('love_style_flg')) < 12){
      dbValueSet('agape',Number(dbValueGet('agape')) + Number(message))
    } else if (Number(dbValueGet('love_style_flg')) < 16){
      dbValueSet('ludas',Number(dbValueGet('ludas')) + Number(message));
    } else if (Number(dbValueGet('love_style_flg')) < 20){
      dbValueSet('storge',Number(dbValueGet('storge')) + Number(message));
    } else if (Number(dbValueGet('love_style_flg')) < 24){
      dbValueSet('pragma',Number(dbValueGet('pragma')) + Number(message));
    } 
    
    if (Number(dbValueGet('love_style_flg')) < 23){
      //次の質問
      dbValueSet('love_style_flg', Number(dbValueGet('love_style_flg')) + 1)
      loveCheck(source,Number(dbValueGet('love_style_flg')))
      return
    } else {
      dbValueSet('love_style_flg',"-1");
      //最終結果
      resMessage = username + "さん お疲れさまでした!点数発表だよ！\nエロス/美への愛：" + dbValueGet('eros') + "\nマニア/嫉妬深い愛：" + dbValueGet('mania') + "\nアガペ/愛他的な愛：" +dbValueGet('agape')+ "\nルダス/遊びの愛：" 
      + dbValueGet('ludas') + "\nストルゲ/友愛的な愛："+ dbValueGet('storge') + "\nプラグマ/実利的な愛："+ dbValueGet('pragma');
      sheetWrite(username + resMessage,'ResTime');
      //初期化
      dbValueSet('eros','0');
      dbValueSet('mania','0');
      dbValueSet('agape','0');
      dbValueSet('ludas','0');
      dbValueSet('storge','0');
      dbValueSet('pragma','0');
      sendReplyMessage(reply_token,resMessage);
      return
    }
    
  }
  
  // スケジュール
  if (message == "スケジュール"){
    FlexMessageSendMenu(source,headers);
    return;
  };
  
  // リマインダー
  if(remaindStartUpCheck(message)){
    reminderFlexMessageSendMenu(source,headers);
    return;
  }
  
  //
  if(remaidMessageRegister(message,source)){
    sendReplyMessage(reply_token,'登録完了だわん！');
    return
  }
  
  
  
  // 天気
  if (message.match(/天気/)){
    if (message.match(/東京/)){
      resMessage = rainyAndTemperatureForecastWeek("tokyo");
    } else if (message.match(/神奈川/)) {
      resMessage = rainyAndTemperatureForecastWeek("kanagawaEast");
    } else if (message.match(/埼玉/)) {
      resMessage = rainyAndTemperatureForecastWeek("saitama");
    } else if (message.match(/栃木/)) {
      resMessage = rainyAndTemperatureForecastWeek("tochigi");
    } else if (message.match(/群馬/)) {
      resMessage =  rainyAndTemperatureForecastWeek("gunma");
    } else if (message.match(/茨城/)) {
      resMessage =  rainyAndTemperatureForecastWeek("ibaraki");
    } else if (message.match(/千葉/)) {
      resMessage =  rainyAndTemperatureForecastWeek("chiba");
    } else if (message.match(/静岡/)) {
      resMessage =  rainyAndTemperatureForecastWeek("shizuoka");
    } else if (message.match(/三重/)) {
      resMessage = rainyAndTemperatureForecastWeek("mie");
    } else if (message.match(/愛知/)) {
      resMessage =  rainyAndTemperatureForecastWeek("aichi");
    } else if (message.match(/岐阜/)) {
      resMessage =  rainyAndTemperatureForecastWeek("gifu");
    }else {
      resMessage = "関東・東海地方の都道府県名を入力してほしいわん！"
    }
    
    // メッセージを返信    
    sendReplyMessage(reply_token,resMessage);
    return;
    
  }
  
  // タイマー機能
  if (message.match(/タイマー/)){
    timerResponse(message,source,reply_token)
    return;
  }
  
  // 映画
  if (message == "映画"){
    createMovieCarousel(source,headers);
    return;
  };
  
  // デート予定を確認
  if (message == "デート予定を確認"){
    ScheduleCheckFlexMessage(source,headers);
    return;
  }
  
  // スケジュール削除
  if (message == "デート予定を削除"){
    DeleteMessageSend(source,headers);
    return;
  };
  
  // スケジュール削除
  if (message == "デート候補"){
    RestaurantMessageSend(source,headers);
    return;
  };
  
  // お店を確認
  if (message == ("レストラン")){
    createRestaurantCarousel(source,headers)
    return;
  }
  
  // 食べログのURLから情報を取得し保存
  if (message == ("不満がある٩(๑`^´๑)۶")){
    resMessage = "やっぱりそうだったわんね・・・薄々気づいていたわん・・・\n早く不満をぶちまけてスッキリするわん！"
  }

  
  // 食べログのURLから情報を取得し保存
  if (message.indexOf("https://tabelog.com/") == 0.0){
    if(writeSheetRestaurant(message) === 0){
      resMessage = "お店情報を記憶したわん！"
    }else{
      resMessage = "情報の取得に失敗したわん・・・\nお店TOPページのURLで、やり直してほしいわん!"
    };
  }
  
  // 食べログスマホのURLから情報を取得し保存
  if (message.indexOf("https://s.tabelog.com/") == 0.0){
    if(writeSheetRestaurant(message) === 0){
      resMessage = "お店情報を記憶したわん！"
    }else{
      resMessage = "情報の取得に失敗したわん・・・\nお店TOPページのURLで、やり直してほしいわん!"
    };
  }
  
  // ozmallスマホのURLから情報を取得し保存
  if (message.indexOf("https://spn.ozmall.co.jp/restaurant/") == 0.0){
    if(writeSheetRestaurant(message) === 0){
      resMessage = "お店情報を記憶したわん！"
    }else{
      resMessage = "情報の取得に失敗したわん・・・\nお店TOPページのURLで、やり直してほしいわん!"
    };
  }
  
  // ozmallのURLから情報を取得し保存
  if (message.indexOf("https://www.ozmall.co.jp/restaurant/") == 0.0){
    if(writeSheetRestaurant(message) === 0){
      resMessage = "お店情報を記憶したわん！"
      
    }else{
      resMessage = "情報の取得に失敗したわん・・・\nお店TOPページのURLで、やり直してほしいわん!"
    };
  }
  
  // お店を削除
  if (message.indexOf("[お店削除]") == 0.0){
    if(deleteSheetRestaurant(message.slice(6,message.length)) == 0){
      resMessage = "お店情報を削除したわん！"
    }else{
      resMessage = "削除に失敗したわん・・・"
    };
  }
  
  // 削除
  if (message.indexOf("[削除]") == 0.0){
    if (dbValueGet('delete_flg') == '1'){
      var id = message.slice(4,message.length)
      var delEvent = CalendarApp.getEventById(id);
      delEvent.deleteEvent();
      resMessage = "スケジュールを削除したよ！"
      dbValueSet('delete_flg','0');
    }else{
      resMessage = "連続削除はできないよ～";
    }
    
  };  
  
  if(message == '怒ってる٩(๑`^´๑)۶'){
    resMessage = "え！？どうして！？そろそろ許してあげてほしいわん。。\uDBC0\uDC5E"
  };
  
  // メッセージを返信    
  sendReplyMessage(reply_token,resMessage);
  
  //大場転送
  var tensoMessage = username +"からメッセージが届いたよ！\n【"+ message +"】"
  sendPushMessage(USER_ID,tensoMessage);
  
  sheetWrite(message,'ResTime');
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  
}

//現在時間取得
function getNow(){
  var d = new Date();
  var y = d.getFullYear();
  var mon = d.getMonth() + 1;
  var d2 = d.getDate();
  var h = d.getHours();
  var min = d.getMinutes();
  var s = d.getSeconds();
  var now = y+"/"+mon+"/"+d2+" "+h+":"+min+":"+s;
  return now;
}

//スプレッドシート最終行に書き込み
function sheetWrite(message,sheetName){
  var spreadsheet = SpreadsheetApp.openById(RESTAURANT_SHEET_ID);
  var sheet = spreadsheet.getSheetByName(sheetName);
  sheet.appendRow([getNow(),message]);
}

// おくすり
function pillDrinkTimeJudge(message){
  const nowDate = new Date();
  const Hours = nowDate.getHours();
  
  if(message == '飲んだよ！'){
    dbValueSet('pill_drinked_flg',1);
    if(8 <= Hours && Hours <=9 ){
      return "10時迄に返答するとは偉いわん！凄いわん！LINEを大場さんへ転送するわん！\uDBC0\uDC5E"
    }else{
      return "ちゃんと忘れずに飲んだんだね！ちょっと不安だったわん！LINEを転送するわん！\uDBC0\uDC5E"
    }
    
  }
  
  if(message == "飲んでない・・・"){
    dbValueSet('pill_drinked_flg',1);
    dbValueSet('forget_flg',1);
    return "飲み忘れちゃった？！飲み始め１週間経過していれば、飲まなければならなかった時間から12時間以内に飲めば効果は継続するらしいよ！\uDBC0\uDC5E"
  }
  return "LINEを転送したわん\uDBC0\uDC5E"
}


// 帰宅
function getHomeTimeJudge(message){
  var timeZone = "America/New_York"
  var nowDate = new Date();
  var Hours = nowDate.getHours();
  
  //0~9の乱数を作る
  var random = Math.floor( Math.random() * 10 ) 
  
  // 帰宅中
  if(message == '帰宅中'){
     dbValueSet('get_home_res_flg', 1)
    return "お疲れ様！気をつけて帰るんだよ！\uDBC0\uDC5E"
  };
 
  // 着いてないなら即抜ける、帰宅フラグはたてない
  if (message == '着いてない・・・'){
    if(22 <= Hours && Hours <=24 ){
      return "そろそろ帰り始めよう！はやくお家に着かないと明日が大変だよ！!\uDBC0\uDC5E"
    }
    if(0 <= Hours && Hours <=4 ){
      return "えええぇぇ、もうずいぶん遅くなってるよ。明日は早く帰るよう頑張るわん！\uDBC0\uDC5E"
    }
    if(4 <= Hours && Hours <=8 ){
      return "やばいわん。不良になってしまったわん。。。\uDBC0\uDC5E"
    }
    
  }
  
  //
  if (message == ("ジムに行ってから帰る!(ง'ω')ง")){
    dbValueSet('get_home_res_flg', 1)
    dbValueSet('gym_count',dbValueGet('gym_count')+1)
    
    return "本日で"+dbValueGet('gym_count')+"回目のジム！仕上がってる！仕上がってるよ・・・！！\uDBC0\uDC5E"
  }
  
  
  //　帰宅系メッセージなら帰宅フラグを立てる
  if(message == '着いたよ！' || message == "帰宅してるよ٩( 'ω' )و"){
    dbValueSet('get_home_res_flg', 1)
    
    if(18 <= Hours && Hours <21 ){
      return "お帰り〜！僕より早いなんて・・・疾きこと風の如くってやつわん？\uDBC0\uDC5E"
    }
    
    if(21 <= Hours && Hours <22 ){
      return "おかえり！22時前に帰宅するなんて・・・いい子、いい子だわん！\uDBC0\uDC5E"
    }
    
    if(22 <= Hours && Hours <=23 ){
      return "おかえり！明日はもっと早くお家に帰ってきてね！\uDBC0\uDC5E"
    }
    
    if(0 <= Hours && Hours <4 ){
      return "おかえり〜。もしかして、僕のLINEを忘れてたわん？\uDBC0\uDC5E"
    }
    
    if(4 <= Hours && Hours <=8 ){
      return "むにゃむにゃおかえりー。すごーく返信が遅いわん。なにかあったわん？\uDBC0\uDC5E"
    }
  }
  return "LINEを転送したわん\uDBC0\uDC5E"
}


function hogegheo(){
  var nowDate = new Date();
  var Hours = nowDate.getHours();
  Logger.log(Hours)
  Logger.log(18 <= Hours && Hours <=21 )
  Logger.log(21 <= Hours && Hours <=22)
}

//Googleカレンダーに登録します
function scheduleSet(dateTime){
  var calendar = CalendarApp.getDefaultCalendar();
  var title = '[デート]';
  var startTime = new Date(dateTime);
  var endTime = new Date(dateTime);
  endTime.setHours(endTime.getHours() + 1);
  var option = {
    description: '', //メモ
    location: '' //場所
  }
  calendar.createEvent(title, startTime, endTime, option);
}