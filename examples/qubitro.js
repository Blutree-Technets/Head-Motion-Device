var mqtt = require('mqtt')
const player = require('play-sound')();

var broker = 'mqtts://broker.qubitro.com'
var deviceId  = '5aa8a656-658b-416a-8c66-942700725c91'
var deviceToken  = 'wPErs71fmCiNn87Eo958-31FYOb4vhdaj2WAAqJa'

var e_roll;
var e_pitch;
var e_yaw;
var sdata;
var alarm = "Posture is Correct";

var options = {
  keepalive: 60,
  port: 8883,
  username: deviceId,
  password: deviceToken,
  clientId: deviceId,
  clean: false,
};

var client = mqtt.connect(broker, options);


var Thingy = require('../index');
require('console.table');
var enabled;

console.log('Reading Thingy Motion sensors!');

var Direction = Object.freeze([
    'UNDEFINED',
    'TAP_X_UP', 'TAP_X_DOWN',
    'TAP_Y_UP', 'TAP_Y_DOWN',
    'TAP_Z_UP', 'TAP_Z_DOWN'
]);

var Orientation = Object.freeze([
    'Portrait', 'Landscape', 'Reverse portrait', 'Reverse landscape'
]);

function onTapData(tap) {
    console.log('Tap data: Dir: %s (%d), Count: %d', 
                        Direction[tap.direction], tap.direction, tap.count);
}

function onOrientationData(orientation) {
    console.log('Orientation data: %s (%d)', Orientation[orientation], orientation);
}

function onQuaternionData(quaternion) {
    console.log('Quaternion data: w: %d, x: %d, y: %d, z: %d', 
        quaternion.w, quaternion.x, quaternion.y, quaternion.z);
}

function onStepCounterData(stepCounter) {
    console.log('Step Counter data: Steps: %d, Time[ms]: %d', 
        stepCounter.steps, stepCounter.time);
}

function onRawData(raw_data) {
    console.log('Raw data: Accelerometer: x %d, y %d, z %d', 
        raw_data.accelerometer.x, raw_data.accelerometer.y, raw_data.accelerometer.z);
    console.log('Raw data: Gyroscope: x %d, y %d, z %d', 
        raw_data.gyroscope.x, raw_data.gyroscope.y, raw_data.gyroscope.z);
    console.log('Raw data: Compass: x %d, y %d, z %d', 
        raw_data.compass.x, raw_data.compass.y, raw_data.compass.z);
}

function onEulerData(euler) {
  e_roll=euler.roll;
  e_pitch=euler.pitch;
  e_yaw=euler.yaw;
    console.log('Euler angles: roll %d, pitch %d, yaw %d', 
        e_roll, e_pitch, e_yaw);
  if(e_roll>25 || e_pitch>25 || e_roll<-25 || e_pitch<-25)
  {
    console.log("Correct Your Posture!!");
    alarm = "Posture is Incorrect!";
    player.play('/home/RPi/Head-Motion-Device/alarm1.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
});
   }  
   var data = {
     "Roll": e_roll,
     "Pitch":e_pitch,
     //"Posture":alarm
     }    
   var sdata = JSON.stringify(data);
   console.log(sdata);  
}

function onRotationData(rotation) {
    console.log('Rotation: matrix:');

    console.table(rotation);
}

function onHeadingData(heading) {
    console.log('Heading: %d', heading);
}

function onGravityData(gravity) {
    console.log('Gravity: x: %d, y %d, z %d', gravity.x, gravity.y, gravity.z);
}

function onButtonChange(state) {
    if (state == 'Pressed') {
        if (enabled) {
            enabled = false;
            this.tap_disable(function(error) {
                console.log('Tap sensor stopped! ' + ((error) ? error : ''));
            });
            this.orientation_disable(function(error) {
                console.log('Orientation sensor stopped! ' + ((error) ? error : ''));
            });
            this.quaternion_disable(function(error) {
                console.log('Quaternion sensor stopped! ' + ((error) ? error : ''));
            });
            this.stepCounter_disable(function(error) {
                console.log('Step Counter sensor stopped! ' + ((error) ? error : ''));
            });
            this.raw_disable(function(error) {
                console.log('Raw sensor stopped! ' + ((error) ? error : ''));
            });
            this.euler_disable(function(error) {
                console.log('Euler sensor stopped! ' + ((error) ? error : ''));
            });
            this.rotation_disable(function(error) {
                console.log('Rotation sensor stopped! ' + ((error) ? error : ''));
            });
            this.heading_disable(function(error) {
                console.log('Heading sensor stopped! ' + ((error) ? error : ''));
            });
            this.gravity_disable(function(error) {
                console.log('Gravity sensor stopped! ' + ((error) ? error : ''));
            });
        }
        else {
            enabled = true;
            this.tap_enable(function(error) {
                console.log('Tap sensor started! ' + ((error) ? error : ''));
            });
            this.orientation_enable(function(error) {
                console.log('Orientation sensor started! ' + ((error) ? error : ''));
            });
            this.quaternion_enable(function(error) {
                console.log('Quaternion sensor started! ' + ((error) ? error : ''));
            });
            this.stepCounter_enable(function(error) {
                console.log('Step Counter sensor started! ' + ((error) ? error : ''));
            });
            this.raw_enable(function(error) {
                console.log('Raw sensor started! ' + ((error) ? error : ''));
            });
            this.euler_enable(function(error) {
                console.log('Euler sensor started! ' + ((error) ? error : ''));
            });
            this.rotation_enable(function(error) {
                console.log('Rotation sensor started! ' + ((error) ? error : ''));
            });
            this.heading_enable(function(error) {
                console.log('Heading sensor started! ' + ((error) ? error : ''));
            });
            this.gravity_enable(function(error) {
                console.log('Gravity sensor started! ' + ((error) ? error : ''));
            });
        }
    }
}

function onDiscover(thingy) {
  console.log('Discovered: ' + thingy);

  thingy.on('disconnect', function() {
    console.log('Disconnected!');
  });

  thingy.connectAndSetUp(function(error) {
    console.log('Connected! ' + error ? error : '');

    thingy.on('tapNotif', onTapData);
    thingy.on('orientationNotif', onOrientationData);
    thingy.on('quaternionNotif', onQuaternionData);
    thingy.on('stepCounterNotif', onStepCounterData);
    thingy.on('rawNotif', onRawData);
    thingy.on('eulerNotif', onEulerData);
    thingy.on('rotationNotif', onRotationData);
    thingy.on('headingNotif', onHeadingData);
    thingy.on('gravityNotif', onGravityData);
    thingy.on('buttonNotif', onButtonChange);

    thingy.motion_processing_freq_set(5, function(error) {
        if (error) {
            console.log('Motion freq set configure failed! ' + error);
        }
    });    

    enabled = true;
    /*thingy.orientation_enable(function(error) {
        console.log('Orientation sensor started! ' + ((error) ? error : ''));
    });*/
    thingy.euler_enable(function(error) {
                console.log('Euler sensor started! ' + ((error) ? error : ''));
    });
    /*thingy.rotation_enable(function(error) {
        console.log('Rotation sensor started! ' + ((error) ? error : ''));
    });*/
    thingy.button_enable(function(error) {
        console.log('Button started! ' + ((error) ? error : ''));
    });
  });
}

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

Thingy.discover(onDiscover);
