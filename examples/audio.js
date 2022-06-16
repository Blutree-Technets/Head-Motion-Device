const player = require('play-sound')();
player.play('/home/RPi/Head-Motion-Device/alarm1.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
});
