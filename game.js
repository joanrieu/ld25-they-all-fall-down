var levels = [
	{
		walls: [
			[13, 13, 12],
			[25, 18, 5]
		],
		bodies: [
			[13, 13],
			[17, 13],
			[19, 13],
			[21, 13],
			[23, 13],
		],
		highscore: 1,
		hint: "Those people are not welcome! Get rid of them!<br>"
			+ "You can use my powers to make them see "
			+ "someone as evil. And they will flee...<br>"
			+ "You're allowed to let one of them live."
	},
	{
		walls: [
			[10, 11, 12],
			[22, 12, 3],
			[25, 11, 1]
		],
		bodies: [
			[10, 11],
			[12, 11],
			[16, 11],
			[20, 11],
			[22, 12]
		],
		highscore: 1,
		hint: "Good thing that they're dumb, right?<br>"
			+ "But sometimes you wish they were a tiny bit smarter..."
	},
	{
		walls: [
			[16, 8, 6],
			[22, 7, 1],
			[16, 14, 6],
			[15, 13, 1]
		],
		bodies: [
			[18, 8],
			[17, 14],
			[20, 14]
		],
		highscore: 2,
		hint: "Sometimes they just want to stay there forever.<br>"
			+ "But you'll make them leave... right?<br>"
			+ "<small>Hint: You can select multiple characters.</small>"
	},
	{
		walls: [
			[11, 14, 4],
			[15, 16, 16],
			[15, 10, 11],
			[26, 8, 2]
		],
		bodies: [
			[16, 16],
			[18, 10],
			[20, 16],
			[22, 10]
		],
		highscore: 3,
		hint: "Sometimes they find friends and just stick together."
	},
	{
		walls: [
			[14, 16, 1],
			[15, 17, 3],
			[18, 16, 1],
			[14, 9, 6],
			[27, 17, 2],
			[27, 12, 2],
			[29, 11, 1]
		],
		bodies: [
			[18, 16],
			[18, 9],
			[27, 17],
			[27, 12]
		],
		highscore: 2,
		hint: "Again."
	},
	{
		walls: [
			[5, 9, 1],
			[6, 10, 3],
			[10, 12, 2],
			[14, 6, 3],
			[18, 12, 2],
			[20, 11, 1]
		],
		bodies: [
			[7, 10],
			[11, 12],
			[14, 6],
			[18, 12]
		],
		highscore: 3,
		hint: "&laquo;&nbsp;One by one, they all fall down&hellip;&nbsp;&raquo;"
	},
	{
		walls: [
			[9, 16, 19],
			[16, 14, 2],
			[9, 7, 12],
			[21, 8, 1],
			[22, 9, 3],
			[25, 8, 1],
			[25, 5, 1],
			[28, 9, 2],
			[30, 8, 1]
		],
		bodies: [
			[9, 16],
			[19, 16],
			[10, 7],
			[21, 8],
			[28, 9]
		],
		highscore: 3,
		hint: "&laquo;&nbsp;&hellip;like toy soldiers.&nbsp;&raquo;"
	},
	{
		walls: [
			[12, 8, 1],
			[13, 9, 2],
			[12, 14, 1],
			[13, 15, 3],
			[16, 14, 2],
			[18, 8, 1],
			[23, 23, 1],
			[24, 24, 2],
			[26, 23, 2],
			[20, 10, 1],
			[21, 12, 2],
			[26, 17, 2],
			[28, 15, 1]
		],
		bodies: [
			[14, 9],
			[16, 14],
			[26, 23],
			[21, 12]
		],
		highscore: 2,
		hint: "Bouncing soldiers, it seems&hellip;"
	}
];

var currentLevel = 0;
var score;

