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
      var chart = this;
      config = $.extend({},chart.initialConfig,config);
      chart.instances[config.chartSelector] = {config:config};
      chart.getData(config.chartSelector).done(function(res) {
          // test response validity
          if(chart.testResponse(res,config.dataKey)){
              chart.instances[config.chartSelector].data=(config.dataKey)?res[config.dataKey]:res;
              chart.init(config);
              setInterval(function(){
                  chart.updateData(config.chartSelector).done(function(res) {
                      if(chart.testResponse(res,config.dataKey)){
                          if(config.pushOrReplaceData == "push"){
                            chart.pushData(config.chartSelector,(config.dataKey)?res[config.dataKey]:res);
                          }else{
                            chart.instances[config.chartSelector].data=(config.dataKey)?res[config.dataKey]:res;
                          }
                          chart.render(config.chartSelector);
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
        var chart= this;
        return $.ajax({
            type: 'POST',
            data: chart.instances[chartSelector].config.requestData,
            url: chart.instances[chartSelector].config.url,
            datatype: 'json'
        });
    },
    updateData: function(chartSelector,pushData) {
        var chart=this;
        return $.ajax({
            type: 'POST',
            data: $.extend({},chart.instances[chartSelector].config.requestData,{method: "get_update_data"}),
            url: chart.instances[chartSelector].config.url,
            datatype: 'json'
        });
    },
    pushData: function(chartSelector,newData){
      var chart=this;
      $.each(chart.instances[chartSelector].data,function(index,datum){
        if(datum && datum.hasOwnProperty("key")){
          var founded=false;
          $.each(newData,function(index2,newDatum){
            if(datum.key === newDatum.key){
              Array.prototype.push.apply(datum.values, newDatum.values);
              if(chart.instances[chartSelector].config.sliceData){
                datum.values=datum.values.slice(newDatum.values.length);
              }
              founded=true;
            }
          });
          if(!founded){
            chart.instances[chartSelector].data = chart.instances[chartSelector].data.splice(newData);
          }
        }else{
          console.log("Pushed data "+index+" not have key or undefined!");
        }
      });
    },
    testResponse: function(response, dataKey){
      if(typeof response === 'object' && (!dataKey || response.hasOwnProperty(dataKey))){
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
