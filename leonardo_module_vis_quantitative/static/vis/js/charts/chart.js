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
        };
}
Chart.prototype =  {
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
    }
};
