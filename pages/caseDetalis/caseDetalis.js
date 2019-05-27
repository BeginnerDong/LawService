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


	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		if(options.id){
			self.data.id=options.id
		}
		self.getMainData()  
		
	},




	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id:self.data.id
		};
		postData.getAfter = {
			lawyer:{
				tableName:'Article',
				middleKey:'lawyer',
				key:'id',
				searchItem:{
					status:1
				},
				condition:'='
			},
			log:{
				tableName:'OrderLog',
				middleKey:'order_no',
				key:'order_no ',
				searchItem:{
					status:1
				},
				condition:'='
			}
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData=res.info.data[0];
					self.data.mainData.lawyer[0].keywords = self.data.mainData.lawyer[0].keywords.split(',');	
					for (var i = 0; i < self.data.mainData.log.length; i++) {
						self.data.mainData.log[i].content = api.wxParseReturn(res.info.data[0].log[i].content).nodes;
					}
				}
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







	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})
