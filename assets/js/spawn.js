function Spawn(con,vec2,side){
	if(con !== undefined){
		game.add(new con({position:vec2,owner:side}));
	}
};