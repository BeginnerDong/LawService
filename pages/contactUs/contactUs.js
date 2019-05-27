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
		mainData: {
			phone: '',
			address: '',
			latitude: '',
			longitude: ''
		},


	},

	onLoad() {
		const self = this;
		self.data.mainData.phone = wx.getStorageSync('info').thirdApp.phone;
		self.data.mainData.address = wx.getStorageSync('info').thirdApp.address;
		self.data.mainData.latitude = wx.getStorageSync('info').thirdApp.latitude;
		self.data.mainData.longitude = wx.getStorageSync('info').thirdApp.longitude;
		console.log(self.data.mainData.address)
		self.setData({
			web_mainData: self.data.mainData,
		});
	},

	phoneCall() {
		const self = this;
		wx.makePhoneCall({
			phoneNumber: self.data.mainData.phone,
		})
	},
	
	intoMap: function() {
		const self = this;
		wx.getLocation({
			type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			success: function(res) { //因为这里得到的是你当前位置的经纬度
				var latitude = res.latitude
				var longitude = res.longitude
				wx.openLocation({ //所以这里会显示你当前的位置
					// longitude: 109.045249,
					// latitude: 34.325841,
					longitude: parseFloat(self.data.mainData.longitude),
					latitude: parseFloat(self.data.mainData.latitude),
					name: "百舌鸟法律咨询",
					address: self.data.mainData.address,
					scale: 28
				})
			}
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
