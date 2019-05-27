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
		submitData: {
			order_no: '',
			relation_id: '',
			score: '',
			keywords: '',
			mainImg: '',
			content: '',
			type:1
		},
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],

		stars: [1, 2, 3, 4, 5],
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		if (options.id) {
			self.data.id = options.id
		}
		self.getMainData()
		self.setData({
			web_stars: self.data.stars
		})
	},




	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: self.data.id
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no ',
				searchItem: {
					status: 1
				},
				condition: '=',
				info: ['headImgUrl', 'nickname']
			}
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData = res.info.data[0];
					self.data.submitData.order_no = self.data.mainData.order_no;
					self.data.submitData.relation_id = self.data.mainData.lawyer;
					self.data.submitData.keywords = self.data.mainData.user.nickname;
					self.data.submitData.description = self.data.mainData.user.headImgUrl;
				}
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.showToast(res.msg, 'none')
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.orderGet(postData, callback);
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

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass);
		console.log('self.data.submitData', self.data.submitData)
		if (pass) {
				const callback = (user, res) => {
					self.messageAdd();
				};
				api.getAuthSetting(callback);
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none')
		};
	},

	messageAdd() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		if (!wx.getStorageSync('info') || !wx.getStorageSync('info').headImgUrl) {
			postData.refreshToken = true;
		};
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		postData.saveAfter = [{
		  tableName:'OrderItem',
		  FuncName:'update',
		  searchItem:{
		    order_no:self.data.mainData.order_no
		  },
		  data:{
		    isremark:1,
		  }
		}]
		const callback = (data) => {

			if (data.solely_code == 100000) {

				api.showToast('评价成功', 'none')
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 1000);
			} else {
				api.buttonCanClick(self, true);
				api.showToast(data.msg, 'none', 1000)
			}

		};
		api.messageAdd(postData, callback);
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
