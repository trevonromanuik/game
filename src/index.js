import constants from './constants';
import Gameboard from './gameboard';

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let player_1_colors = ['red', 'blue', 'purple'];
let player_2_colors = ['white', 'yellow', 'green'];

canvas.width = constants.SCREEN_WIDTH;
canvas.height = constants.SCREEN_HEIGHT;

let player_1_board = new Gameboard(0, constants.BOARD_HEIGHT, false, player_1_colors);
let player_2_board = new Gameboard(0, 0, true, player_2_colors);

console.log('made player boards');

player_1_board.populate([1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3]);
player_2_board.populate([1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3]);

console.log('populated player boards');

let player_1_cursor_index = 0;
let player_1_grabbed_unit = null;

setInterval(() => {

	context.fillStyle = 'lightgrey';
	context.fillRect(0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT)

	context.fillStyle = 'black';
	context.fillRect(0, constants.BOARD_HEIGHT - 1, constants.SCREEN_WIDTH, 2);

	player_1_board.draw(context);
	player_2_board.draw(context);

	// draw the grabbed unit
	if(player_1_grabbed_unit) {
				
		let x = constants.PADDING + (player_1_cursor_index * (constants.PADDING + constants.UNIT_WIDTH));
		let y = constants.PADDING + (2 * constants.BOARD_HEIGHT);
		
		context.fillStyle = player_1_colors[player_1_grabbed_unit - 1];
		context.fillRect(x, y, constants.UNIT_WIDTH, constants.UNIT_HEIGHT);
	
	}
	
	// draw the cursor
	let cursor_tip_x = constants.PADDING + (player_1_cursor_index * (constants.PADDING + constants.UNIT_WIDTH)) + (constants.UNIT_WIDTH / 2);
	let cursor_tip_y = constants.PADDING + (2 * constants.BOARD_HEIGHT) + (constants.UNIT_HEIGHT / 2);
	
	context.fillStyle = 'black';
	context.beginPath();
	context.moveTo(cursor_tip_x, cursor_tip_y);
	context.lineTo(cursor_tip_x + (constants.UNIT_WIDTH / 2), cursor_tip_y + (constants.UNIT_HEIGHT / 2));
	context.lineTo(cursor_tip_x - (constants.UNIT_WIDTH / 2), cursor_tip_y + (constants.UNIT_HEIGHT / 2));
	context.fill();
	
}, 100);

// add player input
window.addEventListener('keyup', (e) => {
	switch(e.keyCode) {
		case constants.KEYS.LEFT:
			if(player_1_cursor_index > 0) {
				player_1_cursor_index--;
			}
			break;
		case constants.KEYS.RIGHT:
			if(player_1_cursor_index < (constants.BOARD_SPACES_X - 1)) {
				player_1_cursor_index++;
			}
			break;
		case constants.KEYS.DOWN: {
			
			// short out if the player already grabbed a unit
			if(player_1_grabbed_unit) break;
			
			// grab the last unit from the column
			let unit = player_1_board.removeUnitFromColumn(player_1_cursor_index);
			
			// short out if the column is empty
			if(unit === 0) break;
			
			player_1_grabbed_unit = unit;
			
			break;
		}
			
		case constants.KEYS.UP: {
		
			// short out if the player hasn't grabbed a unit
			if(!player_1_grabbed_unit) break;
			
			// add the unit to the column
			let index = player_1_board.addUnitToColumn(player_1_cursor_index, player_1_grabbed_unit);
			
			// short out if the column is full
			if(index === -1) break;
			
			player_1_grabbed_unit = null;
			
			break;
		}
	}
}, false);