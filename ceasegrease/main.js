// Property of Texas A&M Cease the Grease CSCE 482 Taylor Harris, Victor Martinez, Chance Eckert 

var mainMusic;

var mainState = {
    preload: function() 
	{          
		game.load.spritesheet('droplet', 'assets/droppp.png', 37, 62); // Load droplet animation frames	
		game.load.image('background', 'assets/background7.png'); // Load background image
		game.load.image('oil', 'assets/oil.png'); // Load oil image
		game.load.image('pausemenu', 'assets/pausemenu.png'); // Load pause menu image
		game.load.audio('main', ['assets/main_music.mp3', 'assets/main_music.ogg']); // Load main game music
    },

    create: function() 
	{   
		game.stage.backgroundColor = 'rgb(154,129,83)'; //Background color to match image
		
		backgroundPipe = game.add.sprite(0, 45, 'background'); // Add background image
	
		this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);this.enter.onDown.add(function() { // When enter key is pressed, game is paused
			
			game.paused = true; // Pause game 

			pauseMenu = game.add.sprite(400/2, 490/2, 'pausemenu'); // Add pause menu options image
			pauseMenu.anchor.setTo(0.5, 0.5);
		}, this);

		game.input.onDown.add(unpause, self); // Input listener to unpause game when user clicks outside of the menu options
		game.input.onDown.add(this.jump, this); //Input listener to move drippy with mouse click/tap (on mobile)
		
		function unpause(event) // Unpause game
		{
			if(game.paused) // If game is paused, find out where the click occured
			{
				var x1 = 400/2 - 270/2, x2 = 400/2 + 270/2,
					y1 = 490/2 - 180/2, y2 = 490/2 + 180/2; // Calculate the corners of the menu

				if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ) // Check if the click was inside the menu
				{
					var x = event.x - x1,
						y = event.y - y1; // Get menu local coordinates for the click
 
					var selection = Math.floor(x / 90) + 3 * Math.floor(y / 90); // Calculate the choice
					
					if(selection == 0 || selection == 1 || selection == 2) // Display the choice
					{
						pauseMenu.destroy(); // Remove pause menu image
						game.paused = false; // Unpause the game
					}	 
					else
					{
						game.paused = false; // Unpause the game
						game.state.start('menu'); // Go to main menu
					}		
				}
			}
		};
		
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.droplet = game.add.sprite(100, 245, 'droplet'); // Add droplet sprite at 50,175
		this.droplet.frame = 0; // Default frame is the first frame at position 0
		
		this.droplet.animations.add('jet', [0,1,2], 2, true); // Animate the droplet
		
		this.droplet.animations.play('jet'); // Play droplet animation
		
		game.physics.arcade.enable(this.droplet); // Add physics to droplet
		
		this.droplet.body.gravity.y = 1000; // Makes droplet fall 

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); // Jump when spacebar is pressed
		spaceKey.onDown.add(this.jump, this);
		
		var mouseClick = game.input;
		
		
		this.oils = game.add.group(); 
		
		this.timer = game.time.events.loop(1500, this.addRowOfOils, this); 
  
		score = 0;	// Score initialized to zero and displayed at the top left corner of the screen
		scoreLabel = game.add.text(20, 20, "0");   
		scoreLabel.font = "Press Start 2P";
		scoreLabel.fill = "#fff"; // White color
		scoreLabel.fontSize = 30;
		
		mainMusic = game.add.audio('main'); // Music
		mainMusic.play();
	},

    update: function() // This function is called 60 times per second
	{
        if (this.droplet.y < 0 ) //resets drippy's upper bound to 0
        {
            this.droplet.y = 0;
        }
        else if (this.droplet.y > 490)
		{
//            this.droplet.y = 490; //resets drippy's lower bound to max
			mainMusic.stop();
			game.state.start('over'); // If the droplet is out of the screen, end the game
		}
		
		game.physics.arcade.collide(this.droplet, this.oils, this.endGame, null, this); // If the droplet and oil overlap, end the game
    },
	
	jump: function() // Make the droplet jump 
	{ 
		this.droplet.body.velocity.y = -350; // Add a vertical velocity to the droplet
	},

	endGame: function() // End the game
	{
		mainMusic.stop();
		game.state.start('over');
	},
	
	addOneOil: function(x, y) //need to speed up oil spawn or increase oils on screen
	{
		var oil = game.add.sprite(x, y, 'oil'); // Display oil at x, y

		this.oils.add(oil);

		game.physics.arcade.enable(oil);
		
		oil.body.velocity.x = -200 - (5*score); // Add velocity to the oil spill to make it move left

		oil.checkWorldBounds = true;
		oil.outOfBoundsKill = true; // Kill the oil when its out of bounds
	},
	
	addRowOfOils: function() 
	{
		var hole = Math.floor(Math.random() * 8) + 0; // Randomly choose a # between 0-7 for the hole position
//0-8 should cover full y value of bound
		for (var i = 0; i < 8; i++)
			if (i == hole) 
				this.addOneOil(400, i * 60 + 10);
<<<<<<< Updated upstream
				
		score += 1;
		scoreLabel.text = score;  
=======
        score += 1;
		labelScore.text = score;
>>>>>>> Stashed changes
	},
};

