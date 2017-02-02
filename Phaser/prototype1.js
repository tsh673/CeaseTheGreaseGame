var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
var obstacles1;
var obstacles2;
var mummy;


function preload() {

     game.load.spritesheet('mummy', 'assets/metalslug_mummy37x45.png', 37, 45, 18);
	 game.load.image('obstacle', 'assets/obstacle.png');
}

function create(){
	
	mummy = game.add.sprite(10, windowHeight * 3 / 4, 'mummy');
	var walk = mummy.animations.add('walk');
	mummy.animations.play('walk', 30, true);
	
	obstacles1 = game.add.group();
	obstacles1.enableBody = true;
	obstacles1.physicsBodyType = Phaser.Physics.ARCADE;
	
	obstacles2 = game.add.group();
	obstacles2.enableBody = true;
	obstacles2.physicsBodyType = Phaser.Physics.ARCADE;
	
	for (var i = 0; i < 5; ++i){
		var c = obstacles1.create(game.world.randomX + 100, windowHeight/4, 'obstacle', game.rnd.integerInRange(0, 36));
		var w = c.animations.add('walk');
		c.animations.play('walk', 30, true);
		c.body.velocity.x = -100;
	}
	
	for (var i = 0; i < 5; ++i){
		var c = obstacles2.create(game.world.randomX + 100, windowHeight * 3 / 4, 'obstacle', game.rnd.integerInRange(0, 36));
		var w = c.animations.add('walk');
		c.animations.play('walk', 30, true);
		c.body.velocity.x = -100;
	}
	
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.enable([mummy, obstacles1, obstacles2]);
}

function update(){
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
		mummy.y = windowHeight/4;
	}
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
		mummy.y = windowHeight * 3 / 4;
	}
	
	game.physics.arcade.overlap(mummy, [obstacles1, obstacles2], hit, null, this);
}

function hit(){
	console.log('collision');
	game.paused = true;
}