import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

//index.js
//获取应用实例
//触摸开始的事件

Page({
	data: {
		size: 14, //宽度即文字大小
		marqueeW: 0,
		moveTimes: 8, //一屏内容滚动时间为8s
		allT: "0s",
		autoplay: true,
		duration: 1000,
		circular: true,
		vertical: false,
		interval: 3000,
		sliderData: [],
		currentData: 0,
		isFirstLoadAllStandard: ['getSliderData', 'getLabelData', 'getMainData','getArtData'],
		labelData: [],
		getBefore: {
			partner: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['热点资讯']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		},
		text:'加载更多'
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getSliderData();
		self.getLabelData();
		self.getMainData();
		self.getArtData()
	},

	
	getArtData(){
	  const  self =this;
	  const postData={};
	  postData.searchItem = {
	    thirdapp_id:getApp().globalData.thirdapp_id
	  };
	  postData.getBefore = {
	    partner:{
	      tableName:'Label',
	      searchItem:{
	        title:['=',['风险代理']],
	      },
	      middleKey:'menu_id',
	      key:'id',
	      condition:'in',
	    },
	  }
	  const callback =(res)=>{
	    if(res.info.data.length>0){
	      self.data.artData = res.info.data[0];
	    }
	    api.checkLoadAll(self.data.isFirstLoadAllStandard,'getArtData',self);
	    self.setData({
	      web_artData:self.data.artData,
	    });
	  };
	  api.articleGet(postData,callback);
	},
	
	getLabelData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id
		};
		postData.getBefore = {
			partner: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['服务']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		}
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.labelData.push.apply(self.data.labelData, res.info.data)
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLabelData', self);
			self.setData({
				web_labelData: self.data.labelData,
			});
		};
		api.labelGet(postData, callback);
	},


	getSliderData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			title: '首页轮播'
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.sliderData = res.info.data[0];
				self.data.text = self.data.sliderData.description

			}
			var screenW = wx.getSystemInfoSync().windowWidth; //获取屏幕宽度
			var contentW = self.data.text.length * self.data.size; //获取文本宽度（大概宽度）
			var allT = (contentW / screenW) * self.data.moveTimes; //文字很长时计算有几屏
			allT = allT < 8 ? 8 : allT; //不够一平-----最小滚动一平时间

			self.setData({
				marqueeW: -contentW + "px",
				allT: allT + "s",
				web_sliderData: self.data.sliderData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getSliderData', self);
		};
		api.labelGet(postData, callback);
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id
		};
		postData.getBefore = api.cloneForm(self.data.getBefore)
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data)
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].create_time = self.data.mainData[i].create_time.substring(0, 10);
				}
				self.data.text = '加载更多';
				self.setData({
					text:self.data.text
				});
			}else{
				self.isLoadAll = true;
				self.data.text = '没有更多了';
				self.setData({
					text:self.data.text
				});
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.articleGet(postData, callback);
	},


	//点击切换，滑块index赋值
	checkCurrent(e) {
		const self = this;
		if (self.data.currentData === e.currentTarget.dataset.current) {
			return false;
		} else {
			if (e.currentTarget.dataset.current == 0) {
				self.data.getBefore = {
					partner: {
						tableName: 'Label',
						searchItem: {
							title: ['=', ['热点资讯']],
						},
						middleKey: 'menu_id',
						key: 'id',
						condition: 'in',
					},
				}
			} else if (e.currentTarget.dataset.current == 1) {
				self.data.getBefore = {
					partner: {
						tableName: 'Label',
						searchItem: {
							title: ['=', ['企业动态']],
						},
						middleKey: 'menu_id',
						key: 'id',
						condition: 'in',
					},
				}
			}
			self.getMainData(true);
			self.setData({
				currentData: e.currentTarget.dataset.current
			});

		}
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.text = '加载中...';
			self.setData({
				text:self.data.text
			});
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},



	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	}

})
