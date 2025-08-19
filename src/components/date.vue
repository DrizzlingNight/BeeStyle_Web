<template>

</template>

<script>
export default {
  name: "date",
  mounted() {
    // 显示时间1s1s的显示
    let that = this
    this.timer = setInterval(function () {
      that.nowtime = new Date().toLocaleString()
    })
  },
  methods:{
    FormateTime(){
      var date=new Date();
      var year = this.formateTime(date.getFullYear())
      var month = this.formateTime(date.getMonth() + 1)
      var day = this.formateTime(date.getDate())
      var hour = this.formateTime(date.getHours())
      var minute = this.formateTime(date.getMinutes())
      var second = this.formateTime(date.getSeconds())
      var weekday = date.getDay();
      var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
      var week = weeks[weekday];
      return year+'-'+month+'-'+day+'  '+week+'  '+hour+":"+minute+":"+second
    },
    formateTime(n){
      if(n<10){
        return '0'+n
      }else{
        return n
      }
    },
  },
  // 销毁定时器
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
}
</script>

<style scoped>

</style>