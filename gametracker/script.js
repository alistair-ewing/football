const squad = ["Leo", "Donald", "Cairn", "Sol", "Mason", "Billy", "Aaron", "Tom", "Zac", "Conor", "Angus", "Harris", "Elias", "Sami", "Saim", "Gavin", "Lewis", "Thomas"];
var players = squad;
var playing = [];
var subs = [];
var events = [];
var summary = [];
var summaryEvents = ['shot', 'goal', 'assist', 'penslty', 'throwinL', 'cornerL', 'throwinR', 'cornerR'];
var timeAccuracy = 30; 

var startDatetime = "";
var endDatetime = "";

// start game button disabled till starting 11 selected
updateStartgame();
updateScore();
disabledToggle(['endfirsthalf','startsecondhalf','endgame']);
document.getElementById('game_section').style.display = 'none';
document.getElementById('summary_section').style.display = 'none';

// keep track of game time
setInterval(updateGametime, timeAccuracy * 1000);

// seelect the players and subs from the squad 
var squadlist = '<table><tr><td>Player</td><td>Playing</td><td>Sub</td></tr>';
for (i = 0; i < squad.length; i++){
	var player = squad[i];
	squadlist += '<tr><td>' + player + '</td><td><input type="checkbox" name="playing" value="' + player + '" id="player_' + player + '" checked/></td>'
	 + '<td><input type="checkbox" name="sub" value="' + player + '" id="sub_' + player + '"/></td></tr>'
	
}
squadlist += '<tr><td>TOTAL</td><td><div id="totalplaying"/>' + players.length + '</td><td><div id="totalsubs"/>' + subs.length + '</td></tr></table>';
if (document.getElementById('squadlist')) {
    document.getElementById('squadlist').innerHTML = squadlist;
}

// Select all playing checkboxes with the name 'playing' using querySelectorAll.
var playingCheckboxes = document.querySelectorAll('input[type="checkbox"][name="playing"]');
playingCheckboxes.forEach(function(checkbox) {
	checkbox.addEventListener('change', function() {
		players = 
			Array.from(playingCheckboxes) // Convert checkboxes to an array to use filter and map.
			.filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
			.map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
      
	document.getElementById('totalplaying').innerHTML = players.length;	
	updateStartgame();
	updatesubs();
			
	})
});

// Select all subs checkboxes with the name 'sub' using querySelectorAll.
var subsCheckboxes = document.querySelectorAll('input[type="checkbox"][name="sub"]');
subsCheckboxes.forEach(function(checkbox) {
	checkbox.addEventListener('change', function() {
		subs = 
			Array.from(subsCheckboxes) // Convert checkboxes to an array to use filter and map.
			.filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
			.map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
     
		updateStartgame();
		document.getElementById('totalsubs').innerHTML = subs.length;			
	})
});

function updateStartgame(){
	var advice = document.getElementById('squadadvice'); 
	if ( players.length - subs.length == 11 ) { 
		advice.innerHTML = 'Got 11 playing';
		document.getElementById('startgame').disabled = false; 
	} else {
		if ( players.length - subs.length > 11 ) {
			advice.innerHTML = 'Remove players or pick more subs to get 11 playing';
		} else {
			advice.innerHTML = 'Add players or remove subs to get 11 playing';			
		}
		document.getElementById('startgame').disabled = true; 		
	}	
}

function updatesubs(){
	for ( i = 0; i < squad.length; i++){
		if ( document.getElementById('player_' + squad[i]).checked ){
			document.getElementById('sub_' + squad[i]).disabled = '';
		} else {
			document.getElementById('sub_' + squad[i]).disabled = 'disabled';		
		}
	}
}

const startgame = document.getElementById("startgame");
startgame.addEventListener("click", startgameEvent);
function startgameEvent() {
	startDatetime = datetime();
	for (i = 0; i < players.length; i++){
		var player = players[i];
		if ( subs.indexOf(player) > -1 ){ continue; }
		playing.push(player);
	}
    addEvent("startgame", playing);
	displayToggle(['squad_section', 'game_section']);
	disabledToggle(['startgame','endfirsthalf']);
	if ( subs.length == 0 ){ disabledToggle(['substitute'])}
	updateHalf('firsthalf', startDatetime, '');
	updatePlayers();
}

