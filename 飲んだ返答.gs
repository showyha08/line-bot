//実行回数から文章を取得
//休薬開始は22にセット
function sentenceBranch() {
  var dp = PropertiesService.getScriptProperties();
  var exec_count = dp.getProperty('exec_count')
  var medicine_sentence = "";
  var forget_flg = dp.getProperty('forget_flg');
  console.log(exec_count)
  
  //服薬開始
  if (exec_count == 1.0) {
    medicine_sentence = "お薬【開始日】だよ！！\n僕がサポートするから3週間一緒に頑張るわん！\uDBC0\uDCB7";
    return medicine_sentence;
  }
  
  //服薬中飲み忘れ
  if (exec_count < 22 && forget_flg == 1.0) {
    medicine_sentence ="おやっ？？\nもしかして・・・\n昨日飲み忘れた・・・？\nもし忘れてたら2錠飲むわん！\uDBC0\uDCB7"
    dp.setProperty('forget_flg', '0');
    return medicine_sentence;
  }
  
  //服薬休薬前日
  if (exec_count == 21.0) {
    medicine_sentence += "お薬【最終日】だよ！\nシート最後のお薬は忘れずに飲んだかな？？\uDBC0\uDCB7";
    return medicine_sentence;
  }
  //服薬再開前日
  if (exec_count == 28.0) {
    medicine_sentence = "明日からお薬\uDBC0\uDCB7【再開】だよ！\n飲み忘れないよう予め準備しておくわん！";
    return medicine_sentence;
  }
  
  //休薬中
  if (exec_count > 21) {
    medicine_sentence = "ただいま【休薬期間中】だわん！";
  }
  
  return medicine_sentence;
}
