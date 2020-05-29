  // 大量に連続で設定されると無理
  // また、GASの実行時間制限を入れる必要がある
function timerResponse(message,source,reply_token) {
  
  try{
    
    var plusSecond = 0
    var plusMinute = 0
    var plusHours = 0
    var totalSecond = 0 
    var errorMessage
    var resMessage =  "タイマーを起動するわん！"
    
    var repeatFlg = 1
    
    if (~message.indexOf("秒")){
      plusSecond = parseInt(timeGet(message));
    } 
    if (~message.indexOf("分")){
      plusMinute = parseInt(timeGet(message));
    } 
    if (~message.indexOf("時間")){
      plusHours = parseInt(timeGet(message));  
    } 
    
    if (message.match(/リピート/)){
      repeatFlg = 2
    }
    
    // Finite有限値チェックValidatin
    // 秒数に変換しつつ累計 
    
    // 秒チェック
    if (isFinite(plusSecond) ){
      totalSecond += plusSecond 
    }else{
      errorMessage += "秒は半角数字で時間指定してほしいわん！"
    }
    
    // 分チェック
    if (isFinite(plusMinute) ){
      totalSecond += plusMinute * 60
    }else{
      errorMessage += "分は半角数字で時間指定してほしいわん！"
    }
    
    //　時チェック
    if (isFinite(plusHours)){
      totalSecond += plusHours * 60 * 60
    }else{
      errorMessage += "時は半角数字で時間指定してほしいわん！"
    }
    
    // 累計秒数チェック
    if(totalSecond > 1 * 60 * 60 ) errorMessage += "1時間を超えて設定できないわん・・・"
    if(totalSecond == 0 ) errorMessage += "0秒は指定出来ないわん・・・"
    
    if (errorMessage){
      sendReplyMessage(reply_token,errorMessage)
      return
    } else {
      sendReplyMessage(reply_token,resMessage)
    }
    
    resMessage = "タイマーの時間経過をお知らせするわん！"
    
    //リピート
    for (var count = 0; count < repeatFlg; count++ ) {
      Utilities.sleep(1000 * totalSecond);
      sendPushMessage(source,resMessage);
    }
    
  }catch(e){
    Console.log(e)
  }finally{
    return;
  }
  
  
}
