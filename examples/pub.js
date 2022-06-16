var mqtt = require('mqtt')

var broker = 'mqtts://broker.qubitro.com'
var deviceId  = '5aa8a656-658b-416a-8c66-942700725c91'
var deviceToken  = 'wPErs71fmCiNn87Eo958-31FYOb4vhdaj2WAAqJa'

var options = {
  keepalive: 60,
  port: 8883,
  username: deviceId,
  password: deviceToken,
  clientId: deviceId,
  clean: false,
};

var client = mqtt.connect(broker, options);

const data = {
  key: 30,
  key2: 35
}

var sdata = JSON.stringify(data)

client.on('connect', function() {
  console.log("Connected to Qubitro!");
  console.log("Publishing data... ")
    setInterval(
        function(){
            client.publish(deviceId, sdata,function(){
                console.log("Published ", sdata)
            });
        },
    2000)
});

client.on('error', function(err) {
    console.log(err);
});