var gameOverState = {

	preload: function() 
	{   
		game.load.image('gameover', 'assets/gameover.png'); // Load game over image
		game.load.image('dead', 'assets/dead.png') // Load dead droplet image
	},

	create: function () 
	{
		game.stage.backgroundColor = 'rgb(0,0,0)'; //Background color black
	
		gameOver = game.add.sprite(game.world.centerX, 245, 'gameover'); // Add game over image
		gameOver.anchor.setTo(0.5, 0.5);
	/*	
		this.deadDrop = game.add.sprite(game.world.centerX, 0, 'dead'); // Add dead droplet image
		this.deadDrop.anchor.setTo(0.5, 0.5);
	
		game.physics.arcade.enable(this.deadDrop); // Add physics to dead droplet
		
		this.deadDrop.body.gravity.y = 500; // Makes dead droplet fall 
	*/	
		timer = 0;
		
		gameOverLabel = game.add.text(game.world.centerX, game.world.centerY + 200, 'Click anywhere to continue'); // Click anywhere to continue text
		gameOverLabel.anchor.setTo(0.5, 0.5);
		gameOverLabel.font = "Press Start 2P";
		gameOverLabel.fill = "#fff"; //White text
		gameOverLabel.fontSize = 10; 
		
		game.input.onDown.add(function() {game.state.start('score');}, self); // Input listener go to score screen on mouse click
	},
	
	update: function () 
	{
	/*
		if (this.deadDrop.y >= 200)
		{
			console.log("hey");
			this.deadDrop.body.gravity.y = 0;
		}
	*/
		//Used to make text blink
		timer += game.time.elapsed;
		if (timer >= 500)
		{
			timer -= 500;
			gameOverLabel.visible = !gameOverLabel.visible;
		}
	},
};

var leaderboardState = {
	
	preload: function() 
	{      
		game.load.image('mainMenu', 'assets/mainMenu.png'); // Load main menu image
		game.load.image('leaderbrd', 'assets/leaderbrd.png'); // Load leaderboard title image
	},
	
	create: function ()
	{
		leaderBoard = game.add.sprite(game.world.centerX, 40, 'leaderbrd'); // Add leaderboard image
		leaderBoard.anchor.setTo(0.5, 0.5);
			
		if(localStorage.length > 0)
		{
			var localStorageArray = new Array();
			for (var i = 0; i < localStorage.length; i++)
			{
				localStorageArray[i] = Number(localStorage.key(i)); // Put scores in an array so they can be sorted
			}
			localStorageArray.sort(function(a,b) { return b - a; }); // Sort scores in decreasing order
		
			for (var n = 0; n < localStorageArray.length && n < 9; n++) // Iterate through every initials/score pair
			{
				scoresLabel = game.add.text(game.world.centerX, 100 + (n*30), localStorage.getItem(localStorageArray[n]) + "             " + localStorageArray[n]); // Display top 9 initials and score
				scoresLabel.anchor.setTo(0.5, 0.5);
				scoresLabel.font = "Press Start 2P";
				scoresLabel.fill = "#fff"; // White text
				scoresLabel.fontSize = 12;
			}
		}	
		var menuButton = game.add.button(game.world.centerX, game.world.centerY + 175, 'mainMenu', function() {game.state.start('menu');}, this, 2, 1, 0); // Main menu button
		menuButton.anchor.setTo(0.5, 0.5);
	},
}

var menuState = {
	
	preload: function() 
	{   
		game.load.image('title', 'assets/ceasethegrease.png'); // Load cease the grease title image
		game.load.spritesheet('play', 'assets/plays.png', 300, 300); // Load play animation frames	
		game.load.image('playbutton', 'assets/playbutton.png'); // Load play button image
	},
	
	create: function () 
	{    
		game.stage.backgroundColor = 'rgb(1,14,82)'; //Background color blue
	
		title = game.add.sprite(game.world.centerX, 100, 'title'); // Add title image
		title.anchor.setTo(0.5, 0.5);
		
		play = this.game.add.sprite(50, 175, 'play'); // Add play button animation at 50,175
		play.frame = 0; // Default frame is the first frame at position 0
		
		play.animations.add('start', [0,1,2], 2, true); // Animate the image
		
		play.animations.play('start'); // Play animation
		
		var playButton = game.add.button(50+38, 175+113, 'playbutton', function() {game.state.start('story');}, this, 2, 1, 0); // Add play button over play animation to go to story screen
    },
};