const endgame = document.getElementById("endgame");
endgame.addEventListener("click", endGameEvent);
function endGameEvent() {
	endDatetime = datetime();
    addEvent("endGame", playing);
	displayToggle(['summary_section']);
	disabledToggle(['endgame']);
	updateHalf('secondhalf', endDatetime, ' to ');
	generateSummary();
}

const endfirsthalf = document.getElementById("endfirsthalf");
endfirsthalf.addEventListener("click", endfirsthalfEvent);
function endfirsthalfEvent() {
	endDatetime = datetime();
    addEvent("endfirsthalf", playing);
	disabledToggle(['startsecondhalf','endfirsthalf']);
	updateHalf('firsthalf', endDatetime, ' to ');
}

const startsecondhalf = document.getElementById("startsecondhalf");
startsecondhalf.addEventListener("click", startsecondhalfEvent);
function startsecondhalfEvent() {
	endDatetime = datetime();
    addEvent("startsecondhalf", playing);
	disabledToggle(['startsecondhalf','endgame']);
	updateHalf('secondhalf', endDatetime, '');
}

function updateHalf(half, datetime, append){
	var time = datetime.substring(datetime.indexOf('T') + 1, datetime.indexOf('.'));
	document.getElementById(half).innerHTML += append + time;					
}

const ourpass = document.getElementById("ourpass");
ourpass.addEventListener("click", ourpassEvent);
function ourpassEvent() {// seelect the goal scorer from players
    addEvent("ourpass", []);
}

const theirpass = document.getElementById("theirpass");
theirpass.addEventListener("click", theirpassEvent);
function theirpassEvent() {// seelect the goal scorer from players
    addEvent("theirpass", []);
}

const shot = document.getElementById("shot");
shot.addEventListener("click", shotEvent);
function shotEvent() {// seelect the goal scorer from players
	playerEvent('shot', 'shooter', true);
}

const goal = document.getElementById("goal");
goal.addEventListener("click", goalEvent);
function goalEvent() {// seelect the goal scorer from players
	playerEvent('goal', 'scorer', true);
}

const assist = document.getElementById("assist");
assist.addEventListener("click", assistEvent);
function assistEvent() {// seelect the goal scorer from players
	playerEvent('assist', 'assister', false);
}

const cornerL = document.getElementById("cornerL");
cornerL.addEventListener("click", cornerLEvent);
function cornerLEvent() {// seelect the goal scorer from players
	playerEvent('cornerL', 'cornertakerL', true);
}

const throwinL = document.getElementById("throwinL");
throwinL.addEventListener("click", throwinLEvent);
function throwinLEvent() {// seelect the goal scorer from players
	playerEvent('throwinL', 'throwintakerL', true);
}

const cornerR = document.getElementById("cornerR");
cornerR.addEventListener("click", cornerREvent);
function cornerREvent() {// seelect the goal scorer from players
	playerEvent('cornerR', 'cornertakerR', true);
}

const throwinR = document.getElementById("throwinR");
throwinR.addEventListener("click", throwinREvent);
function throwinREvent() {// seelect the goal scorer from players
	playerEvent('throwinR', 'throwintakerR', true);
}

const penalty = document.getElementById("penalty");
penalty.addEventListener("click", penaltyEvent);
function penaltyEvent() {// seelect the goal scorer from players
	playerEvent('penalty', 'penaltytaker', true);
}

const substitute = document.getElementById("substitute");
substitute.addEventListener("click", substituteEvent);
function substituteEvent() {// seelect the goal scorer from players
	playerEvent('substitute', 'substituteoff', false);
}

