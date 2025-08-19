let MyPlugin = {}
MyPlugin.install = function (Vue) {
    // 1. add global method or property
    Vue.myGlobalMethod = function () {
        // some logic ...
    }

    // 2. add a global asset
    // Vue.directive('my-directive', {
    //     bind (el, binding, vnode, oldVnode) {
    //         // some logic ...
    //     }
    //     ...
    // })

    // 3. inject some component options
    Vue.mixin({
        // created: function () {
        //     // some logic ...
        // }
        // ...
        methods:{
            toasterErr(code){
                if (!code) {
                    this.$toast.error(this.$t(`unknownErr`))
                    return
                }

                if(typeof code !== 'number') {
                    this.$toast.error(this.$t(code))
                } else {
                    let key = `errorCode.${code}`
                    let text = this.$t(key)
                    
                    if (text.localeCompare(key) !== 0) {
                        this.$toast.error(text)
                    } else {
                        this.$toast.error(this.$t(`systemErr`) + `(${code})`)
                    }
                }

            }
        }
    })

    // 4. add an instance method
    // Vue.prototype.$myMethod = function (methodOptions) {
    //     // some logic ...
    // }
}
export default MyPlugin
