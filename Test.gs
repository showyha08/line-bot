function setValueOnce(){
  dbValueSet('girl_friend_id', '');
}

function datetimetest(){
  var datetimenow = new Date()
    console.log(toyyyyMMddHHmm(datetimenow))
    
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
    
    setTriggerFunction(toyyyyMMddHHmm(datetimenow),'reminder_push_main')

    
}

function processing_speed_check() {
  var start = new Date();
  createRestaurantCarousel(USER_ID,headers);
  var end = new Date();
  var span_sec = (end - start)/1000;
  Logger.log("処理時間は " + span_sec + " 秒でした" );
}


function andTest(){
  // 1 true 0 false
  // && truthy 右 falsy 左　
  var a = 1 && 0;
  Logger.log(a) //0
  
  a = 0 && 1;
  Logger.log(a) //0
  
  a = 1 && 1;
  Logger.log(a) //1
  
  a = 0 && 0;
  Logger.log(a) //0
  
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

function orTest(){
  // || truthy 左 falsy 右　
  var   a = 1 || 0;
  Logger.log(a) //1
  a = 0 || 1;
  Logger.log(a) //1
  a = 1 || 1;
  Logger.log(a) //1
  a = 0 || 0;
  Logger.log(a) //0
  
  if (1 || 0) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
  if (0 || 1) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
  if (1 || 1) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
  if (0 || 0) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
}

function ifTest(){
  //undefind は false
  var undef
  Logger.log(undef)
  if (undef) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
  //文字が入っていれば true
  var text = "text"
  Logger.log(text)
  if (text) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
  
  //ブランクはfalse
  var blank = ""
  Logger.log(blank)
  if (blank) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }  
  
}

function my(){
  // (3)モジュールを使う
  Logger.log(MYAPP.util.math.add(4,5));
  Logger.log(MYAPP.util.math.minus(4,5));
  Logger.log(MYAPP.util.math.multiply(4,5));
  Logger.log(MYAPP.util.math.divide(4,5));
}

// (1)名前空間の準備
var MYAPP = MYAPP || {
  util: {
    math: {}
  },
  data: {
    int: {}
  }
};

// (2)モジュールの定義
MYAPP.util.math = (function(){
  return {
    add: function(x, y){
      return x + y;
    },
    minus: function(x, y){
      // xよりyが大きい時は「x-y」を、そうでない場合は「y-x」を返します
      return x > y ? x - y : y - x;
    },
    multiply: function(x, y){
      return x * y;
    },
    divide: function(x, y){
      // yが0のとき「NaN(Not a number)」を返します
      return y !== 0 ? x / y : "NaN";
    }
  };
  // public API
  return {
    add: add,
    minus: minus,
    multiply: multiply,
    divide: divide
  };
}());

function kentest(){
  //Logger.log(rainyAndTemperatureForecast("yamanashi"))
  
  var resMessage ="aaa"
  Logger.log(resMessage)
  if (resMessage) {
    Logger.log(true)
  }else {
    Logger.log(false)
  }
}

/**
*/
function study(){
  // 配列に分割し配列の長さを求める事で何文字含まれているかわかる
  var counter = function(str,seq){
    return --str.split(seq).length;
  }
  Logger.log(counter("aaa","a"))
  
  // 同じ文字を繰り返す場合は長さ(n+1)の配列を作ってjoinする
  Logger.log(Array(5 + 1).join('★'))
  Logger.log("a".repeat(27))
  
  // nullとundefinedの違い　nullは返す値がない、undefinedは未定義
  var undefinedTest
  Logger.log(undefinedTest)
  Logger.log("xxx".match(/[aeiou]/gi))
  
}


var responseWord = (function(){
  //private
  var goHome = [
    {
      mean: 'rightnow', //いままさに
      word: '着いたよ！'
    },
    {
      mean: 'notyet',
      word: '着いてない・・・'
    },
    {
      mean: 'going',
      name: '帰宅中'
    },
    {
      mean: 'justnow', //ついさっき
      name: "帰宅してるよ٩( 'ω' )و"
    }
  ];
})

//_から始まる場合はprivateを指し示す事が多い
