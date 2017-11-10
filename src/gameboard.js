import constants from './constants';
import utils from './utils';

export default class Gameboard {
	
	static create(units) {

		let gameboard = {
			board: []
		};

		for(let i = 0; i < constants.BOARD_SPACES_X; i++) {
			let column = [];
			for(let j = 0; j < constants.BOARD_SPACES_Y; j++) {
				column.push(0);
			}
			gameboard.board.push(column);
		}

		Gameboard.populate(gameboard, units);

		return gameboard;

	}

	static populate(gameboard, units) {

		units = utils.shuffle(units);
		
		// get the columns that have room in them
		let columns = [];
		for(let i = 0; i < gameboard.board.length; i++) {
			let column = gameboard.board[i];
			if(column[column.length - 1] === 0) {
				columns.push(i);
			}
		}
		
		let unit;
		while(unit = units.pop()) {

			// pick a random column
			let random_index = Math.floor(Math.random() * columns.length);
			let column_index = columns[random_index];
			let column = gameboard.board[column_index];
			
			// add the unit to the column
			let index = Gameboard.addUnitToColumn(gameboard, column_index, unit);
			
			if(index === -1) {
				// uh oh - column is full
				columns.splice(random_index, 1);
				units.unshift(unit);
			} else if(Gameboard.checkPositionForCombo(gameboard, column_index, index)) {
				// there's a conflict - remove and try again
				Gameboard.removeUnitFromColumn(gameboard, column_index);
				units.unshift(unit);
			} else {
				// check if the column is now full
				if(index + 1 === constants.BOARD_SPACES_Y) {			
					columns.splice(random_index, 1);
				}
			}
		
		}

	}

	static checkPositionForCombo(gameboard, x, y) {

		let unit = Gameboard.getUnitAt(gameboard, x, y);

		let up_one = Gameboard.getUnitAt(gameboard, x, y - 1) === unit;
		let up_two = Gameboard.getUnitAt(gameboard, x, y - 2) === unit;
		
		let left_one = Gameboard.getUnitAt(gameboard, x - 1, y) === unit;
		let left_two = Gameboard.getUnitAt(gameboard, x - 2, y) === unit;
		
		let right_one = Gameboard.getUnitAt(gameboard, x + 1, y) === unit;
		let right_two = Gameboard.getUnitAt(gameboard, x + 2, y) === unit;
		
		if((up_one && up_two) || (left_one && left_two) || (right_one && right_two) || (left_one && right_one)) {
			return true;
		}
		
		return false;

	}

	static getUnitAt(gameboard, x, y) {
		if(x < 0 || x >= constants.BOARD_SPACES_X || y < 0 || y >= constants.BOARD_SPACES_Y) return 0;
		return gameboard.board[x][y];
	}

	static getColumnOpenIndex(gameboard, column_index) {
		let column = gameboard.board[column_index];
		if(column[column.length - 1] !== 0) return -1;
		for(let i = column.length - 2; i >= -1; i--) {
			if(i === -1 || column[i] !== 0) {
				return i + 1;			
			}
		}
		return -1;
	}

	static addUnitToColumn(gameboard, column_index, unit) {
		let index = Gameboard.getColumnOpenIndex(gameboard, column_index);
		let column = gameboard.board[column_index];
		if(index > -1) column[index] = unit;
		return index;
	}

	static removeUnitFromColumn(gameboard, column_index) {
		
		let column = gameboard.board[column_index];
		let index = Gameboard.getColumnOpenIndex(gameboard, column_index);

		// short out if the column is empty
		if(index === 0) return 0;
		
		// special case for full column
		if(index === -1) index = (column.length);
		
		index--;
		let unit = column[index];
		column[index] = 0;

		return unit;

	}

	static draw(gameboard, x, y, flip, colors, context) {
		for(let i = 0; i < gameboard.board.length; i++) {
			for(let j = 0; j < gameboard.board[i].length; j++) {
				let unit = gameboard.board[i][j];
				if(unit === 0) break;
				let _x = x + (constants.PADDING * (i + 1)) + (constants.UNIT_WIDTH * i);
				let _y = y + (constants.PADDING * (j + 1)) + (constants.UNIT_HEIGHT * j);
				if(flip) {
					_x = constants.SIDE_WIDTH - _x - constants.UNIT_WIDTH;
					_y = constants.SIDE_HEIGHT - _y - constants.UNIT_HEIGHT;
				}
				context.fillStyle = colors[unit - 1];
				context.fillRect(_x, _y, constants.UNIT_WIDTH, constants.UNIT_HEIGHT);
			}
		}
	}

}