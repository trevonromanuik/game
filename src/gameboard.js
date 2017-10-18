import constants from './constants';
import utils from './utils';

export default class Gameboard {
	
	constructor(x, y, flip, colors) {
		
		this.x = x;
		this.y = y;
		this.flip = flip;
		this.colors = colors;

		this.board = [];
		for(let i = 0; i < constants.BOARD_SPACES_X; i++) {
			let column = [];
			for(let j = 0; j < constants.BOARD_SPACES_Y; j++) {
				column.push(0);
			}
			this.board.push(column);
		}

	}

	populate(units) {

		units = utils.shuffle(units);
		
		// get the columns that have room in them
		let columns = [];
		for(let i = 0; i < this.board.length; i++) {
			let column = this.board[i];
			if(column[column.length - 1] === 0) {
				columns.push(i);
			}
		}
		
		let unit;
		while(unit = units.pop()) {

			// pick a random column
			let random_index = Math.floor(Math.random() * columns.length);
			let column_index = columns[random_index];
			let column = this.board[column_index];
			
			// add the unit to the column
			let index = this.addUnitToColumn(column_index, unit);
			
			if(index === -1) {
				// uh oh - column is full
				columns.splice(random_index, 1);
				units.unshift(unit);
			} else if(this.checkPositionForCombo(column_index, index)) {
				// there's a conflict - remove and try again
				this.removeUnitFromColumn(column_index);
				units.unshift(unit);
			} else {
				// check if the column is now full
				if(index + 1 === constants.BOARD_SPACES_Y) {			
					columns.splice(random_index, 1);
				}
			}
		
		}

	}

	checkPositionForCombo(x, y) {

		let unit = this.getUnitAt(x, y);

		let up_one = this.getUnitAt(x, y - 1) === unit;
		let up_two = this.getUnitAt(x, y - 2) === unit;
		
		let left_one = this.getUnitAt(x - 1, y) === unit;
		let left_two = this.getUnitAt(x - 2, y) === unit;
		
		let right_one = this.getUnitAt(x + 1, y) === unit;
		let right_two = this.getUnitAt(x + 2, y) === unit;
		
		if((up_one && up_two) || (left_one && left_two) || (right_one && right_two) || (left_one && right_one)) {
			return true;
		}
		
		return false;

	}

	getUnitAt(x, y) {
		if(x < 0 || x >= constants.BOARD_SPACES_X || y < 0 || y >= constants.BOARD_SPACES_Y) return 0;
		return this.board[x][y];
	}

	getColumnOpenIndex(column_index) {
		let column = this.board[column_index];
		if(column[column.length - 1] !== 0) return -1;
		for(let i = column.length - 2; i >= -1; i--) {
			if(i === -1 || column[i] !== 0) {
				return i + 1;			
			}
		}
		return -1;
	}

	addUnitToColumn(column_index, unit) {
		let index = this.getColumnOpenIndex(column_index);
		let column = this.board[column_index];
		if(index > -1) column[index] = unit;
		return index;
	}

	removeUnitFromColumn(column_index) {
		
		let column = this.board[column_index];
		let index = this.getColumnOpenIndex(column_index);

		// short out if the column is empty
		if(index === 0) return 0;
		
		// special case for full column
		if(index === -1) index = (column.length);
		
		index--;
		let unit = column[index];
		column[index] = 0;

		return unit;

	}

	draw(context) {
		for(let i = 0; i < this.board.length; i++) {
			for(let j = 0; j < this.board[i].length; j++) {
				let unit = this.board[i][j];
				if(unit === 0) break;
				let x_pos = this.x + (constants.PADDING * (i + 1)) + (constants.UNIT_WIDTH * i);
				let y_pos = this.y + (constants.PADDING * (j + 1)) + (constants.UNIT_HEIGHT * j);
				if(this.flip) {
					x_pos = constants.BOARD_WIDTH - x_pos - constants.UNIT_WIDTH;
					y_pos = constants.BOARD_HEIGHT - y_pos - constants.UNIT_HEIGHT;
				}
				context.fillStyle = this.colors[unit - 1];
				context.fillRect(x_pos, y_pos, constants.UNIT_WIDTH, constants.UNIT_HEIGHT);
			}
		}
	}

}