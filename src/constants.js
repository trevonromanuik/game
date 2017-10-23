let constants = {
	BOARD_SPACES_X: 6,
	BOARD_SPACES_Y: 6,
	PADDING: 5,
	UNIT_WIDTH: 32,
	UNIT_HEIGHT: 32,
	KEYS: {
		ENTER: 13,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	}
};

// add the computed fields
Object.assign(constants, {
	BOARD_WIDTH: (() => {
		return (constants.PADDING * (constants.BOARD_SPACES_X + 1)) + (constants.UNIT_WIDTH * constants.BOARD_SPACES_X)
	})(),
	BOARD_HEIGHT: (() => {
		return (constants.PADDING * (constants.BOARD_SPACES_Y + 1)) + (constants.UNIT_HEIGHT * constants.BOARD_SPACES_Y)
	})()
});

Object.assign(constants, {
	SIDE_WIDTH: (() => {
		return constants.BOARD_WIDTH;
	})(),
	SIDE_HEIGHT: (() => {
		return constants.BOARD_HEIGHT + constants.UNIT_HEIGHT + constants.PADDING;
	})()
})

Object.assign(constants, {
	SCREEN_WIDTH: constants.BOARD_WIDTH,
	SCREEN_HEIGHT: (() => {
		return 2 * constants.SIDE_HEIGHT;
	})(),
});

export default constants;