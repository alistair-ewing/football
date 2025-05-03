const squad = ["Leo", "Donald", "Cairn", "Sol", "Mason", "Billy", "Aaron", "Tom", "Zac", "Conor", "Angus", "Harris", "Elias", "Sami", "Saim", "Gavin", "Lewis", "Thomas"];
var players = squad;
var playing = [];
var subs = [];
var events = [];
var summary = [];
var playerEvents = ['passComplete', 'passIntercepted', 'passMissed', 'passPlayingOn', 'passHolding', 'shotOnTarget', 'shotMissed', 'tackleComplete', 'tackleMissed', 'goal', 'assist', 'penalty','yellowcard', 'redcard', 'substituteoff'];
var summaryEvents = ['shotOnTarget', 'shotMissed', 'goal', 'assist'];
var nonplayerEvents = ['freekick', 'cornerOurs', 'cornerTheirs', 'throwinOurs', 'throwinTheirs'];
var timeAccuracy = 30; 
var oppositionLabel = 'Opposition';

var startDatetime = "";
var endDatetime = "";

// start game button disabled till starting 11 selected
disabledToggle(['endfirsthalf','startsecondhalf','endgame']);
openTab(event,'squad_section');

// keep track of game time
setInterval(updateGametime, timeAccuracy * 1000);

// seelect the players and subs from the squad 
var squadlist = '<table><tr><td>Player</td><td>Playing</td><td>Sub</td></tr>';
for (i = 0; i < squad.length; i++){
	var player = squad[i];
	squadlist += '<tr><td>' + player + '</td><td class="s3"><button class="w3-button w3-green" id="player_' + player + '" onclick="switchValue(\'player_' + player + '\', \'Playing\', \'Not Playing\', \'green\', \'red\');">Playing</button></td>'
	 + '<td class="s3"><button class="w3-button w3-blue" id="sub_' + player + '" onclick="switchValue(\'sub_' + player + '\', \'Starting\', \'Sub\', \'blue\', \'light-blue\');">Starting</button></td></tr>'
	
}
squadlist += '<tr><td>TOTAL</td><td><div id="totalplaying"/>' + players.length + '</td><td><div id="totalsubs"/>' + subs.length + '</td></tr></table>';
if (document.getElementById('squadlist')) {
    document.getElementById('squadlist').innerHTML = squadlist;
}

function switchValue(player, from, to, from_colour, to_colour){
	if ( document.getElementById(player) ){

		var element = document.getElementById(player);
		
		if ( element.innerHTML == from ){
			element.innerHTML = to;
		} else {
			element.innerHTML = from;
		}
	
		if ( element.className.indexOf(from_colour) > -1 ){
			element.className = element.className.replace(from_colour, to_colour);
		} else {
			element.className = element.className.replace(to_colour, from_colour);			
		}
	
	} else {
		alert('couldnt find ' + type + ', ' + player);
	}
	updateStartgame();
}

