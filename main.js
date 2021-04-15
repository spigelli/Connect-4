

const DEBUG = false
const SELECTED_CELL = null
PLACE_MODE = false
WINNER = false
PLAYER = 1

window.onload = function () {
  //Teleport to the start point when the game loads:
  setup_table();
  setup_selected_cell();
  if(DEBUG == true){
	setup_debug_selectors();
  }
  else {
	document.getElementById("debug_selectors").innerHTML = "";
  }
}


//Respawn if the player is below the screens view or it dies by an obstacle
setInterval(function () {
});

setup_table = function () {
	table = document.getElementById("board_table");
	[].slice.call(table.children).forEach(tbody => {
		[].slice.call(tbody.children).forEach(row => {
			[].slice.call(row.children).forEach(cell => {
				cell.occupied = false;
				cell.addEventListener("click", () => {
					cell_click(cell.id, row.id);
				})
			})
		})
	})
}

// Setup functions
setup_selected_cell = function () {}

setup_debug_selectors = function (){
	red_selector = document.getElementById("red");
	yellow_selector = document.getElementById("yellow");
	red_selector.addEventListener("click", () => {
		start_checker_place("red")
		PLACE_MODE = "red";
	})
	yellow_selector.addEventListener("click", () => {
		start_checker_place("yellow")
		PLACE_MODE = "yellow";
	})
}

cell_click = function (x, y) {
	if (!WINNER) {
		DEBUG ? console.log(`Cell clicked ${x},${y}`) : '';
		document.getElementById("board_table").selected_cell = (x, y);
		if (!DEBUG) {
			if (PLAYER == 1) {
				PLACE_MODE = "red";
				document.getElementById("player_display").innerHTML = "Player 2's Move";
			}
			else {
				PLACE_MODE = "yellow";
				document.getElementById("player_display").innerHTML = "Player 1's Move";
			}
			(PLAYER == 1) ? PLAYER++:PLAYER--;
		}
		if (PLACE_MODE == "red" || PLACE_MODE == "yellow"){
			document.getElementById("selected_cell").innerHTML = `${x}${y}${PLACE_MODE[0]}`;
			DEBUG ? console.log(`Made cell ${x},${y} ${PLACE_MODE}`) : '';
			end_select_cell(x, y, PLACE_MODE);
		}
	}
}

start_checker_place = function (color){
	if (DEBUG) {
		color == "red" ? console.log("Placing red checker") : '';
		color == "yellow" ? console.log("Placing yellow checker") : '';
	}
}

end_select_cell = function (x, y, color) {
	DEBUG ? console.log("Finalizing select cell.") : '';
	place_cell(x, y, color);
	if (DEBUG) {
		color == "red" ? console.log(`Placed red checker at ${x},${y}`) : '';
		color == "yellow" ? console.log(`Placed yellow checker at ${x},${y}`) : '';
	}
	DEBUG ? console.log("End select cell") : '';
	PLACE_MODE = false;
}

place_cell = async function (x, y, color){
	if (get_cell_by_id(x, y).occupied) {
		DEBUG ? console.log("UserError: cannot place checker in occupied space") : '';
	}
	else {
		DEBUG ? console.log("Initiating cell drop") : '';
		while ((y >= 0 && !get_cell_by_id(x, y).occupied)){
			get_cell_by_id(x, `${parseInt(y)+1}`).innerHTML = "";
			get_cell_by_id(x, `${parseInt(y)+1}`).occupied = false;
			get_cell_by_id(x, y).innerHTML = color;
			get_cell_by_id(x, y).occupied = color;
			await sleep(100);
			y-=1;
		}
	}
	winner = check_win();
	WINNER = winner;
	if (winner == "red") {
		document.getElementById("player_display").innerHTML = "PLAYER 1 WINS!!";
		console.log("red wins");
	}
	else if (winner == "yellow") {
		document.getElementById("player_display").innerHTML = "PLAYER 2 WINS!!";
		console.log("yellow wins");
	}
}

