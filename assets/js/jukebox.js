function Jukebox(){
	this.sounds = {};
}
Jukebox.prototype.loadSounds = function(sounds_src, callback) {
	var _this = this;
	this.sounds_src = sounds_src;

	this.soundsToLoad = Object.keys(this.sounds_src).length;

	if(this.soundsToLoad <= 0){
		callback();
		return;
	}

	for(var name in this.sounds_src){
		(function(name, callback){
			var audio = new Audio();
			$(audio).on("loadeddata", function(){
				if( --_this.soundsToLoad <= 0 )
					callback();
			});
			audio.src = _this.sounds_src[name];
			audio.volume = 1;

			_this.sounds[name] = audio;
		}(name, callback));
	}
};
Jukebox.prototype.togglePlay = function(name) {
	var sound = this.sounds[name];
	if(sound.paused){
		this.play(name);
	}
	else {
		this.stop(name);
	}
};
Jukebox.prototype.play = function(name) {
	var sound = this.sounds[name];
	sound.pause();
	sound.currentTime = 0;
	sound.play();
};
Jukebox.prototype.stop = function(name) {
	var sound = this.sounds[name];
	sound.pause();
	sound.currentTime = 0;
};
Jukebox.prototype.pause = function(name) {
	var sound = this.sounds[name];
	sound.pause();
};
Jukebox.prototype.unpause = function(name) {
	var sound = this.sounds[name];
	sound.play();
};
Jukebox.prototype.loop = function(name) {
	var sound = this.sounds[name];
	sound.loop = 'loop';
	sound.play();
};
Jukebox.prototype.unloop = function(name) {
	var sound = this.sounds[name];
	sound.removeAttribute( 'loop' );
	sound.stop();
};