function updateStartgame(){
	players = [];
	subs = [];
	for ( i = 0; i < squad.length; i++ ){
		var player = squad[i];
		if ( document.getElementById('player_' + player) ){
			if ( document.getElementById('player_' + player).innerHTML == 'Playing' ){
				players.push(player);
			}
		} else {
			alert('Couldnt find: player_' + player);
		}
		if ( document.getElementById('sub_' + player) ){
			if ( document.getElementById('sub_' + player).innerHTML == 'Sub' ){
				subs.push(player);
			}
		} else {
			alert('Couldnt find: aub_' + player);
		}
	}

	document.getElementById('totalplaying').innerHTML = players.length;	
	document.getElementById('totalsubs').innerHTML = subs.length;			

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
		if ( document.getElementById('player_' + squad[i]).innerHTML == 'Playing' ){
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
	document.getElementById('game_section_tab').disabled = '';
	document.getElementById('summary_section_tab').disabled = '';
	openTab(event,'game_section');
	disabledToggle(['startgame','endfirsthalf']);
	if ( subs.length == 0 ){ disabledToggle(['substitute'])}
	updateHalf('firsthalf', startDatetime, '');
	updatePlayers();
	updateGameSummary();
}

const endgame = document.getElementById("endgame");
endgame.addEventListener("click", endGameEvent);
function endGameEvent() {
	endDatetime = datetime();
    addEvent("endGame", playing);
	displayToggle(['summary_section']);
	disabledToggle(['endgame']);
	openTab(event,'summary_section');
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

for ( i = 0; i < nonplayerEvents.length; i++ ){
	var evt = nonplayerEvents[i];
	if ( document.getElementById(evt) ){
		var element = document.getElementById(evt);
		element.addEventListener("click", triggerNonPlayerEvent);	
	} else {
		alert('Couldnt find ' + evt);
	}
}
function triggerNonPlayerEvent() {
	addEvent(event.target.id, []);
}

for ( i = 0; i < playerEvents.length; i++ ){
	var evt = playerEvents[i];
	if ( document.getElementById(evt) ){
		var element = document.getElementById(evt);
		element.addEventListener("click", triggerPlayerEvent);
	} else {
		alert('Couldnt find ' + evt);
	}
}
function triggerPlayerEvent() {
	playerEvent(event.target.id, true);
	document.getElementById('players-modal').style.display = 'block';
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

function playerEvent(evt, opposition){
	var playerlist = ['<div class="w3-center w3-container">' + evt + '</div>'];
	for (i = 0; i < playing.length; i++){
		var player = playing[i];
		playerlist.push(updatePlayerEvent(player, evt));
	}
	if ( evt != 'substituteoff' ) { playerlist.push(updatePlayerEvent(oppositionLabel, evt)); }
	document.getElementById('players-modal').innerHTML = 
		'<div class="w3-modal-content">' + 
		'	<div class="w3-container">' +
		'		<span onclick="document.getElementById(\'players-modal\').style.display=\'none\'"' +
		'			class="w3-button w3-display-topright">&times;</span>' +
		'		<div id="player-selection">' + playerlist.join('<br/>') + '</div>' + 
		'	</div>' +
		'</div>';
	document.getElementById('players-modal').style.display = 'block';
}

function updatePlayerEvent(player, evt){
	return('<span class="w3-button ' + ( player == oppositionLabel ? 'w3-blue opposition' : 'w3-indigo player' ) + '" onclick="recordEvent(\'' + evt + '\', \'' + player + '\');">' + player + getPlayerSummary(player, evt) + '</span>');
}

function getPlayerSummary(player, evt){
    var playerSummary = '';
	if ( summary[evt] ){
		if ( summary[evt][player] ){
			playerSummary = '&nbsp;[' + summary[evt][player] + ']';
		}
	}	
	return(playerSummary);
}

function eventEvent(player){
	var eventlist = ['<div class="w3-center w3-container">' + player + '</div>'];
	for (i = 0; i < playerEvents.length; i++){
		var evt = playerEvents[i];
		eventlist.push(updateEventEvent(player, evt));
	}
	document.getElementById('events-modal').innerHTML = 
					'<div class="w3-modal-content">' +
					'	<div class="w3-container">' +
					'		<span onclick="document.getElementById(\'events-modal\').style.display=\'none\'"' +
					'			class="w3-button w3-display-topright">&times;</span>' +
					'		<div id="event-selection">' + eventlist.join('<br/>') + '</div>' +
					'	</div>' +
					'</div>';;
	document.getElementById('events-modal').style.display = 'block';
}

function updateEventEvent(player, evt){
		if ( document.getElementById(evt) ){
			var evtDescription = document.getElementById(evt).innerHTML;
			return(
				'<span class="w3-button ' + ( player == oppositionLabel ? 'w3-blue opposition' : 'w3-indigo player' ) + 
				'" onclick="recordEvent(\'' + evt + '\', \'' + player + '\');">' + 
				evtDescription + getPlayerSummary(player, evt) + '</span>');
		} else {
			alert('Couldnt find ' + evt);
		}
}

function recordEvent(name, player){
	document.getElementById('players-modal').style.display = 'none';	
	document.getElementById('subs-modal').style.display = 'none';	
	document.getElementById('events-modal').style.display = 'none';	
	if ( name == 'substituteoff' ){
		
		var subslist = ['<div class="w3-center w3-container">Substitute On: ' + player + '</div>'];
		for (i = 0; i < subs.length; i++){
			var sub = subs[i];
			subslist.push('<span class="w3-button player active" onclick="recordEvent(\'substitute\', \'' + sub + '_' + player + '\');">' + sub + '</span>');
		}
		document.getElementById('subs-modal').innerHTML =
					'<div class="w3-modal-content">' +
					'	<div class="w3-container">' +
					'		<span onclick="document.getElementById(\'subs-modal\').style.display=\'none\'"' +
					'			class="w3-button w3-display-topright">&times;</span>' +
					'		<div id="sub-selection">' + subslist.join('<br/>') + '</div>' +
					'	</div>' +
					'</div>';
		document.getElementById('subs-modal').style.display = 'block';

	} else if ( name == 'substituteon' ){
		
		var subslist = ['<div class="w3-center w3-container">Substitute Off: ' + player + '</div>'];
		for (i = 0; i < playing.length; i++){
			var sub = players[i];
			subslist.push('<span class="w3-button player active" onclick="recordEvent(\'substitute\', \'' + player + '_' + sub + '\');">' + sub + '</span>');
		}
		document.getElementById('subs-modal').innerHTML = 
					'<div class="w3-modal-content">' +
					'	<div class="w3-container">' +
					'		<span onclick="document.getElementById(\'subs-modal\').style.display=\'none\'"' +
					'			class="w3-button w3-display-topright">&times;</span>' +
					'		<div id="sub-selection">' + subslist.join('<br/>') + '</div>' +
					'	</div>' +
					'</div>';
		document.getElementById('subs-modal').style.display = 'block';

	} else if ( name == 'substitute' ){
		[playeron, playeroff] = player.split("_");
		removePlayer(playing, playeroff);
		addPlayer(subs, playeroff);
		removePlayer(subs, playeron);
		addPlayer(playing, playeron);
		addEvent("substitute", [playeron, playeroff]);
		updatePlayers();
	} else {
		addEvent(name, [player]);
		updateGameSummary();
		if ( name == 'goal' ){
			updateScore();
		}
	}
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
		currentPlaying.push( displayPlayer(player) );
	}
	currentPlaying.push( displayPlayer(oppositionLabel) );
	for (i = 0; i < subs.length; i++){
		var sub = subs[i];
		currentSubs.push( '<span class="w3-button w3-light-blue player" id="' + sub + '" onclick="recordEvent(\'substituteon\', \'' + sub + '\');">' + sub + '</span>');
	}
	document.getElementById('playing').innerHTML = currentPlaying.join('<br/>');
	if ( subs.length == 0 ){
		document.getElementById('subs').innerHTML = 'No subs';
	} else {
		document.getElementById('subs').innerHTML = currentSubs.join('<br/>');
	}
}

function displayPlayer(player){
	return('<span class="w3-button ' + ( player == oppositionLabel ? 'w3-blue opposition' : 'w3-indigo player' ) + '" id="' + player + '" onclick="eventEvent(\'' + player + '\');">' + player + '</span>');
}

function updateGameSummary(){
	var playerSummary = "";
	playerSummary = '<table id="players"><tr><td>Name</td><td class="summary">Game time</td>';
	for (j = 0; j < summaryEvents.length; j++){
		var evt = summaryEvents[j];
		playerSummary += '<td class="summary">' + evt + '</td>';
	}
	playerSummary += '</tr>';
	for (i = 0; i < players.length; i++){
		var player = players[i];
		playerSummary += updatePlayerSummary(player);
	}
	playerSummary += updatePlayerSummary(oppositionLabel);
	playerSummary += '</table>';
	document.getElementById('players').innerHTML = playerSummary;
}

function updatePlayerSummary(player){
	var playerSummary = '<tr><td>' + player + '</td><td>' + gametime(player) + '</td>';
	for (j = 0; j < summaryEvents.length; j++){
		var evt = summaryEvents[j];
		playerSummary += '<td>' + getPlayerSummary(player, evt) + '</td>';
	}
	playerSummary += '</tr>';
	return(playerSummary);
}

function generateSummary(){
	var summary = '';
	summary = '<table>'
		+ '<tr><td>Start time</td><td>' + startDatetime + '</td></tr>'
		+ '<tr><td>End time</td><td>' + endDatetime + '</td></tr>'
	    + '<tr><td>Final playing:</td><td>' + playing.join(",") + '<br/></td></tr>' +
	    + '<tr><td>Final subs:</td><td>' + subs.join(",") + '</td></tr>'
		+ ' </table>';
	document.getElementById('summary').innerHTML = summary;			
}

function addEvent(event, data){
	var mydatetime = datetime();
	events.push([mydatetime, event, data]);
	var firstPlayer = data[0];
	if ( playerEvents.indexOf(event) > -1 ){
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
		if ( document.getElementById(divArray[i]) ){
			var element = document.getElementById(divArray[i]);
			if (element.style.display === "none") {
				element.style.display = "block";
			} else {
				element.style.display = "none";
			}			
		} else {
			alert('Couldnt find ' + divArray[i]);
		}
	}
}

function displayOnOff(divOn, divOff) {
	if ( document.getElementById(divOn) && document.getElementById(divOff) ){
		var elementOn = document.getElementById(divOn);
		elementOn.style.display = "block";
		var elementOff = document.getElementById(divOff);
		elementOff.style.display = "block";
	} else {
		alert('Couldnt find ' + divOn + ' or ' + divOff);
	}
}

function disabledToggle(divArray) {
	for (i = 0; i < divArray.length; i++){
		if ( document.getElementById(divArray[i]) ){
			var element = document.getElementById(divArray[i]);
			if (element.disabled === true) {
				element.disabled = false;
			} else {
				element.disabled = true;
			}
		} else {
			alert('Couldnt find ' + divArray[i]);
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
	updateGameSummary();
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
			if ( key == oppositionLabel ){
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

function openTab(evt, section) {
  var i, x, tablinks;
  x = document.getElementsByClassName('section');
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
  tablinks = document.getElementsByClassName('tablink');
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' w3-red', '');
  }
  document.getElementById(section).style.display = 'block';
  document.getElementById(section + '_tab').className += ' w3-red';
}