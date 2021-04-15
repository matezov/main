function $(id) {
	return document.querySelector('#' + id);
}

function init() {
    $('divgame').style.display = "none";
    $('otheroptdiv').style.display = "none";
	$('rules').onclick = showRules;
	$('playGame').onclick = playTheGame;
	$('otherOptions').onclick = otherOptions;
	$('difficulty').onchange = setDifficulty;
	$('players').onchange = setPlayers;
	$('backbtnoo').onclick = backbtn;
    $('backbtndg').onclick = backbtndg;
    $('sethelpcheck').onchange = setHelpCheck;
    $('setshowcheck').onchange = setShowCheck;
    $('additioncheck').onchange = additionCheck;
}
window.addEventListener('load', init);

let gameMode = 'easy';

let setShowBTN = false;
let setHelpBTN = false;
let additionBTN = false;

function otherOptions() {
    $('otheroptdiv').style.display = "block";
    $('divmenu').style.display = "none";
    $('divgame').style.display = "none";
}

function backbtndg() {
    $('otheroptdiv').style.display = "none";
    $('divmenu').style.display = "block";
    $('divgame').style.display = "none";
    deckManager.setDefault();
    $('sethelpcheck').checked = false;
    setHelpBTN = false; 
    $('setshowcheck').checked = false;
    setShowBTN = false; 
    $('additioncheck').checked = false;
    additionBTN = false;
    functionbtns = [];
    setcounter = [];
    $('players').value = 1;
    $('difficulty').value = 'Gyakorlás';
    timer = 0;
    settodef();
    $('forRules').style.display = "block";
}

function backbtn() {
    $('otheroptdiv').style.display = "none";
    $('divmenu').style.display = "block";
    $('divgame').style.display = "none";
}

function showRules() {
    window.open("https://fejlesztojatekvilag.hu/uploaded/set_magyar_szabaly.pdf");
}

function setDefault() {
    setShowBTN = false;
    setHelpBTN = false;
    additionBTN = false;
    $('sethelpcheck').checked = false;
    $('setshowcheck').checked = false;
    $('additioncheck').checked = false;
}

function playTheGame() {
    deckManager.newGame();
    $('divmenu').style.display = "none";
    $('otheroptdiv').style.display = "none";
    $('divgame').style.display = "block";
    timer = 0;
    t = 1;
}

function setDifficulty() {
    let dif = $('difficulty').value;
    if (dif === "Gyakorlás") { deckManager.setGameMode('easy'); $('forRules').style.display = "block";}
    if (dif === "Verseny") {
        deckManager.setGameMode('hard');
        $('forRules').style.display = "none";
        setDefault();
    }
}

function setPlayers() {
    let players = $('players').value;
    switch(players) {
        case '1': deckManager.setPlayers(1); break;
        case '2': deckManager.setPlayers(2); break;
        case '3': deckManager.setPlayers(3); break;
        case '4': deckManager.setPlayers(4); break;
        case '5': deckManager.setPlayers(5); break;
        case '6': deckManager.setPlayers(6); break;
        case '7': deckManager.setPlayers(7); break;
        case '8': deckManager.setPlayers(8); break;
        case '9': deckManager.setPlayers(9); break;
        case '10': deckManager.setPlayers(10); break;
    }
}


function setHelpCheck() { $('sethelpcheck').checked ? setHelpBTN = true : setHelpBTN = false; }
function setShowCheck() { $('setshowcheck').checked ? setShowBTN = true : setShowBTN = false; }
function additionCheck() { $('additioncheck').checked ? additionBTN = true : additionBTN = false; }