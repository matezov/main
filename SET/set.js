const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let buttons = [];
let playerButtons = [];
let setcounter = [];
let set = false;
let functionbtns = [];

let showedSETflag = false;
let showedSET = [];
let helpSET = false;
let helpSETflag = false;
let flag = false;
let addCARDS = false;

let timer = 10;
let t = 1;

let currentplayer = false;

canvas.onclick = function (e) {
	if (deckManager.getInGame()) {
		if (showedSETflag) {
			showedSETflag = false;
		}
		if (helpSETflag) {
			helpSETflag = false;
		}
		
		functionbtns.forEach(fbtn => {
			if (e.layerX > fbtn.x && e.layerX < fbtn.x + fbtn.w &&
				e.layerY > fbtn.y && e.layerY < fbtn.y + fbtn.h) {
					if (fbtn.name === 'add') {
						addCARDS = true;
					}
					if (fbtn.name === 'show') {
						if (deckManager.setInGameHelp()) {
							showedSETflag = true;
							showedSET = deckManager.showSet();
						}
					}
					if (fbtn.name === 'help') {
						helpSETflag = true;
						helpSET = deckManager.setInGameHelp();
					}
			}
		});
		if (currentplayer) {
			buttons.forEach(button => {
				if (e.layerX > button.x && e.layerX < button.x + button.w &&
					e.layerY > button.y && e.layerY < button.y + button.h) {
					if (setcounter.length < 3) {
						let b = true;
						for (let i=0; i<setcounter.length; ++i) {
							if (setcounter[i] === button.id) {
								setcounter.splice(i, (i+1))[i];
								b = false;
							}
						}
						if (b) {
							setcounter.push(button.id);
							set = false;
						}
						if (setcounter.length === 3) {
							waitforclick = true;
						}
					}
				}
			});
		}
		if (deckManager.getSelectedPlayer() === null) {
			playerButtons.forEach(player => {
				if (e.layerX > player.x && e.layerX < player.x + player.w &&
					e.layerY > player.y && e.layerY < player.y + player.h) {
					if (!deckManager.getPlayerOnIndex(player.id).banned) {
						deckManager.getPlayerOnIndex(player.id).selected = true;
					}
					timer = 10;
					t = 1;
				}
			})
		}
		flag = false;
	} else {
		deckManager.newGame();
		settodef();
	}
}

function settodef() {
	buttons.splice(0, buttons.length);
	functionbtns.splice(0, functionbtns.length);
	playerButtons.splice(0, playerButtons.length)
	setcounter = [];
	set = false;
	showedSETflag = false;
	showedSET = [];
	helpSET = false;
	helpSETflag = false;
	flag = false;
	addCARDS = false;
	timer = 0;
	t = 1;
	deckManager.setPointsToZero();
	deckManager.unbannAll();
}

const gameLoop = function () {
	update();
	draw();
	window.requestAnimationFrame(gameLoop);
}

const update = function () {
	if (deckManager.getInGame()) {
		if (deckManager.getPlayers() === 1) {
			currentplayer = true;
		} else if (deckManager.getSelectedPlayer() !== null) {
			currentplayer = true;
		} else {
			currentplayer = false;
		}
		if (setcounter.length === 3) {
			let x = deckManager.isSet(setcounter[0], setcounter[1], setcounter[2]);
			if (x) {
				set = true;
				deckManager.drawInsteadOfCompletedSet(setcounter[0], setcounter[1], setcounter[2]);
				if (deckManager.getSelectedPlayer() !== null) {
					deckManager.getSelectedPlayer().point = deckManager.getSelectedPlayer().point + 1;
					deckManager.getSelectedPlayer().selected = false;
				} else if (deckManager.getPlayers() === 1) {
					deckManager.getPlayerOnIndex(0).point += 1;
				} 
			} else {
				if (deckManager.getSelectedPlayer() !== null ) {
					deckManager.getSelectedPlayer().point = deckManager.getSelectedPlayer().point - 1;
					deckManager.getSelectedPlayer().banned = true;
					deckManager.getSelectedPlayer().selected = false;
				} else if (deckManager.getPlayers() === 1) {
					deckManager.getPlayerOnIndex(0).point -= 1;
				}
				set = false;
			}
			setcounter.splice(0, setcounter.length);

			flag = true;
		}
		if (showedSETflag) {
			setcounter.splice(0, setcounter.length);
		}

		if (addCARDS) {
			deckManager.putExtraCardsToDesk();
			addCARDS = false;
		}

		let b = deckManager.setInGameHelp();
		if (!b) {deckManager.putExtraCardsToDesk()}
		if (deckManager.getDeck().length <= 0 && !b) {
			deckManager.setInGameFalse();
		}
		if (timer === 0) {
			if (deckManager.getSelectedPlayer() !== null) {
				deckManager.getSelectedPlayer().banned = true;
				deckManager.getSelectedPlayer().point -= 1;
				deckManager.getSelectedPlayer().selected = false;
			}
			setcounter.splice(0, setcounter.length);
		}
		if (deckManager.allBanned()) {
			deckManager.unbannAll();
		}
	}
}

