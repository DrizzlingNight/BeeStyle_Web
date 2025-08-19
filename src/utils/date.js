export function countTime(d,h,m,s,endTime) {
    //获取当前时间
    var date = new Date()
    var now = date.getTime()
    //设置截止时间
    var endDate = new Date(endTime)
    var end = endDate.getTime()
    //时间差
    var leftTime = end - now
    //定义变量 d,h,m,s保存倒计时的时间
    if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24)//天数我没用到，暂且写上
        h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
        m = Math.floor((leftTime / 1000 / 60) % 60)
        s = Math.floor((leftTime / 1000) % 60)
        if (s < 10) {
            s = '0' + s
        }
        if (m < 10) {
            m = '0' + m
        }
        if (h < 10) {
            h = '0' + h
        }
        if (d < 10) {
            d = '0' + d
        }

    }
    //递归每秒调用countTime方法，显示动态时间效果
    setTimeout(this.countTime, 1000)
    return {s:s,m:m,h:h,d:d}
}

/**
 * 判断是否合法的日期格式，或者能否转化为合法日期
 * @param {number/string/Date} 日期，可以是时间戳、字符串或者Date实例
 * 注意：是字符串时，需要有合法的分隔符才行，没有分隔符不能解析。合法分隔符包括[-./]三种。
 * @param {Boolean} 是否合法日期
 */
 function isValidDate(date) {
    // console.log(date)
    //  为什么限制这么多，因为参数输入null、undefined、true、false也能被转换，但显然不对
    if (
      typeof date !== 'number' &&
      typeof date !== 'string' &&
      Object.prototype.toString.call(date).slice(8, -1) !== 'Date'
    ) {
      console.log(`Error: 输入的date的类型只能为number/string/Date类型`)
      return false
    }
    if (new Date(date).toString() === 'Invalid Date') {
      // 这里针对乱输入的字符串
      console.log(`Error: 输入的date的类型只能为number/string/Date类型`)
      return false
    }
    return true
  }

/**
 * 日期时间格式化
 * @param {number/string/Date} 日期，可以是时间戳、字符串或者Date实例
 * 注意：是字符串时，需要有合法的分隔符才行，没有分隔符不能解析。合法分隔符包括[-./]三种。
 * @param {string} 要返回的日期时间格式
 */
 export function dateFormat(date, pattern = 'yyyy-MM-dd hh:mm:ss') {
    if (!isValidDate(date)) {
      return `Error: 输入的date参数不合法`
    }
    //  对number/string/Date类型统一转为为Date类型
    date = new Date(date)
    function padZero(s, len) {
      len = len - `${s}`.length
      for (let i = 0; i < len; i++) {
        s = '0' + s
      }
      return s
    }
    return pattern.replace(/([yMdhsm])(\1*)/g, $0 => {
      switch ($0.charAt(0)) {
        case 'y':
          return padZero(date.getFullYear(), $0.length)
        case 'M':
          return padZero(date.getMonth() + 1, $0.length)
        case 'd':
          return padZero(date.getDate(), $0.length)
        case 'w':
          return date.getDay() + 1
        case 'h':
          return padZero(date.getHours(), $0.length)
        case 'm':
          return padZero(date.getMinutes(), $0.length)
        case 's':
          return padZero(date.getSeconds(), $0.length)
      }
    })
  }
  
