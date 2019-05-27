import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
	
		mainData:[],
		isFirstLoadAllStandard:['getMainData']
  },
	
  onLoad: function () {
    const self=this;
		api.commonInit(self);
		self.getMainData()
  },

	
	getMainData() {
		const self = this;		
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {};
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.searchItem.type = 2;
		postData.searchItem.pay_status = 1;
		const callback = (res) => {
			if (res.solely_code == 100000) {
				if (res.info.data.length > 0) {
					self.data.mainData=res.info.data[0]
				} 
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
	
	intoVip(e){
		const self = this;
		if(self.data.mainData.length==0){
			api.showToast('您还不是会员','none')
		}else{
			api.pathTo(api.getDataSet(e,'path'),'nav');
		}
	},
	
	intoPathRedirect(e){
	  const self = this;
	  api.pathTo(api.getDataSet(e,'path'),'redi');
	},
	intoPath(e){
	  const self = this;
	  api.pathTo(api.getDataSet(e,'path'),'nav');
	}
})
