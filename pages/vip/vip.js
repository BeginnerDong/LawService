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
		is_show: false,
		autoplay: false,
		duration: 1000,
		circular: true,
		vertical: false,
		interval: 3000,
	
		mainData: [],
		swiperIndex: 0,
		isFirstLoadAllStandard: ['getMainData']
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData()
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			type: 2
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].content = api.wxParseReturn(res.info.data[i].content).nodes;
				}
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.productGet(postData, callback);
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const callback = (user, res) => {
			self.addOrder();
		};
		api.getAuthSetting(callback);
	},


	addOrder() {
		const self = this;
		const orderList = [{
			product: [],
			type: 2
		}];

		orderList[0].product.push({
			id: self.data.mainData[self.data.swiperIndex].id,
			count: 1
		}, );
		if (!self.data.order_id) {
			const postData = {
				tokenFuncName: 'getProjectToken',
				orderList: orderList,
				data:{
					isNew:'true',
					level:self.data.mainData[self.data.swiperIndex].level,
				}
			};
			console.log('addOrder', self.data.addressData)

			const callback = (res) => {
				if (res && res.solely_code == 100000) {
					self.data.order_id = res.info.id
					self.pay(self.data.order_id);
				};
			};
			api.addOrder(postData, callback);
		} else {
			self.pay(self.data.order_id)
		}
	},




	pay() {
		const self = this;
		var order_id = self.data.order_id;
		const postData = {
			tokenFuncName: 'getProjectToken',
			searchItem: {
				id: order_id,
			},
			score:self.data.mainData[self.data.swiperIndex].price
			/* wxPay: {
				price: self.data.mainData[self.data.swiperIndex].price
			} */
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				if (res.info) {
					const payCallback = (payData) => {
						if (payData == 1) {
							setTimeout(function() {
								api.pathTo('/pages/user/user', 'redi');
							}, 800)
						};
					};
					api.realPay(res.info, payCallback);
				}
			} else {
				api.showToast('支付失败', 'none')
			}
		};
		api.pay(postData, callback);
	},

	bindchange(e) {
		const self = this;
		self.data.swiperIndex = e.detail.current;
		self.setData({
			swiperIndex: self.data.swiperIndex,
			web_mainData: self.data.mainData,
		});
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
