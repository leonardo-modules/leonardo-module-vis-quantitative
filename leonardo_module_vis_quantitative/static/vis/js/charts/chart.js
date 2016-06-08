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
            pushOrReplaceData:"push",
            sliceData:true,
            sendTimestamps:false,
            timestampKey:"x"
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
          }else{
            console.log("Server returns invalid response on init, initing without data.");
          }
          self.init(config);
      }).fail(function(err){
          console.log("Server error on init, initing without data. Error: "+err);
          self.init(config);
      });
      // create update interval
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
                  console.log("Server error in update. Error: "+err);
              });
      }, config.updateInterval);
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
        var self=this, chart = self.instances[chartSelector], updateParams={method: "get_update_data"};
        if(chart.config.sendTimestamps && typeof chart.config.timestampKey === 'string'){
          if(chart.data.length>0){
            updateParams.last_timestamp = chart.data[0].values[chart.data[0].values.length-1][chart.config.timestampKey];
            updateParams.expected_timestamp = updateParams.last_timestamp + chart.config.updateInterval/1000;
          }else{
            console.log("Cannot send timestamps with update request, actual data is empty!");
          }
        }
        return $.ajax({
            type: 'POST',
            data: $.extend({},self.instances[chartSelector].config.requestData,updateParams),
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
    },
};
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};
    leonardo.charts.initChart = function(chartType,chartInstance){
      if(typeof leonardo.charts[chartType] ==='object' && leonardo.charts[chartType].hasOwnProperty("instances")){
        var actualInstances = leonardo.charts[chartType].instances;
        leonardo.charts[chartType] = chartInstance;
        $.extend(leonardo.charts[chartType].instances,actualInstances);
      }else{
          leonardo.charts[chartType] = chartInstance;
      }
    };
    leonardo.charts.createChart = function(chartName,config){
      if(typeof leonardo.charts[chartName] === 'object' && typeof leonardo.charts[chartName].create === 'function'){
        leonardo.charts[chartName].create(config);
      }else{
        console.log("Cannot create chart, chart with name "+chartName+" not exists!");
      }
    };
    leonardo.charts.removeChart = function(chart,outerChartSelector,innerChartSelector){
      delete leonardo.charts[chart].instances[outerChartSelector];
      $(innerChartSelector).empty();
    };
    return leonardo;
}(leonardo || {});
