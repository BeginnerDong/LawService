import {
	Api
} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();



Page({
	data: {

		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		orderList: [{
			product: [],
			type: 2
		}],
		highData: [],
		pay:{}
	},


	onLoad(options) {
		const self = this;
		
		api.commonInit(self);
		
		self.getMainData()

	},



	getMainData() {
		const self = this;
		var now = Date.parse(new Date())/1000;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {};
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.searchItem.type = 2;
		postData.searchItem.pay_status = 1;
		postData.searchItem.invalid_time = ['>',now];
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData = res.info.data[0]
					self.data.mainData.products[0].snap_product.content = api.wxParseReturn(res.info.data[0].products[0].snap_product
						.content).nodes;
				}
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast('网络故障', 'none')
			};
			self.getHighData()
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.orderGet(postData, callback);
	},

	getHighData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
			type: 2,
			level: self.data.mainData.level + 1
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.highData = res.info.data[0]
				}
			}
		};
		api.productGet(postData, callback);
	},



	submit(e) {
		const self = this;
		api.buttonCanClick(self);
		var type = api.getDataSet(e, 'type');
		if(self.data.highData.length==0){
			api.buttonCanClick(self,true);
			api.showToast('您已是最高级别','none');
			return
		};
		if (type == 'shengji') {
			self.data.orderList[0].product.push({
				id: self.data.highData.id,
				count: 1
			},);
			self.data.pay = {
				score:parseFloat(self.data.highData.price - self.data.mainData.products[0].snap_product.price).toFixed(2),
				other:{
					price:self.data.mainData.products[0].snap_product.price
				},
			};
			self.data.level = self.data.mainData.level + 1;
			console.log('score',self.data.pay.score);

			api.buttonCanClick(self,true);
			wx.showModal({
				title: '升级确认',
				content: '你当前级别为'+self.data.mainData.products[0].snap_product.title+',升级为'+self.data.highData.title+'将补足差价'+self.data.pay.score+'元\r\n确认升级吗？'
				,
				confirmColor: '#00A1E9',
				showCancel: true,
				confirmText: '确定',
				success(res) {
					if (res.confirm) {
						const callback = (user, res) => {
							self.addOrder();
						};
						api.getAuthSetting(callback);
					} else if (res.cancel) {
						api.buttonCanClick(self,true);
						api.showToast('已取消', 'none');
					}
				}
			})
		}else if(type == 'xufei'){
			self.data.orderList[0].product.push({
				id: self.data.mainData.products[0].snap_product.id,
				count: 1
			},);
			self.data.pay = {
				score:parseFloat(self.data.mainData.products[0].snap_product.price).toFixed(2)
			};
			self.data.level = self.data.mainData.level;
		}
		
	},


	addOrder() {
		const self = this;
		if (!self.data.order_id) {
			const postData = {
				tokenFuncName: 'getProjectToken',
				orderList:self.data.orderList,
				data: {
					isNew: 'false'
				}
			};
			postData.data.level = self.data.level;
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
		const postData = self.data.pay;
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: order_id,
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('操作成功', 'none');
				setTimeout(function() {
					api.pathTo('/pages/user/user', 'redi');
				}, 800)
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
				api.buttonCanClick(self,true);
				api.showToast('支付失败', 'none')
			}
		};
		api.pay(postData, callback);
	},








	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})
