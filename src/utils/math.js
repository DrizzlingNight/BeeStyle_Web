export function formatDecimal(num, decimal) {
  if (!num) {
    return '- -'
  } else {
    num = num.toString()
    let index = num.indexOf('.')
    if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
    } else {
      num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
  }
}
export function formatStrPrice(numStr, decimal) {
  if (!numStr) {
    return '- -'
  } else {
    // numStr = numStr.toLocaleString()
    let index = numStr.indexOf('.')
    if (index !== -1) {
      return numStr.substring(0, decimal + index + 1)
    } else {
      return numStr.substring(0)
    }
  }
}
export function numFormat(num){
  num = Number(num) || 0 // 2022.02.21 NFT詳情頁 價格顯示把多餘的小數點0去掉
  var res=num.toString().replace(/\d+/, function(n){ // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
      return $1+",";
    });
  })
  return res;
}

export function cutZero (old) {
  // 拷贝一份 返回去掉零的新串
  old = old.toString()
  let newstr = old
  // 循环变量 小数部分长度
  let leng = old.length - old.indexOf('.') - 1
  // 判断是否有效数
  if (old.indexOf('.') > -1) {
    // 循环小数部分
    for (let i = leng; i > 0; i--) {
      // 循环小数部分
      if (newstr.indexOf('.') > -1) {
        // 如果newstr末尾有0
        if (newstr.indexOf('0') && newstr.substr(-1, 1) === '0') {
          var k = newstr.lastIndexOf('0')
          // 如果小数点后只有一个0 去掉小数点
          if (newstr.charAt(k - 1) === '.') {
            return newstr.substring(0, k - 1)
          } else {
            // 否则 去掉一个0
            newstr = newstr.substring(0, k)
          }
        } else {
          // 如果末尾有0
          return newstr
        }
      }
    }
  }
  return old
}