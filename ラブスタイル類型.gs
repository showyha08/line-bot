function loveCheck(userid,counter) {
  
  var quemsg = "";
  var one = "1";
  var two = "2";
  var three = "3";
  var four = "4";
  var five = "5";
  
  var Eros1="彼（彼女）と私は会うとすぐお互いに引かれあった"
  var Eros2="彼（彼女）と私はお互いに、本当に理解しあっている"
  var Eros3="彼（彼女）と私はお互いに結びついていると感じる"
  var Eros4="彼（彼女）と私は外見的に釣り合っている"
  var Mania1="彼（彼女）が私以外の異性と楽しそうにしていると気になって仕方がない"
  var Mania2="彼（彼女）が私を気にかけてくれない時、私はすっかり気がめいってしまう"
  var Mania3="私は気が付くと、いつも彼（彼女）のことを考えている"
  var Mania4="彼（彼女）は私だけのものであってほしい"
  var Agape1="彼（彼女）が苦しむくらいなら、私自身が苦しんだ方がましだ。"
  var Agape2="私自身の幸福よりも、彼（彼女）の幸福が優先しないと、私は幸福になれない"
  var Agape3="彼（彼女）の望みを叶えるためには、私自身の望みはいつでも喜んで犠牲にできる"
  var Agape4="私は彼（彼女）のためなら、死ぬことさえもいとわない"
  var Ludas1="交際相手から頼られすぎたりベタベタされるのは嫌である"
  var Ludas2="私は彼（彼女）にあれこれと干渉されるとその人と別れたくなる"
  var Ludas3="私が必要と感じた時だけ彼（彼女）にそばにいてほしいと思う"
  var Ludas4="私は彼（彼女）に対してどうかかわっているかについて、少し曖昧にしておこうと気をつけている"
  var Storge1="私がもっとも満足している恋愛関係は、よい友情から発展してきた"
  var Storge2="最良の愛は、長い友情の中から育つ"
  var Storge3="私は彼（彼女）との愛情を大切にしたい"
  var Storge4="長い友人付き合いを経て、彼（彼女）と恋人になった（なりたい）"
  var Pragma1="恋人を選ぶとき、その人は将来があるだろうかと考える"
  var Pragma2="恋人を選ぶときには、その人が私の経歴にどう影響するかも考える"
  var Pragma3="恋人を選ぶとき、その人の学歴や育ち（家柄）が私と釣り合っているかどうかを考える"
  var Pragma4="恋人を選ぶときには、その人に経済力があるかどうかを考える。"
  
  var array=[]
  array.push(Eros1)
  array.push(Eros2)
  array.push(Eros3)
  array.push(Eros4)
  array.push(Mania1)
  array.push(Mania2)
  array.push(Mania3)
  array.push(Mania4)
  array.push(Agape1)
  array.push(Agape2)
  array.push(Agape3)
  array.push(Agape4)
  array.push(Ludas1)
  array.push(Ludas2)
  array.push(Ludas3)
  array.push(Ludas4)
  array.push(Storge1)
  array.push(Storge2)
  array.push(Storge3)
  array.push(Storge4)
  array.push(Pragma1)
  array.push(Pragma2)
  array.push(Pragma3)
  array.push(Pragma4)
  
  if(counter <= array.length){
    
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
                  "text": array[counter],
                  "weight": "bold",
                  "size": "xs",
                  "wrap": true
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
                  "style": "secondary",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": one,
                    "text": one
                  }
                },
                {
                  "type": "button",
                  "style": "secondary",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": two,
                    "text": two
                  }
                },
                {
                  "type": "button",
                  "style": "secondary",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": three,
                    "text": three
                  }
                },
                {
                  "type": "button",
                  "style": "secondary",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": four,
                    "text": four
                  }
                },
                {
                  "type": "button",
                  "style": "secondary",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": five,
                    "text": five
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
  
  
}
