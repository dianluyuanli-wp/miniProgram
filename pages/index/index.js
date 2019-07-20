//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loanParten: [
      { name: 'capital', value: '等额本金' }, 
      { name: 'interest', value: '等额本息', checked: true }
    ],
    detail: [],
    loanIn: 'interest',
    capital: 300,
    year: 30,
    allInterest: 0,
    interestRate: 4.9,
    getnum: () => 3,
  },

  primary:function() {
    let obj = '';
    if (this.data.loanIn === 'interest') {
      obj = this.fillInterest();  
    } else {
      obj = this.fillCapital();
    }
    this.setData(obj);
  },

  bindInput: function(e) {
    let target = {};
    let value = e.detail.value;
    let key = e.currentTarget.dataset.type;
    if (key === 'loanIn' && value !== this.data.loanIn) {
      target = Object.assign(target, value === 'interest' ? this.fillInterest() : this.fillCapital());
    }
    target[key] = value;
    this.setData(target);
  },

  getProps: function() {
    return {
      mounth: this.data.year * 12,
      mounthRate: this.data.interestRate / 1200,
      capital: this.data.capital * 10000
    }
  },

  computeOneMounth: function() {
    let { mounth, mounthRate, capital } = this.getProps();
    return (capital * mounthRate) * Math.pow((1 + mounthRate), mounth) / (Math.pow((1 + mounthRate), mounth) - 1);
  },

  treatNum: function(num) {
    return parseFloat(num).toFixed(2)
  },

  fillInterest: function() {
    let { mounth, mounthRate, capital } = this.getProps();
    let yuan = this.computeOneMounth();
    let allInterest = 0;
    let ans = new Array(mounth).fill('').map((item, index) => {
      let int = capital * mounthRate;
      capital = capital - yuan + int;
      allInterest += int;
      return {
        allSpendMounth: this.treatNum(yuan),
        interest: this.treatNum(int),
        cap: this.treatNum(yuan - int),
        remainCap: this.treatNum(capital)
      }
    })
    return {
      detail: ans,
      allInterest: (allInterest / 10000).toFixed(2)
    }
  },

  fillCapital: function() {
    let { mounth, mounthRate, capital } = this.getProps();
    let allInterest = 0;
    let singleCap = capital / mounth;
    let allCap = 0;
    let ans = new Array(mounth).fill('').map((item, index) => {
      let interest = (capital - allCap) * mounthRate;
      let allSpend = singleCap + interest;
      allCap += singleCap;
      allInterest += interest;
      return {
        allSpendMounth: this.treatNum(allSpend),
        interest: this.treatNum(interest),
        cap: this.treatNum(singleCap),
        remainCap: this.treatNum(capital - allCap)
      }
    })
    return {
      detail: ans,
      allInterest: parseFloat(allInterest / 10000).toFixed(2)
    }
  },

  onLoad: function() {
    this.setData(this.fillInterest());
  }
  // //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  // onLoad: function () {
  //   console.log('begin');
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})