window.onload = function() {

	Crafty.init(768, 512);

	Crafty.c("Body", {
		init: function() {
			this.requires("2D, DOM, Image, Gravity")
				.attr({ speed: 1+(Math.random()+2)/3})
				.gravity("Ground")
				.gravityConst(.1)
				.bind("EnterFrame", function() {
					var dead = this.has("DeadGuy");
					var out;
					if (dead)
						out = this.y < 0;
					else
						out = this.y > Crafty.viewport.height;
					if (out) {
						if (!dead)
							Crafty.e("DeadGuy")
								.image(this.has("GoodGuy") ?
									"good.png" : "bad.png")
								.attr({ x: this.x, y: this.y });
						this.destroy();
						Crafty.trigger("Death");
					}
				});
		}
	});

	Crafty.c("GoodGuy", {
		init: function() {
			this.requires("Body, Collision, Mouse")
				.image("good.png")
				.bind("Click", function() {
					this.makeVillain();
				}).bind("EnterFrame", function() {
					if (this.blocked !== this.getDirection()) {
						this.blocked = 0;
						this.x += this.getDirection() * this.speed;
					}
				}).onHit("Ground", function() {
					this.x -= this.blocked = this.getDirection();
				}).collision();
		},
		getDirection: function() {
			var villain = Crafty("BadGuy");
			if (!villain.length || villain.x == this.x)
				return 0;
			if (villain.x < this.x)
				return 1;
			else
				return -1;
		},
		makeVillain: function() {
			++score;
			var villain = Crafty("BadGuy");
			if (villain.length) {
				Crafty.e("GoodGuy")
					.attr({ x: villain.x, y: villain.y + 6 });
				villain.destroy();
			}
			Crafty.e("BadGuy")
				.attr({ x: this.x, y: this.y - 6 });
			this.destroy();
		}
	});

	Crafty.c("BadGuy", {
		init: function() {
			this.requires("Body")
				.image("bad.png");
		}
	});

	Crafty.c("DeadGuy", {
		init: function() {
			this.requires("Body")
				.attr({ alpha: .2 })
				.origin(this.w / 2, this.h / 2)
				.bind("EnterFrame", function() {
					this.attr({
						rotation: this.rotation + 12
					});
				}).attr({
					_anti: undefined,
					_gravityConst: -this._gravityConst
				});
		}
	});

	function createBody(x, y) {
		return Crafty.e("GoodGuy")
			.attr({ x: x, y: y })
			.gravity("Ground");
	}

	function createGround(x, y, w) {
		return Crafty.e("2D, DOM, Image, Ground")
			.attr({ x: x, y: y, w: w, h: 18 })
			.image("block.png", "repeat");
	}

	function createWorld(level) {
		var level = levels[level];
		Crafty.e("2D, DOM, Text, Tween")
			.attr({ x: 16, y: 16, w: Crafty.viewport.width, alpha: 0 })
			.tween({ alpha: 1 }, 24)
			.text(
				"<p><em>Chapter "
				+ (+currentLevel+1)
				+ "</em></p>"
				+ level.hint
			);
		for (i in level.bodies) {
			var body = level.bodies[i];
			createBody(body[0] * 18, body[1] * 18 - 54);
		}
		for (i in level.walls) {
			var wall = level.walls[i];
			createGround(wall[0] * 18, wall[1] * 18, wall[2] * 18);
		}
	}

	Crafty.scene("loading", function() {
		Crafty.e("2D, DOM, Text")
			.text("Loading...");
		Crafty.load([
			// All
			"bg.png",
			// Menu
			"menu.png",
			// Game
			"good.png",
			"bad.png",
			"block.png",
			"aim.png",
			"restart.png",
			// Win
			"win.png"
		], function() {
			Crafty.scene("menu");
		});
		Crafty.audio.add({
			backgroundMusic: ["bg.mp3", "bg.ogg"]
		});
		Crafty.audio.play("backgroundMusic", -1);
	});

	Crafty.scene("menu", function() {
		Crafty.e("2D, DOM, Image")
			.image("bg.png");
		Crafty.e("2D, DOM, Image, Mouse")
			.image("menu.png")
			.bind("Click", function() {
				Crafty.scene("game");
			});
	});

	Crafty.c("RestartButton", {
		init: function() {
			this.requires("2D, DOM, Image, Mouse")
				.image("restart.png")
				.attr({ z: 1 })
				.bind("Click", function() {
					Crafty.scene("game");
				});
			}
	});

	Crafty.scene("game", function() {
		score = 0;
		Crafty.e("2D, DOM, Image")
			.image("bg.png");
		Crafty.e("2D, DOM, Image")
			.image("aim.png")
			.origin(38, 38)
			.attr({ z: 1 })
			.attach(
				Crafty.e("2D, DOM, Text")
					.text("<p class=aim>Villain!</p>")
					.attr({ x: 0, y: -38, w: 76, z: 1 })
			)
			.bind("EnterFrame", function() {
				this.attr({
					x: Crafty.mousePos.x - this.w / 2,
					y: Crafty.mousePos.y - this.h / 2,
					rotation: (this.rotation + 5) % 360
				});
			});
		Crafty.e("RestartButton")
			.attr({
				x: Crafty.viewport.width - 42,
				y: Crafty.viewport.height - 42,
				alpha: .6
			});
		createWorld(currentLevel);
		Crafty.e("2D, DOM, Text")
			.attr({ x: Crafty.viewport.width - 64 - 10, y: 10 })
			.bind("Death", function() {
				var bodies = Crafty("Body").length;
				var alive = (bodies - Crafty("DeadGuy").length);
				this.text(
					"<p class=score>"
					+ alive
					+ "</p>"
				);
				if (bodies <= 1 && !this.leaving) {
					this.leaving = true;
					this.timeout(function() {
						++currentLevel;
						Crafty.scene("win");
					}, 400);
				}
			});
		Crafty.trigger("Death");
	});

	Crafty.scene("win", function() {
		Crafty.e("2D, DOM, Image, Tween")
			.image("bg.png");
		win = Crafty.e("2D, DOM, Image, Tween, Mouse")
			.image("win.png")
			.attr({ alpha: 0 })
			.tween({ alpha: 1, x: 0, y: 0 }, 24)
			.bind("Click", function() {
				Crafty.scene("game");
			});
		var txt = "";
		if (score > levels[currentLevel-1].highscore)
			txt += "There was an easier way to kill them.<br>";
		if (currentLevel < levels.length)
			txt += "Click to play level " + (currentLevel+1) + ".";
		else {
			currentLevel = 0;
			txt += "Click to restart the game.";
		}
		Crafty.e("2D, DOM, Text, Tween")
			.attr({ x: 16, y: 16, w: Crafty.viewport.width, alpha: 0 })
			.tween({ alpha: 1 }, 24)
			.text(txt);
	});

	Crafty.scene("loading");

	(function(levels) {
		var txt = "Direct level access:<ul>";
		for (i in levels)
			txt += "<li><a href=\"javascript:currentLevel="
				+ i
				+ ";Crafty.scene('game');\"><button>"
				+ (+i+1)
				+ "</button></a></li>";
		txt += "</ul>";
		var div = document.createElement("p");
		div.className = "cheat";
		div.innerHTML = txt;
		document.body.appendChild(div);
	})(levels);

}
