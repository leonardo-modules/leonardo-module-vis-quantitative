Function.prototype.inherits = function(parent) {
  this.prototype = Object.create(parent.prototype);
};
function Chart() {
    this.instances = {};
    this.initialConfig = {
            chartSelector: "",
            containerSelector: "",
            url:"",
            dataKey:"data",
            requestData:{},
            updateInterval: 2000,
            pushOrReplaceData:"replace",
            sliceData:true,
        };
}
Chart.prototype =  {
    create: function(config) {
      var self = this;
      config = $.extend({},self.initialConfig,config);
      self.instances[config.chartSelector] = {config:config};
      self.getData(config.chartSelector).done(function(res) {
          // test response validity
          if(self.testResponse(res,config.dataKey)){
              self.instances[config.chartSelector].data=(config.dataKey)?res[config.dataKey]:res;
              self.init(config);
              setInterval(function(){
                  self.updateData(config.chartSelector).done(function(res) {
                      if(self.testResponse(res,config.dataKey)){
                          if(config.pushOrReplaceData == "push"){
                            self.pushData(config.chartSelector,(config.dataKey)?res[config.dataKey]:res);
                          }else{
                            self.instances[config.chartSelector].data=(config.dataKey)?res[config.dataKey]:res;
                          }
                          self.render(config.chartSelector);
                      }
                  }).fail(function(err){
                      console.log("Server error in update "+err);
                  });
              }, config.updateInterval);
          }
      }).fail(function(err){
          console.log("Server error on init "+err);
      });
    },
    getData: function(chartSelector) {
        var self= this;
        return $.ajax({
            type: 'POST',
            data: self.instances[chartSelector].config.requestData,
            url: self.instances[chartSelector].config.url,
            datatype: 'json'
        });
    },
    updateData: function(chartSelector) {
        var self=this;
        return $.ajax({
            type: 'POST',
            data: $.extend({},self.instances[chartSelector].config.requestData,{method: "get_update_data"}),
            url: self.instances[chartSelector].config.url,
            datatype: 'json'
        });
    },
    pushData: function(chartSelector,newData){
      var self=this;
      $.each(self.instances[chartSelector].data,function(index,datum){
        if(datum && datum.hasOwnProperty("key")){
          var founded=false;
          $.each(newData,function(index2,newDatum){
            if(datum.key === newDatum.key){
              Array.prototype.push.apply(datum.values, newDatum.values);
              if(self.instances[chartSelector].config.sliceData){
                datum.values=datum.values.slice(newDatum.values.length);
              }
              founded=true;
            }
          });
          if(!founded){
            self.instances[chartSelector].data = self.instances[chartSelector].data.splice(newData);
          }
        }else{
          console.log("Pushed data "+index+" not have key or undefined!");
        }
      });
    },
    testResponse: function(response, dataKey){
      if(typeof response === 'object' && (!dataKey || response.hasOwnProperty(dataKey))){
        if(dataKey && (!response[dataKey] || response[dataKey] ==null)){
          return false;
        }
        return true;
      }else{
        console.log("Server response object is not valid, dataKey="+dataKey);
        return false;
      }
    },
    getChart: function(chartSelector){
      return this.instances[chartSelector];
    }
};
