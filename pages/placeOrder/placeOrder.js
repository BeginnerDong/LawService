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
		isFirstLoadAllStandard: ['getMainData'],
		mainData: [],
		price: 0,
		submitData: {
			name: '',
			description: ''
		}
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		if (options.id) {
			self.data.idArray = options.id
		};
		console.log(self.data.idArray);
		self.getMainData();
		self.setData({
			web_price: self.data.price
		})
	},

	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		console.log(self.data.submitData)
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			id: ['in', self.data.idArray]
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
			self.countPrice()
		};
		api.productGet(postData, callback)
	},

	countPrice() {
		const self = this;
		self.data.price = 0;
		for (var i = 0; i < self.data.mainData.length; i++) {
			self.data.price += parseFloat(self.data.mainData[i].price)
		}
		self.setData({
			web_price: self.data.price.toFixed(2)
		})
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.submitData);
		const callback = (user, res) => {
			if(pass){
				self.addOrder();
			}else{
				api.buttonCanClick(self,true);
				api.showToast('请补充信息','none')
			}	
		};
		api.getAuthSetting(callback);
	},


	addOrder() {
		const self = this;
		const orderList = [{
			product: [],
			type: 1
		}];
		for (var i = 0; i < self.data.mainData.length; i++) {
			orderList[0].product.push({
				id: self.data.mainData[i].id,
				count: 1
			}, );
		};
	if (!self.data.order_id) {
		const postData = {
			tokenFuncName: 'getProjectToken',
			orderList: orderList,
			data: {
				passage1: 'user',
				name: self.data.submitData.name,
				description: self.data.submitData.description
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
		wxPay: {
			price: self.data.price
		}
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



intoPathRedirect(e) {
	const self = this;
	api.pathTo(api.getDataSet(e, 'path'), 'redi');
},

intoPath(e) {
	const self = this;
	api.pathTo(api.getDataSet(e, 'path'), 'nav');
}
})
