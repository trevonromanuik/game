import constants from './constants';
import Game from './game';

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

canvas.width = constants.SCREEN_WIDTH;
canvas.height = constants.SCREEN_HEIGHT;

import player_1 from './data/player_1'
import player_2 from './data/player_2';

let game = new Game(player_1, player_2);

let last_render = 0;
function loop(timestamp) {
	let progress = timestamp - last_render;
	game.update(progress);
	game.draw(context);
	last_render = timestamp;
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