var scoreState = {
	
	preload: function() 
	{      
		game.load.image('blankscore', 'assets/scoreblank.png'); // Load blank score image
		game.load.image('savescore', 'assets/savescore.png'); // Load save score button
	},
	
	create: function () 
	{    
		scoreBackground = game.add.sprite(0, 0, 'blankscore'); // Add background image
		
		scoreLabel = game.add.text(game.world.centerX, game.world.centerY - 55, score); // Score text
		scoreLabel.anchor.setTo(0.5, 0.5);
		scoreLabel.font = "Press Start 2P";
		scoreLabel.fill = "#fff"; // White text
		scoreLabel.fontSize = 50;
		
		var saveScoreButton = game.add.button(game.world.centerX, game.world.centerY + 190, 'savescore', getScore, this, 2, 1, 0); // Save score button
		saveScoreButton.anchor.setTo(0.5, 0.5);
		
		word = "";
		prevLetter = "";
		letter = "";
	
		var inputLabel = stateText = game.add.text(game.world.centerX, game.world.centerY, ' '); // Display user input
		stateText.anchor.setTo(0.5, 0.5);
		inputLabel.font = "Press Start 2P";
		inputLabel.fill = "#fff"; // White text
		inputLabel.fontSize = 30;
	
		function getScore () 
		{
			scoreBackground.destroy(); // Delete score background image
			scoreLabel.destroy(); // Delete score 
			saveScoreButton.destroy(); // Delete save score button
			
			initialsLabel = game.add.text(game.world.centerX, game.world.centerY - 100, 'Please enter your initials then press ENTER'); // Input initials text
			initialsLabel.anchor.setTo(0.5, 0.5);
			initialsLabel.font = "Press Start 2P";
			initialsLabel.fill = "#fff"; // White text
			initialsLabel.fontSize = 9;
			
			game.input.keyboard.addCallbacks(self, keyDown, null, null); // Input listener for user's keyboard input 
			
			function keyDown(evt) 
			{
				if(evt.which < "A".charCodeAt(0) || evt.which > "Z".charCodeAt(0))
					return; // Skip it unless it's a-z.

				prevLetter = letter; // Save previous letter
				
				letter = String.fromCharCode(evt.which) + "."; // Add period for initials format ex: t.h.

				if(!evt.shiftKey) 
					letter = letter.toUpperCase(); 
			}
			
			this.enter2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);this.enter2.onDown.add(function() { // When the enter key is pressed
				localStorage.setItem(score.toString(), word); // Store initials and score for leaderboard
			
				game.state.start('leader');	// Go to leaderboard
			}, this);
		}
	},
	
	update: function () 
	{	
		word = prevLetter + letter; // Used to concatenate both initials and display it on the screen
        stateText.text = word;
        stateText.visible = true;
	},
};

var storyState = {
	
	preload: function() 
	{      
		game.load.image('letsgo', 'assets/letsgo.png'); // Load let's go droplet image
	},
	
	create: function () 
	{    	
		var storyLabel = game.add.text(game.world.centerX, game.world.centerY - 150, 'Help Drippy reach the ocean! \nTo start game click anywhere'); // Story text
        storyLabel.anchor.setTo(0.5, 0.5);
		storyLabel.font = "Press Start 2P";
		storyLabel.fill = "#fff"; // White text
		storyLabel.fontSize = 12;
		
		letsGo = game.add.sprite(game.world.centerX, game.world.centerY + 50, 'letsgo'); // Add let's go droplet image
		letsGo.anchor.setTo(0.5, 0.5);
		
		game.input.onDown.add(function() {game.state.start('main');}, self); // Input listener to start game on mouse click
    },
};

var learnMoreState = {
	
	preload: function() 
	{      
		game.load.image('mainmenu', 'assets/mainmenu.png'); // Load main menu image
	},
	
	create: function () 
	{    
		var learnMoreLabel = game.add.text(game.world.centerX, game.world.centerY - 200, 'About the Cease the Grease Campaign', {font: '20px Arial', fill: '#F2F2F2'}); // Learn more text
		learnMoreLabel.anchor.setTo(0.5, 0.5);
		
		var mainMenuButton = game.add.button(game.world.centerX, game.world.centerY + 175, 'mainmenu', function() {game.state.start('menu');}, this, 2, 1, 0); // Main menu button
		mainMenuButton.anchor.setTo(0.5, 0.5);
    },
};

var instructionsState = {
	
	preload: function() 
	{      
		game.load.image('mainmenu', 'assets/mainmenu.png'); // Load main menu image
	},
	
	create: function () 
	{    
		var instructionsLabel = game.add.text(game.world.centerX, game.world.centerY - 200, 'How to Play', {font: '30px Arial', fill: '#F2F2F2'}); // Instructions text
		instructionsLabel.anchor.setTo(0.5, 0.5);
		
		var mainMenuButton = game.add.button(game.world.centerX, game.world.centerY + 175, 'mainmenu', function() {game.state.start('menu');}, this, 2, 1, 0); // Main menu button
		mainMenuButton.anchor.setTo(0.5, 0.5);
    },
};

// Create a 400, 490 new Phaser game
var game = new Phaser.Game(400, 490);

//localStorage.clear();

var timer = 0;
var prevLetter = " ";
var letter = " ";
var initials = " ";
var score = 0;

game.state.add('main', mainState); 
game.state.add('over', gameOverState);
game.state.add('menu', menuState);
game.state.add('score', scoreState);
game.state.add('leader', leaderboardState);
game.state.add('learn', learnMoreState);
game.state.add('story', storyState);
game.state.add('instructions', instructionsState);

// Begin the game at the main menu
game.state.start('menu');
