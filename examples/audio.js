const player = require('play-sound')();
player.play('/home/RPi/alarm.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
});
