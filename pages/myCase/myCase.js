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
			pay_status: 1
		},

	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);

	

	},

	onShow(){
		const self = this;
		self.getMainData()
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
				api.showToast(res.msg, 'none')
			};

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.orderGet(postData, callback);
	},






	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	deleteOrder(e) {
		const self = this;
		wx.showModal({
			title: '删除确认',
			content: '确认是否删除此案件,删除后将无法恢复',
			confirmColor: '#00A1E9',
			showCancel: true,
			confirmText: '确定',
			success(res) {
				if (res.confirm) {
					const postData = {};
					postData.tokenFuncName = 'getProjectToken';
					postData.searchItem = {};
					postData.searchItem.id = api.getDataSet(e, 'id');
					const callback = res => {
						if(res.solely_code==100000){
							api.showToast('删除成功','none')
						}else{
							api.showToast(res.msg,'none')
						}
						self.getMainData(true);
					};
					api.orderDelete(postData, callback);
				} else if (res.cancel) {
					api.showToast('已取消', 'none');
				}
			}
		})
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