const yellowcard = document.getElementById("yellowcard");
yellowcard.addEventListener("click", yellowcardEvent);
function yellowcardEvent() {// seelect the goal scorer from players
	playerEvent('yellowcard', 'yellowcarder', true);
}

const redcard = document.getElementById("redcard");
redcard.addEventListener("click", redcardEvent);
function redcardEvent() {// seelect the goal scorer from players
	playerEvent('redcard', 'redcarder', true);
}

const extract = document.getElementById("export");
extract.addEventListener("click", extractEvent);
function extractEvent() {// seelect the goal scorer from players
	var d = new Date();
	var datetime = d.toISOString();
	var date = datetime.substring(0,datetime.indexOf('T'));
	var body = format(events);
	window.open('mailto:alistairkewing@yahoo.co.uk?subject=results ' + date + '&body=' + body);
}

function format(events){
	var output = '';
	for ( i = 0; i < events.length; i++){
		output += events[i][0] + ',' + events[i][1] + ',[' + events[i][2].join(',') + ']%0A';
	}
	return(output);
}

function playerEvent(evt, name, opposition){
	var playerlist = [];
	for (i = 0; i < playing.length; i++){
		var playerSummary = '';				
		var player = playing[i];
		if ( summary[evt] ){
			if ( summary[evt][player] ){
				playerSummary = '&nbsp;[' + summary[evt][player] + ']';
			}
		}
		playerlist.push('<span class="button" onclick="' + name + 'Event(this);" id="' + player + '">' + player + playerSummary + '</span>');
	}
	if (opposition){ playerlist.push('<span class="button" onclick="' + name + 'Event(this);" id="opposition">opposition</span>') };
	document.getElementById('playing').innerHTML = '<form class="button" name="' + name + 's">' + playerlist.join('<span class="button"> | </span>') + '</form>';
}

function subsEvent(event, playeroff){

	var subslist = [];
	for (i = 0; i < subs.length; i++){
		var sub = subs[i];
		subslist.push('<span class="button" onclick="' + event + 'Event(this);" id="' + sub + '_' + playeroff + '">' + sub + '</span>');
	}
	document.getElementById('subs').innerHTML = '<form name="' + event + 's">' + subslist.join('<span class="button"> | </span>') + '</form>';
}

function shooterEvent() {
    addEvent("shot", [event.target.id]);
	updatePlayers();
}
	
function scorerEvent() {
    addEvent("goal", [event.target.id]);
	updatePlayers();
	updateScore();
}
	
function assisterEvent() {
    addEvent("assist", [event.target.id]);
	updatePlayers();
}
	
function penaltytakerEvent() {
    addEvent("penalty", [event.target.id]);
	updatePlayers();
}

function cornertakerLEvent() {
    addEvent("cornerL", [event.target.id]);
	updatePlayers();
}

function throwintakerLEvent() {
    addEvent("throwinL", [event.target.id]);
	updatePlayers();
}

function cornertakerREvent() {
    addEvent("cornerR", [event.target.id]);
	updatePlayers();
}

function throwintakerREvent() {
    addEvent("throwinR", [event.target.id]);
	updatePlayers();
}

function redcarderEvent() {
    addEvent("redcard", [event.target.id]);
	updatePlayers();
}

function yellowcarderEvent() {
    addEvent("yellowcard", [event.target.id]);
	updatePlayers();
}

function substituteoffEvent() {
	var playeroff = event.target.id;
	updatePlayers();
	subsEvent('substituteon', playeroff);
}

function substituteonEvent() {
	[playeron, playeroff] = event.target.id.split("_");
	removePlayer(playing, playeroff);
	addPlayer(subs, playeroff);
	removePlayer(subs, playeron);
	addPlayer(playing, playeron);
    addEvent("substitute", [playeron, playeroff]);
	updatePlayers();
}

function removePlayer(array, player){
	array.splice(array.indexOf(player), 1);
}

function addPlayer(array, player){
	array.push(player);
}