check_win = function () {
	consecutive_yellow = 0;
	consecutive_red = 0;
	win = false;
	//Check Verticle
	if (!win) {
		for (x = 0; x < 7; x++){
			for (y = 0; y < 6; y++){
				if (get_cell_by_id(`${x}`, `${y}`).occupied == "red"){
					consecutive_red++;
				}
				else {
					consecutive_red = 0;
				}
				if (get_cell_by_id(`${x}`, `${y}`).occupied == "yellow"){
					consecutive_yellow++;
				}
				else {
					consecutive_yellow = 0;
				}
				if (consecutive_red == 4){
					win = "red";
					break;
				}
				if (consecutive_yellow == 4){
					win = "yellow";
					break;
				}
			}
			if (win != false) {
				break;
			}
			consecutive_red = 0;
			consecutive_yellow = 0;
		}
	}
	consecutive_yellow = 0;
	consecutive_red = 0;
	if (!win) {
		//Check Horizontal
		for (y = 0; y < 6; y++){
			for (x = 0; x < 7; x++){
				if (get_cell_by_id(`${x}`, `${y}`).occupied == "red"){
					consecutive_red++;
				}
				else {
					consecutive_red = 0;
				}
				if (get_cell_by_id(`${x}`, `${y}`).occupied == "yellow"){
					consecutive_yellow++;
				}
				else {
					consecutive_yellow = 0;
				}
				if (consecutive_red == 4){
					win = "red";
					break;
				}
				if (consecutive_yellow == 4){
					win = "yellow";
					break;
				}
			}
			if (win != false) {
				break;
			}
			consecutive_red = 0;
			consecutive_yellow = 0;
		}
	}
	consecutive_yellow = 0;
	consecutive_red = 0;
	if (!win) {
		//Check Diagonal Positive Incline
		for (y = 0; y < 6; y++){
			for (x = 0; x < 7; x++){
				win = check_win_diagonal_positive(x, y);
				if (win != false){
					break
				}
			}
			if (win != false) {
				break;
			}
			consecutive_red = 0;
			consecutive_yellow = 0;
		}
	}
	consecutive_yellow = 0;
	consecutive_red = 0;
	DEBUG ? console.log(`win = ${win}`) : '';
	if (!win) {
	//Check Diagonal Negative Incline
		for (y = 0; y < 6; y++){
			for (x = 0; x < 7; x++){
				win = check_win_diagonal_negative(x, y);
				DEBUG ? console.log(`win = ${win}`) : '';
				DEBUG ? console.log(`consecutive_red = ${consecutive_red}`) : '';
				DEBUG ? console.log(`consecutive_yellow = ${consecutive_yellow}`) : '';
				if (win != false){
					break
				}
			}
			if (win != false) {
				break;
			}
			consecutive_red = 0;
			consecutive_yellow = 0;
		}
	}
	return(win);
}

check_win_diagonal_positive = function(x, y){
	win = false;
	if (get_cell_by_id(`${x}`, `${y}`).occupied == "red"){
		consecutive_red++;
		if (x <= 3 && y <= 2){
			for (i = 1; i <= 3; i++){
				if (get_cell_by_id(`${x+i}`, `${y+i}`).occupied == "red"){
					consecutive_red++;
				}
			}
			if (consecutive_red == 4){
				return("red");
			}
			else {
				consecutive_red = 0;
			}
		}
	}
	if (get_cell_by_id(`${x}`, `${y}`).occupied == "yellow"){
		consecutive_yellow++;
		if (x <= 3 && y <= 2){
			for (i = 1; i <= 3; i++){
				if (get_cell_by_id(`${x+i}`, `${y+i}`).occupied == "yellow"){
					consecutive_yellow++;
				}
			}
			if (consecutive_yellow == 4){
				return("yellow");
			}
			else {
				consecutive_yellow = 0;
			}
		}
	}
	return(win);
}

check_win_diagonal_negative = function (x, y) {
	DEBUG ? console.log("Checking diagonal negative win") : '';
	if (get_cell_by_id(`${x}`, `${y}`).occupied == "red" && x <= 3 && y >= 3){
		consecutive_red = 1;
		for (i = 1; i <= 3; i++){
			if (get_cell_by_id(`${x+i}`, `${y-i}`).occupied == "red"){
				consecutive_red++;
			}
		}
		if (consecutive_red == 4) {
			return("red");
		}
	}
	if (get_cell_by_id(`${x}`, `${y}`).occupied == "yellow" && x <= 3 && y >= 3){
		consecutive_yellow = 1;
		for (i = 1; i <= 3; i++){
			if (get_cell_by_id(`${x+i}`, `${y-i}`).occupied == "yellow"){
				consecutive_yellow++;
			}
		}
		if (consecutive_yellow == 4) {
			return("yellow");
		}
	}
	return(false);
}

get_cell_by_id = function (x, y){
	if(y==6){
		y=5;
	}
	table = document.getElementById("board_table");
	tbody = table.children[0]
	row = tbody.children[5-parseInt(y)];
	cell = row.children.item(x);
	return(cell);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
