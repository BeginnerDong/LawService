//logs.js
import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();
Page({
	data: {
		positionData: [],
		submitData: {
			content: '',
			description: '',
			keywords: '',
			phone: '',
			type:2
		},


		isFirstLoadAllStandard: ['getPositonData'],
	},



	onLoad() {
		const self = this;

		api.commonInit(self);

		self.getPositonData();

		

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

	PositionChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.description  = e.detail.value;

		self.setData({
			web_index: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	


	formIdAdd(e) {
		api.WxFormIdAdd(e.detail.formId, (new Date()).getTime() / 1000 + 7 * 86400);
	},

	getPositonData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.solely_thirdapp_id
		};
		postData.getBefore = {
			partner: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['咨询类型']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		}
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.positionData.push.apply(self.data.positionData, res.info.data)
			};
			
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getPositonData', self);
			self.setData({
				web_positionData: self.data.positionData,
			});
		};
		api.labelGet(postData, callback);
	},


	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass);
		console.log('self.data.submitData',self.data.submitData)
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true)
				api.showToast('手机格式不正确', 'none')

			} else {
				
				const callback = (user, res) => {
					self.messageAdd();
				};
				api.getAuthSetting(callback);
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none')
		};
	},

	

	formIdAdd(e) {
		api.WxFormIdAdd(e.detail.formId, (new Date()).getTime() / 1000 + 7 * 86400);
	},

	
	messageAdd() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		if(!wx.getStorageSync('info')||!wx.getStorageSync('info').headImgUrl){
		  postData.refreshToken = true;
		};
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		postData.data.behavior = 1;
		
		const callback = (data) => {
			
			if (data.solely_code == 100000) {
				
				api.showToast('发布成功', 'none')
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
	
	
	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
	


})
