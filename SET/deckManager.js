const deckManager = new (function(){
    let types = {
        colours: ['red','green','purple'],
        shapes: ['Pill','Squiggle','Diamond'],
        numbers: [1,2,3],
        contents: ['Solid','Hatched','Open']
    };

    let inGame = false;
    let deck = [];
    let cardsOnTable = [];
    let nameOfPlayers = [{name: "Játékos1", point: 0, banned: false, turn: false, selected: false, id: 0}];
    let players = 1;
    let gameMode = 'easy';

    this.createDeck = function(){
        deck.splice(0, deck.length);
        types.colours.forEach(c => {
            types.shapes.forEach(s => {
                types.numbers.forEach(n => {
                    if (gameMode === 'hard') {
                        types.contents.forEach(co => {
                            deck.push({
                                colour: c, 
                                shape: s, 
                                number: n, 
                                content: co, 
                                id: n + co[0] + c[0] + s[0]
                            });
                        });
                    } else {
                        deck.push({
                            colour: c, 
                            shape: s,
                            number: n,
                            id: n + "S" + c[0] + s[0]
                        });
                    }
                });
            });
        });
    }
    
    this.getInGame = function() { return inGame; }
    this.setInGameFalse = function() { inGame = false; }

    this.shuffleDeck = function() {
        if (deck.length < 2) { return; }
        for (let i=0; i<(deck.length * 30)+Math.floor(Math.random() * 2); ++i) {
			let ri1 = Math.floor(Math.random() * (deck.length));
			let ri2 = Math.floor(Math.random() * (deck.length - 1));
			if(ri2 >= ri1){
				ri2 += 1;
			}
			let t =  deck[ri1];
			deck[ri1] = deck[ri2]
			deck[ri2] = t;
        }
    }

    this.putCardsToDesk = function() {
        cardsOnTable.splice(0,cardsOnTable.length);
        for (let i=0; i<12; ++i) {
            cardsOnTable.push(deck[0]);
            deck.splice(0,1)[0];
        }
    }
    
    this.setPointsToZero = function() {
        nameOfPlayers.forEach(p => {
            p.point = 0;
        });
    }

    this.setInGameHelp = function() {
        if (cardsOnTable < 3) {return false}
        for (let i=0; i<cardsOnTable.length - 2; ++i) {
            for (let j= i + 1; j<cardsOnTable.length - 1; ++j) {
                for (let k= j + 1; k<cardsOnTable.length; ++k) {
                    if (cardsOnTable[i] != null && cardsOnTable[j] != null && cardsOnTable[k] != null) {
                        if (this.isSet(cardsOnTable[i].id ,cardsOnTable[j].id, cardsOnTable[k].id)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    this.setDefault = function() {
        inGame = false;
        deck.splice(0, deck.length);
        cardsOnTable.splice(0, cardsOnTable.length);
        nameOfPlayers.splice(0, nameOfPlayers.length);
        nameOfPlayers.push({name: "Játékos1", point: 0, banned: false, turn: false, selected: false, id: 0});
        players = 1;
        gameMode = 'easy';
    }

    this.getSelectedPlayer = function() {
        for (let i=0; i<nameOfPlayers.length; ++i) {
            if (nameOfPlayers[i].selected) {
                return nameOfPlayers[i];
            }
        }
        return null;
    }

    this.getPlayerOnIndex = function(i) {return nameOfPlayers[i]; }
    this.getDeck = function() { return deck; }
    this.setGameMode = function(mode) { gameMode = mode; }
    this.getPlayers = function() { return players; }
    this.getAllPlayers = function() { return nameOfPlayers; }
    this.getGameMode = function() { return gameMode; }
    this.getCardsOnTable = function() { return cardsOnTable; }



    this.newGame = function() {
        this.createDeck();
        this.shuffleDeck();
        this.putCardsToDesk();
        inGame = true;
    }

    this.setPlayers = function(n) {
        nameOfPlayers.splice(0,nameOfPlayers.length);
        players = n;
        for (let i=1; i<=n; ++i) {
            let tmp = "Játékos" + i;
            nameOfPlayers.push({name: tmp, point: 0, banned: false, turn: false, selected: false, id: i-1})
        }
    }

    this.allBanned = function() {
        let b = true;
        nameOfPlayers.forEach(p => {
            if (p.banned === false) {
               b = false;
            }
        });
        return b;
    }

    this.unbannAll = function() {
        nameOfPlayers.forEach(p => {
            p.banned = false;
        });
    }

    this.showSet = function() {
        if (cardsOnTable < 3) {return false}
        for (let i=0; i<cardsOnTable.length - 2; ++i) {
            for (let j= i + 1; j<cardsOnTable.length - 1; ++j) {
                for (let k= j + 1; k<cardsOnTable.length; ++k) {
                    if (cardsOnTable[i] != null && cardsOnTable[j] != null && cardsOnTable[k] != null) {
                        if (this.isSet(cardsOnTable[i].id ,cardsOnTable[j].id, cardsOnTable[k].id)) {
                            return [cardsOnTable[i].id, cardsOnTable[j].id, cardsOnTable[k].id];
                        }
                    }
                }
            }
        }
        return null;
    }

    this.isSet = function(a, b, c) {
        let set = false;
        let colour = (a[2] === b[2] && b[2] === c[2] && a[2] === c[2]) || (a[2] !== b[2] && b[2] !== c[2] && a[2] !== c[2]);
        let shape = (a[3] === b[3] && b[3] === c[3] && a[3] === c[3]) || (a[3] !== b[3] && b[3] !== c[3] && a[3] !== c[3]);
        let number = (a[0] === b[0] && b[0] === c[0] && a[0] === c[0]) || (a[0] !== b[0] && b[0] !== c[0] && a[0] !== c[0]);

        if (gameMode === 'hard') {
            let content;
            content = (a[1] === b[1] && b[1] === c[1] && a[1] === c[1]) || (a[1] !== b[1] && b[1] !== c[1] && a[1] !== c[1]);
            if (colour && shape && number && content) {
                set = true;
            }
        }

        if (colour && shape && number) {
            set = true;
        }

        return set;
    }

    this.putExtraCardsToDesk = function () {
        if (deck.length >= 3 && cardsOnTable.length < 15) {
            for (let i = 0; i < 3; ++i) {
                cardsOnTable.push(deck[0]);
                deck.splice(0, 1)[0];
            }
        }
    }
    
    this.drawInsteadOfCompletedSet = function(a, b, c) {
        for (let i = 0; i < cardsOnTable.length; ++i) {
            if (cardsOnTable[i] !== null) {
                if (deck.length > 0) {
                    if (cardsOnTable[i].id == a || cardsOnTable[i].id == b || cardsOnTable[i].id == c) {
                        cardsOnTable[i] = deck[0];
                        deck.splice(0, 1)[0];
                    }
                } else {
                    if (cardsOnTable[i].id == a || cardsOnTable[i].id == b || cardsOnTable[i].id == c) {
                        cardsOnTable[i] = null;
                    }
                }
            }
        }
    }

    this.shuffleCardsFromTable = function() {
        for (let i=0; i<cardsOnTable.length; ++i) {
            deck.push(cardsOnTable[i]);
        }
        cardsOnTable.splice(0, cardsOnTable.length);
    }

})();