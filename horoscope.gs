//占い結果生成
//仕様：http://jugemkey.jp/api/waf/api_free.php
function getHoroscopes() {
  
  try{

    const url = 'http://api.jugemkey.jp/api/horoscope/free/'
    var today = new Date();
    var toDate = Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy/MM/dd')
    
    var response = UrlFetchApp.fetch(url + toDate).getContentText("UTF-8");
    console.log(response)
    var json=JSON.parse(response);
    // 占いの内容
    var content=(json["horoscope"][toDate][5]["content"]);
    // 金運（5段階評価）
    var contentMoney=(json["horoscope"][toDate][5]["money"]);
    // 仕事運（5段階評価）
    var contentJob=(json["horoscope"][toDate][5]["job"]);
    // 恋愛運（5段階評価）
    var contentLove=(json["horoscope"][toDate][5]["love"]);
    // 総合運（5段階評価）
    var contentTotal=(json["horoscope"][toDate][5]["total"]);
    // ラッキーアイテム
    var contentItem=(json["horoscope"][toDate][5]["item"]);
    // ラッキーカラー
    var contentColor=(json["horoscope"][toDate][5]["color"]);
    // ランキング
    var contentRank=(json["horoscope"][toDate][5]["rank"]);
    // 星座名
    var contentSign=(json["horoscope"][toDate][5]["sign"]);
    
    //表示用に変換
    const emojiMoney = "💰"
    const emojiJob = "📗"
    const emojiLove = "💖"
    const emojiTotal = "⭐"  
    var space = String.fromCharCode(3000);
    
    contentMoney = emojiConvert(contentMoney,emojiMoney);
    contentJob = emojiConvert(contentJob,emojiJob);
    contentLove = emojiConvert(contentLove,emojiLove);
    contentTotal = emojiConvert(contentTotal,emojiTotal);
    //contentRank = rankConvert(contentRank);
    
    return "■♍"+contentSign +"の運勢■\n"
    +"星座ランキング:"+contentRank + "位\n\n"
    +"金　運:"+contentMoney + "\n"
    +"仕事運:"+contentJob + "\n"
    +"恋愛運:"+contentLove + "\n"
    +"総合運:"+contentTotal + "\n"
    +"※運は5段階評価だよ\n"
    +"ラッキーアイテム:"+contentItem + "\n"
    +"ラッキーカラー:"+contentColor + "\n\n"
    +"【"+ content+"】" + "\n\n"
    + "今日も一日がんばるわん！\uDBC0\uDC5E"
  }catch(e){
    return "占い結果が取得出来なかったわん・・・\n"
    + "今日も一日がんばるわん！\uDBC0\uDC5E"
  }
}

//絵文字回数分に変換
function emojiConvert(count,emoji) {
  var resultStar ="";
  for (var i=0; i<count;i++){
    resultStar+=emoji
  }
  return resultStar
}

//絵文字回数分に変換
function rankConvert(rank) {
  rank = parseInt(rank).toString()
  var emojiArray = new Array ("0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣");
  var length = rank.length
  var returnRank = "";
  for (var i=0; i<length;i++){
    returnRank+=emojiArray[rank.charAt(i)]
  }
  
  return returnRank
}

//絵文字回数分に変換
function rankConver2t(rank) {
  Logger.log(rankConvert(12));
}