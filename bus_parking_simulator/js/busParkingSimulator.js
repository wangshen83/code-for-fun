//all commands
const commands = ["PLACE", "MOVE", "LEFT", "RIGHT", "REPORT"];
//all positions
const positions = {
	EAST : 0,
	SOUTH : 1,
	WEST : 2,
	NORTH : 3
};
//parking dimension
const cols = 5;
const rows = 5;

let firstCommand = true;
let isValid = false;
	
//validate the input command
let validateInputCommand = function(inputVal){
	inputVal = inputVal.trim();
	let validatePlaceCommand = function(val){
		let regexp = /PLACE\s*\d,\s*\d\s*,\s*\b(EAST|SOUTH|WEST|NORTH)\b/g;
		return regexp.test(val);
	};
	if(firstCommand){
		if(inputVal.indexOf(commands[0]) === -1){
			showError("The command is not valid, the first command should be the PLACE");
			return false;
		}else{
			if(!validatePlaceCommand(inputVal)){
				showError("The PLACE command is not valid");
				return false;
			}
		}
	}else{
		if(inputVal.indexOf(commands[0]) !== -1){
			if(!validatePlaceCommand(inputVal)){
				showError("The PLACE command is not valid");
				return false;
			}
		}else{
			let commandsWithoutPlace = commands.slice(1);
			if(!commandsWithoutPlace.includes(inputVal)){
				showError("The command is not valid");
				return false;
			}
		}
	}
	return true;
};
	
//Split the place command
let splitPlaceCommand = (inputCommand) => {
    let placePos = inputCommand.trim().indexOf(commands[0]);
    let inputPositions;
	if(placePos !== -1){
		inputPositions = inputCommand.substr(placePos + 5).replace(/\s+/g, "").split(",");
		if(inputPositions[0] === ""){
			showError("Please enter the correct PLACE command");
			return;
		}
	}
	return {
		command: commands[0],
		inputPositions: inputPositions
	};
}

//The bus object
let bus = (function(){
	let x = 0;
	let y = 0;
	let position = 0;
		
	//place the bus at certain position
	let place = (newX, newY, newPosition) => {
		//if the first place is not within the parking place, show error
		isValid = newX >= 0 && newY >= 0 && newX < cols && newY < rows;
		if(!isValid){
			showError("Please PLACE within the parking place");
			return;
		}
		x = newX;
		y = newY;
		position = newPosition;
	};
		
	//move the bus to certain place
	let move = () => {
		let obj = {
			x: x, 
			y: y, 
			position: position
		};
		//based on different positions, add or deduct the x or y
		if(position === positions.EAST){
			obj.x++;
		}else if(position === positions.NORTH){
			obj.y++; 
		}else if(position === positions.WEST){
			obj.x--;
		}else if(position === positions.SOUTH){
			obj.y--;
		}
		//judge whether the move is ok, have to within the parking place
		isValid = obj.x >= 0 && obj.y >= 0 && obj.x < cols && obj.y < rows;
		if (isValid) {
			x = obj.x;
			y = obj.y;
		}else{
			showError("Please move within the parking place");
			return;
		}
	};
	
    //turn right	
	let right = () => {
		position = (position + 1) % 4;
		isValid = true;
	};

	//turn left
	let left = () => {
		position = (position + 3) % 4;
		isValid = true;
	};
	
    //report the bus position	
	let report = () => {
		let positionKey = Object.keys(positions)[position];
		$("#result").show();
		$("#error").hide();
		$("#result").html("The new position is: " + x + ", " + y + ", " + positionKey);
		isValid = true;
	};
			
	return {
		place: place,
		move: move,
		right: right,
		left: left,
		report: report
	};
})();
	
//execute the command
let executeCommand = (commandVal) => {
	let pos = commandVal.indexOf(commands[0]);
	let placePositions;
	if(pos !== -1){
		let splittedPlaceCommand = splitPlaceCommand(commandVal);
		if(splittedPlaceCommand){
			commandVal = splittedPlaceCommand.command;
			placePositions = splittedPlaceCommand.inputPositions;
		}else{
			return;
		}
	}
	if(commandVal === "PLACE"){
		bus.place(parseInt(placePositions[0], 10), parseInt(placePositions[1], 10), parseInt(positions[placePositions[2]], 10));
	}else if(commandVal === "MOVE"){
		bus.move();
	}else if(commandVal === "LEFT"){
		bus.left();
	}else if(commandVal === "RIGHT"){
		bus.right();
	}
	return true;
}
	
let printResult = () => {
	bus.report();
};
	
let showError = (msg) => {
	$("#error").show();
	$("#result").hide();
	$("#error").html(msg);
};

//the simulator
let busParkingSimulator = () => {
	console.log("begin the process");
	
	$("#result").hide();
	$("#error").hide();
	//enter event
	$("#command").keypress((event) => {
		let keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode === 13){
			$("#add").trigger("click");
			return false;
		}
	});
	
	//first validate the command, then execute it, add it to command list and output the result if the command is "report"
	$("#add").click(() => {
		let inputVal = $("#command").val();
		inputVal = inputVal.toUpperCase();
		if(validateInputCommand(inputVal)){
			firstCommand = false;
			$("#error").hide();
			executeCommand(inputVal);
			if(inputVal === commands[4]){
				printResult();
			}
			if(isValid)
				addCommandList(inputVal);
		}
		$("#command").val("");
	});
	
	let addCommandList = (value) => {	
		$('#commandList').append($("<option>", {
			text: value
		}));
	};
}
$(document).ready(busParkingSimulator);
