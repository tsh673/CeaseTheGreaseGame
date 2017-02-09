var windowWidth = 500;//window.innerWidth;
var windowHeight = 500;//window.innerHeight;

var game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
var obstacles1;
var obstacles2;
var player;
var score = 0;
var scoreLabel;
var frameCount = 0;


function preload() {

     game.load.image('player', 'assets/droplet.png');
	 game.load.image('obstacle', 'assets/oil.png');
}

function create(){
	game.stage.backgroundColor = '#71c5cf';
	scoreLabel = game.add.text(20, 20, "0");
	console.log(windowHeight / 4);
	
	
	player = game.add.sprite(10, windowHeight * 3 / 4, 'player');
	game.physics.arcade.enable(player);
	
	
	obstacles1 = game.add.group();
	game.physics.arcade.enable(obstacles1);
	var c = game.add.sprite(windowWidth, windowHeight/4, 'obstacle');
	game.physics.arcade.enable(c);
	c.body.velocity.x = -100;
	obstacles1.add(c);
	
	obstacles2 = game.add.group();
	game.physics.arcade.enable(obstacles2);
	c = game.add.sprite(windowWidth + 300, windowHeight * 3 / 4, 'obstacle');
	game.physics.arcade.enable(c);
	c.body.velocity.x = -100;
	obstacles2.add(c);
	
	var yAxis = windowHeight * 3 / 4;
	for (var i = 0; i < 10; ++i){
		if (game.rnd.integerInRange(0,1) === 0){
			yAxis = windowHeight * 3 / 4;
		}
		else yAxis = windowHeight/4;
		var c = game.add.sprite(obstacles1.getAt(i).x + game.rnd.integerInRange(100, 500), yAxis, 'obstacle');
		game.physics.arcade.enable(c);
		c.body.velocity.x = -100;
		obstacles1.add(c);
	}
	
}

function update(){
	
	if (player.body.y > windowHeight * 3 / 4){
		player.body.velocity.y = 0
	}
	
	if (player.body.y < windowHeight / 4){
		player.body.velocity.y = 0
	}
	
	console.log(player.body.y);
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
		player.body.velocity.y = -200;
	}
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
		player.body.velocity.y = 200;
	}
	
	game.physics.arcade.collide(player, [obstacles1, obstacles2], hit, null, this);
	frameCount++;
	if (frameCount % 60 === 0){
		score++;
		scoreLabel.text = score;
	}
}

function hit(){
	console.log('collision');
	game.paused = true;
}