function updatePlayers(){
	var currentPlaying = [];
	var currentSubs = [];
	for (i = 0; i < playing.length; i++){
		var player = playing[i];
		currentPlaying.push( '<span class="button">(' + gametime(player) + ')&nbsp;' + player + '</span>');
	}
	for (i = 0; i < subs.length; i++){
		var sub = subs[i];
		currentSubs.push( '<span class="button">(' + gametime(sub) + ')&nbsp;' + sub + '</span>');
	}
	document.getElementById('playing').innerHTML = currentPlaying.join('<span class="button"> | </span>');
	if ( subs.length == 0 ){
		document.getElementById('subs').innerHTML = 'No subs';
	} else {
		document.getElementById('subs').innerHTML = currentSubs.join('<span class="button"> | </span>');
	}
}

function generateSummary(){
	var summary = '';
	summary = '<table>'
		+ '<tr><td>Start time</td><td>' + startDatetime + '</td></tr>'
		+ '<tr><td>End time</td><td>' + endDatetime + '</td></tr>'
	    + 'Final playing: ' + playing.join(",") + '<br/>' +
	    + 'Final subs: ' + subs.join(",");
	document.getElementById('summary').innerHTML = summary;			
}

function addEvent(event, data){
	var mydatetime = datetime();
	events.push([mydatetime, event, data]);
	var firstPlayer = data[0];
	if ( summaryEvents.indexOf(event) > -1 ){
		if ( summary[event] ){
			if ( summary[event][firstPlayer] ){
				summary[event][firstPlayer] ++;
			} else {
				summary[event][firstPlayer] = 1;		
			}
		} else {
			summary[event] = [];
			summary[event][firstPlayer] = 1;		
		}
	}
	
	console.log('datetime=' + mydatetime + ' event=' + event + ' data=' + data.join(","));
}

function datetime(){
	var d = new Date();
	return(d.toISOString());	
}

function displayToggle(divArray) {
	for (i = 0; i < divArray.length; i++){
		var element = document.getElementById(divArray[i]);
		if (element.style.display === "none") {
			element.style.display = "block";
		} else {
			element.style.display = "none";
		}
	}
}

function displayOnOff(divOn, divOff) {
	var elementOn = document.getElementById(divOn);
	elementOn.style.display = "block";
	var elementOff = document.getElementById(divOff);
	elementOff.style.display = "block";
}

function disabledToggle(divArray) {
	for (i = 0; i < divArray.length; i++){
		var element = document.getElementById(divArray[i]);
		if (element.disabled === true) {
			element.disabled = false;
		} else {
			element.disabled = true;
		}
	}
}

function updateGametime(){
	if ( ! document.getElementById('endfirsthalf').disabled || ! document.getElementById('endgame').disabled ){
		for ( i = 0; i < playing.length; i++){
			var player = playing[i];
			if ( summary['gametime'] ){
				if ( summary['gametime'][player]){
					summary['gametime'][player] += timeAccuracy / 60;
				} else {
					summary['gametime'][player] = timeAccuracy / 60;					
				}
			} else {
				summary['gametime'] = [];
				summary['gametime'][player] = timeAccuracy / 60;					
			}
		}
	}
	updatePlayers();
}

function gametime(player){
	if ( summary['gametime'] ){
		if ( summary['gametime'][player] ){
			return(Math.round(summary['gametime'][player]));
		} else {
			return(0);
		}
	} else {
		return(0);
	}
}

function updateScore(){
	if ( summary['goal'] ){
		var theirScore = 0;
		var ourScore = 0;
		var ourScorers = [];
		for ( key in summary['goal']){
			if ( key == 'opposition' ){
				theirScore += summary['goal'][key];
			} else {
				ourScore += summary['goal'][key];
				ourScorers.push(' ' + key + ' [' + summary['goal'][key] + ']');
			}
		}
	} else {
		theirScore = 0;
		ourScore = 0;
		ourScorers = [];
	}
	document.getElementById('score').innerHTML = ourScore + '-' + theirScore + ' (' + ourScorers.join(',') + ' )';
}