const draw = function (e) {
	context.canvas.width = (window.innerWidth * 0.8);
	context.canvas.height = (window.innerHeight * 0.8);
	context.clearRect(0, 0, canvas.width, canvas.heigth);
	if (deckManager.getInGame()) {
		buttons.splice(0, buttons.length);
		functionbtns.splice(0, functionbtns.length);

		let posX = canvas.width / 5;
		let posY = canvas.height / 5;
		let cardWidth = canvas.width / 6;
		let cardHeight = canvas.height / 6;
		let cards = deckManager.getCardsOnTable();
		let rows = cards.length / 3;

		let btnY = 20;
		context.font = "20px Georgia";
		if (additionBTN) {
			functionbtns.push({name: 'add', text: 'Lapok húzása', x: posX/8, y: btnY, w: posX / 2, h: posY / 2 });
			context.fillStyle = "grey"
			context.fillRect(posX/8, btnY, posX / 1.5, posY / 2);
			context.fillStyle = "black"
			context.fillText("Lapok húzása",posX/5, btnY + posY/4);
			btnY = btnY + posY;
		}
		if (setHelpBTN) {
			functionbtns.push({name: 'help', text: 'Van set?', x: posX/8, y: btnY, w: posX / 2, h: posY / 2 });
			context.fillStyle = "grey"
			context.fillRect(posX/8, btnY, posX / 1.5, posY / 2);
			context.fillStyle = "black"
			context.fillText("Van set?",posX/5, btnY + posY/4);
			btnY = btnY + posY;
		}
		if (setShowBTN) {
			functionbtns.push({name: 'show', text: 'Set mutatása', x: posX/8, y: btnY, w: posX / 2, h: posY / 2 });
			context.fillStyle = "grey"
			context.fillRect(posX/8, btnY, posX / 1.5, posY / 2);
			context.fillStyle = "black"
			context.fillText("SET mutatása!",posX/5, btnY + posY/4);
			btnY = btnY + posY;
		}

		let index = 0;
		for (let i = 0; i < rows; ++i) {
			for (let j = 1; j < 4; ++j) {
				if (cards[index] != null) {
					let img = new Image();
					img.onload = function () {
						context.drawImage(img, 0, 0);
					}
					img.src = "svg_files/" + cards[index].id + ".svg";
					buttons.push({id: cards[index].id, x: j * posX, y: i * posY, w: cardWidth, h: cardHeight });
					context.drawImage(img, j * posX, i * posY, cardWidth, cardHeight);
					let b = false;

					setcounter.forEach(sc => {
						if (sc == cards[index].id) {
							b = true;
						}

						if (b) {
							context.rect(j * posX - 1, i * posY - 1, cardWidth + 2, cardHeight + 2);
							context.lineWidth = 5;
							context.strokeStyle = 'red';
							context.stroke();
						}
					})

					if (showedSETflag) {
						if (showedSET[0] === cards[index].id || showedSET[1] === cards[index].id || showedSET[2] === cards[index].id) {
							context.rect(j * posX - 1, i * posY - 1, cardWidth + 2, cardHeight + 2);
							context.lineWidth = 5;
							context.strokeStyle = 'black';
							context.stroke();
						}
					}
				}
				if (index < cards.length - 1) {
					index = index + 1;
				}
			}
		}

		if (flag) {
			if (set) {
				context.font = "40px Georgia";
				context.fillStyle = "green"
				context.fillText("SET", 4 * posX, posY / 4);
			} else if (!set) {
				context.font = "40px Georgia";
				context.fillStyle = "red"
				context.fillText("Hibás SET", 4 * posX, posY / 4);
			}
		}

		if (helpSETflag) {
			let hbtn;
			functionbtns.forEach(fbtn => {
				if (fbtn.name === 'help') {
					hbtn = {x: fbtn.x, y: fbtn.y, w: fbtn.w, h: fbtn.h}
				}
			});
			if (helpSET) {
				context.font = "20px Georgia";
				context.fillStyle = "green"
				context.fillText("Van SET a leosztásban", hbtn.x , hbtn.y + hbtn.h + posY / 4);
			} else {
				context.font = "20px Georgia";
				context.fillStyle = "green"
				context.fillText("Nincs SET a leosztásban", 4 * posX, posY / 4 + 50);
			}
		}

		context.font = "20px Georgia";
		context.fillStyle = "black"
		context.fillText("Pakliban lévő lapok: " + deckManager.getDeck().length, 4 * posX, posY / 4 + 80);

		let players = deckManager.getAllPlayers();
		if (players.length > 1) {

			if (t%60 === 0) {
				timer = timer - 1;
				if (timer == -1) { timer = 10;}
			}
			context.font = "20px Georgia";
			context.fillStyle = "black"
			if (deckManager.getSelectedPlayer() !== null) {
				context.fillText("Hátralévő idő: " + timer, 4 * posX, posY / 4 + 50);
			} else {
				context.fillText("Hátralévő idő: -", 4 * posX, posY / 4 + 50);
			}

			context.font = "20px Georgia";
			playerButtons.splice(0, playerButtons.length);

			let btnpY = posY / 3;
			for (let i=0; i<players.length; ++i) {
				let xc;
				let yc;
				let wc;
				let hc;
				if (i < 5) {
					xc = 4 * posX;
					yc = posY/2 + (i+1) * btnpY;
					wc = posX / 3;
					hc = posY / 4;
					context.fillStyle = "grey"
					context.fillRect(xc, yc, wc, hc);
					context.font = "12px Georgia";
					context.fillStyle = "black"
					context.fillText(players[i].name + ": " + players[i].point,4 * posX + posX/12, posY/2 + (i+1) * btnpY + posY/8);
					playerButtons.push({id: i, x : xc, y: yc, w: wc, h: hc});
				} else {
					xc = 4 * posX + posX/2.5;
					yc = posY/2 + (i-4) * btnpY
					wc = posX / 3;
					hc = posY / 4;
					context.fillStyle = "grey"
					context.fillRect(xc, yc, wc, hc);
					context.font = "12px Georgia";
					context.fillStyle = "black"
					context.fillText(players[i].name + ": " + players[i].point,xc + posX/12, yc + posY/8);
					playerButtons.push({id: i, x : xc, y: yc, w: wc, h: hc});
				}

				if (players[i].selected) {
					context.rect(xc - 1, yc - 1, wc + 2, hc + 2);
					context.lineWidth = 5;
					context.strokeStyle = 'yellow';
					context.stroke();
				}
			}
		} else {
			if (t%60 === 0) {
				timer = timer + 1;
			}
			context.font = "20px Georgia";
			context.fillStyle = "black"
			context.fillText("Eltelt idő: " + timer, 4 * posX, posY / 4 + 50);
		}
		++t;
	} else {
		context.font = "50px Georgia";
		context.fillStyle = "black"
		context.fillText("Pontszám:",100,100);
		context.font = "25px Georgia";
		let y = 40;
		if (deckManager.getPlayers() === 1) {
			let player = deckManager.getAllPlayers()[0];
			context.fillText("Név: " + player.name + ", pontszám: " + player.point + ", idő: " + timer, 200, 150);
		} else {
			let sorted = deckManager.getAllPlayers().sort(function(a, b){
				return b.point - a.point;
			});
			let i = 0;
			sorted.forEach(player => {
				context.fillText(i + ". :" + "Név: " + player.name + ", pontszám: " + player.point, 200, 150 + y);
				y = y + 40;
				++i
			});
		}
		context.font = "32px Georgia";
		context.fillText("Új játékhoz kattintson az egérrel!", 350, 300 + y);
	}
}

gameLoop();