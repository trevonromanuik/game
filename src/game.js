import clone from 'fast-clone';

import constants from './constants';
import Gameboard from './gameboard';
import PlayerInstance from './player_instance';

export default class Game {

    constructor(player_1, player_2) {

        // create the players
        this.player_1 = new PlayerInstance(this, player_1, 0, constants.SIDE_HEIGHT, false);
        this.player_2 = new PlayerInstance(this, player_2, 0, 0, true);

        // state management
        this.live_state = {
            cur_player: this.player_1.id,
            pressed_keys: {}
        };

        this.prev_state = clone(this.live_state);
        this.state = clone(this.live_state);

        window.addEventListener('keyup', (e) => {
            delete this.live_state.pressed_keys[e.keyCode];
        });
        
        window.addEventListener('keydown', (e) => {
            this.live_state.pressed_keys[e.keyCode] = true;
        });

    }

    keyDown(key) {
        return !!(!this.prev_state.pressed_keys[key] &&
            this.state.pressed_keys[key]);
    }

    update(progress) {

        this.prev_state = clone(this.state);
        this.state = clone(this.live_state);

        if(this.keyDown(constants.KEYS.ENTER)) {
            this.live_state.cur_player = (this.live_state.cur_player === this.player_1.id) ?
                this.player_2.id : this.player_1.id;
            this.state.cur_player = (this.state.cur_player === this.player_1.id) ?
                this.player_2.id : this.player_1.id;
        }

        this.player_1.update();
        this.player_2.update();

    }

    draw(context) {

        context.fillStyle = 'lightgrey';
        context.fillRect(0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT)
    
        context.fillStyle = 'black';
        context.fillRect(0, constants.SIDE_HEIGHT - 1, constants.SIDE_WIDTH, 2);
    
        this.player_1.draw(context);
        this.player_2.draw(context);

    }

}