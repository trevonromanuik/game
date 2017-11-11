import clone from 'fast-clone';

import constants from './constants';
import Gameboard from './gameboard';
import PlayerInstance from './player_instance';

export default class Game {

    constructor(player_1, player_2) {

        // create the player instances
        player_1 = PlayerInstance.create(player_1, 0, constants.SIDE_HEIGHT, false);
        player_2 = PlayerInstance.create(player_2, 0, 0, true);

        this.player_1_canvas = document.createElement('canvas');
        // this.player_1_canvas = document.getElementById('canvas_1');
        this.player_1_context = this.player_1_canvas.getContext('2d');

        this.player_1_canvas.width = constants.SIDE_WIDTH;
        this.player_1_canvas.height = constants.SIDE_HEIGHT;

        this.player_2_canvas = document.createElement('canvas');
        // this.player_2_canvas = document.getElementById('canvas_2');
        this.player_2_context = this.player_2_canvas.getContext('2d');

        this.player_2_canvas.width = constants.SIDE_WIDTH;
        this.player_2_canvas.height = constants.SIDE_HEIGHT;

        // state management
        this.state = {
            player_1,
            player_2,
            cur_player_id: player_1.id,
            cur_player_moves: 3,
            pressed_keys: {}
        };

        this.prev_state = clone(this.state);

        this.pressed_keys = {};

        window.addEventListener('keyup', (e) => {
            delete this.pressed_keys[e.keyCode];
        });
        
        window.addEventListener('keydown', (e) => {
            this.pressed_keys[e.keyCode] = true;
        });

    }

    update(progress) {

        console.log(JSON.stringify(this.state).length);

        this.prev_state = clone(this.state);

        this.state.pressed_keys = clone(this.pressed_keys);

        // update the players
        PlayerInstance.update(this.state.player_1, this.prev_state, this.state, progress);
        PlayerInstance.update(this.state.player_2, this.prev_state, this.state, progress);

        // figure out the current player
        let [prev_player, cur_player] = (this.state.cur_player_id === this.state.player_1.id) ?
            [this.prev_state.player_1, this.state.player_1] : 
            [this.prev_state.player_2, this.state.player_2];

        // check if the current player has moved a unit
        if(prev_player.grabbed_unit && !cur_player.grabbed_unit) {
            
            // check if they moved the unit to a different column
            if(prev_player.grabbed_index !== cur_player.cursor_index) {

                // decrement the number of player moves
                this.state.cur_player_moves--;

                // check if the number of remaining turns is 0
                if(this.state.cur_player_moves === 0) {
                    
                    // reset the number of player_moves
                    this.state.cur_player_moves = 3;
        
                    // swap the players
                    this.state.cur_player_id = (this.state.cur_player_id === this.state.player_1.id) ?
                        this.state.player_2.id : this.state.player_1.id;
        
                }

            }

        }      

    }

    draw(context) {

        context.save();

        // draw the board
        context.fillStyle = 'lightgrey';
        context.fillRect(0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT)
    
        // draw the line
        context.fillStyle = 'black';
        context.fillRect(0, constants.SIDE_HEIGHT - 1, constants.SIDE_WIDTH, 2);
    
        // draw the players
        context.save();
        this.player_1_context.clearRect(0, 0, this.player_1_canvas.width, this.player_1_canvas.height);
        PlayerInstance.draw(this.state.player_1, this.player_1_context);
        context.drawImage(this.player_1_canvas, 0, constants.SIDE_HEIGHT);
        context.restore();

        context.save();
        this.player_2_context.clearRect(0, 0, this.player_2_canvas.width, this.player_2_canvas.height);
        PlayerInstance.draw(this.state.player_2, this.player_2_context);
        context.translate(constants.SIDE_WIDTH, constants.SIDE_HEIGHT);
        context.scale(-1, -1);
        context.drawImage(this.player_2_canvas, 0, 0);
        context.restore();

        // draw the number of moves left
        context.font = '24px courier';
        context.textBaseline = 'hanging';
        context.fillText(this.state.cur_player_moves, 0, 0);

        context.restore();

    }

}