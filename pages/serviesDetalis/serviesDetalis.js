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
		mainData: [],
		productData:[],
		isFirstLoadAllStandard:['getProductData','getMainData'],
		price:0
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		if (options.id) {
			self.data.id = options.id
		}
		self.getMainData();
		self.setData({
			web_price:self.data.price
		})
	},


	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			id: self.data.id
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			};
			self.getProductData();
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.labelGet(postData, callback);
	},

	getProductData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			category_id: self.data.id
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.productData.push.apply(self.data.productData,res.info.data);
				for (var i = 0; i < self.data.productData.length; i++) {
					self.data.productData[i].select = false
				}
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getProductData', self);
			self.setData({
				web_productData: self.data.productData,
			});
		};
		api.productGet(postData, callback);
	},
	
	
	selectProduct(e){
		const self = this;
		var index =  api.getDataSet(e,'index');
		self.data.productData[index].select=!self.data.productData[index].select
		self.setData({
			web_productData:self.data.productData
		});
		console.log('self.data.productData',self.data.productData)
		self.countPrice()
	},
	
	countPrice(){
		const self = this;
		self.data.price = 0;
		for (var i = 0; i < self.data.productData.length; i++) {
			if(self.data.productData[i].select){
				self.data.price += parseFloat(self.data.productData[i].price)
			}
		}
		console.log('self.data.price',self.data.price)
		self.setData({
			web_price:self.data.price.toFixed(2)
		})
	},
	
	goBuy(){
		const self = this;
		var idArry= [];
		for (var i = 0; i < self.data.productData.length; i++) {
			if(self.data.productData[i].select){
				idArry.push(self.data.productData[i].id);			
			}
		}
		wx.navigateTo({
			url:'/pages/placeOrder/placeOrder?id='+idArry
		})
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
