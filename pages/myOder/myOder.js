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
		num: 0,
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {
			pay_status:0
		},

	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		
		self.getMainData()  
		
	},

	onShow() {
		const self = this;
		
	},


	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.searchItem.type = 1;
		postData.searchItem.passage1 = 'user';
		postData.order = {
			create_time: 'desc'
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none');
				};
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast('网络故障', 'none')
			};

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.orderGet(postData, callback);
	},

	deleteOrder(e) {
		const self = this;
		const postData = {};
		postData.token = wx.getStorageSync('token');
		postData.searchItem = {};
		postData.searchItem.id = api.getDataSet(e, 'id');
		const callback = res => {
			api.dealRes(res);
			self.getMainData(true);
		};
		api.orderDelete(postData, callback);
	},



	pay(e) {
		const self = this;
		var index = api.getDataSet(e,'index');
		const postData = {
			tokenFuncName: 'getProjectToken',
			searchItem: {
				id: self.data.mainData[index].id,
			},
			score:self.data.mainData[index].price,
			/* wxPay: {
				price: self.data.mainData[index].price,
			}, */
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				if (res.info) {
					const payCallback = (payData) => {
						if (payData == 1) {
							self.getMainData(true);
						};
					};
					api.realPay(res.info, payCallback);
				}
			} else {
				api.showToast(res.msg, 'none')
				self.getMainData(true);
			}
		};
		api.pay(postData, callback);
	},



	menuClick: function(e) {
		const self = this;
		api.buttonCanClick(self);
		const num = e.currentTarget.dataset.num;
		self.changeSearch(num);
	},

	changeSearch(num) {
		const self = this;
		this.setData({
			num: num
		});
		self.data.searchItem = {}
		if (num == '0') {
			self.data.searchItem.pay_status = '0';
		} else if (num == '1') {
			self.data.searchItem.pay_status = '1';

		} else if (num == '2') {
			self.data.searchItem.pay_status = '1';
			self.data.searchItem.transport_status  = '2';
		} 
		self.setData({
			web_mainData: [],
		});
		self.getMainData(true);
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
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
