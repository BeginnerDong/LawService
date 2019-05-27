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
		
		submitData: {
			content: '',
			title:'',
			type:3
		},
		buttonCanClick:true
	},



	onLoad() {
		const self = this;
		self.setData({
			web_buttonCanClick:self.data.buttonCanClick
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


	formIdAdd(e) {
		api.WxFormIdAdd(e.detail.formId, (new Date()).getTime() / 1000 + 7 * 86400);
	},



	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass);
		console.log('self.data.submitData',self.data.submitData)
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
		const callback = (data) => {	
			if (data.solely_code == 100000) {	
				api.showToast('提交成功', 'none')
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


})
