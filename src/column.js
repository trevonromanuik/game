import constants from './constants'

export default class Column {

	constructor() {
		this.rows = [];
		for(let i = 0; i < constants.BOARD_SPACES_Y; i++) {
			this.rows.push(0);
		}
	}

}