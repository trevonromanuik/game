import constants from './constants';
import Game from './game';
import Player from './player';

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

canvas.width = constants.SCREEN_WIDTH;
canvas.height = constants.SCREEN_HEIGHT;

import player_1_data from './data/player_1'
let player_1 = new Player(player_1_data);

import player_2_data from './data/player_2';
let player_2 = new Player(player_2_data);

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
