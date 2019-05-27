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
	
  onLoad () {
    const self=this;
		api.commonInit(self);
		self.getMainData()
  },
	
	
	getMainData(){
	  const  self =this;
	  const postData={};
	  postData.searchItem = {
	    thirdapp_id:getApp().globalData.thirdapp_id
	  };
	  postData.getBefore = {
	    partner:{
	      tableName:'Label',
	      searchItem:{
	        title:['=',['服务']],
	      },
	      middleKey:'parentid',
	      key:'id',
	      condition:'in',
	    },
	  }
	  const callback =(res)=>{
	    if(res.info.data.length>0){
	      self.data.mainData.push.apply(self.data.mainData,res.info.data)
	    }
	    api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
	    self.setData({
	      web_mainData:self.data.mainData,
	    });
	  };
	  api.labelGet(postData,callback);
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
