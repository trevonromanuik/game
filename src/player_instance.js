import utils from './utils';
import constants from './constants';
import Gameboard from './gameboard';

export default class PlayerInstance {

    static create(player, x, y, flip) {

        let player_instance = {};

        player_instance.id = utils.id();

        player_instance.player = player;
        player_instance.x = x;
        player_instance.y = y;
        player_instance.flip = flip;

        player_instance.hp = 30;
        player_instance.mp = 0;
        player_instance.gameboard = Gameboard.create([1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3]);

        player_instance.cursor_index = 0;
        player_instance.grabbed_unit = null;
        player_instance.grabbed_index = null;

        return player_instance;

    }

    static keyDown(prev_state, state, key) {
        return !!(!prev_state.pressed_keys[key] &&
            state.pressed_keys[key]);
    }

    static keyUp(prev_state, state, key) {
        return !!(prev_state.pressed_keys[key] &&
            !state.pressed_keys[key]);
    }

    static update(player_instance, prev_state, state, progress) {
        
        PlayerInstance.processInput(player_instance, prev_state, state, progress);

    }

    static processInput(player_instance, prev_state, state, progress) {
        
        if(state.cur_player_id !== player_instance.id) return;
        
        let left = PlayerInstance.keyDown(prev_state, state, constants.KEYS.LEFT);
        let right = PlayerInstance.keyDown(prev_state, state, constants.KEYS.RIGHT);
        let up = PlayerInstance.keyDown(prev_state, state, constants.KEYS.UP);
        let down = PlayerInstance.keyDown(prev_state, state, constants.KEYS.DOWN);

        if(player_instance.flip) {
            [left, right] = [right, left];
            [up, down] = [down, up];
        }

        if(left ^ right) {
            if(left) {
                if(player_instance.cursor_index > 0) {
                    player_instance.cursor_index--;
                }
            } else {
                if(player_instance.cursor_index < (constants.BOARD_SPACES_X - 1)) {
                    player_instance.cursor_index++;
                }
            }
        } else if(up ^ down) {
            if(up) {
                (() => {
                    // short out if the player hasn't grabbed a unit
                    if(!player_instance.grabbed_unit) return;
                
                    // add the unit to the column
                    let index = Gameboard.addUnitToColumn(player_instance.gameboard, player_instance.cursor_index, player_instance.grabbed_unit);
    
                    // short out if the column is full
                    if(index === -1) return;
    
                    player_instance.grabbed_unit = null;
                    player_instance.grabbed_index = null;
                })();
            } else {
                (() => {
                    // short out if the player already grabbed a unit
                    if(player_instance.grabbed_unit) return;
                    
                    // grab the last unit from the column
                    let unit = Gameboard.removeUnitFromColumn(player_instance.gameboard, player_instance.cursor_index);
                    
                    // short out if the column is empty
                    if(unit === 0) return;
                    
                    player_instance.grabbed_unit = unit;
                    player_instance.grabbed_index = player_instance.cursor_index;
                })();
            }
        }

    }
    
    static draw(player_instance, context) {

        Gameboard.draw(
            player_instance.gameboard, 
            player_instance.x,
            player_instance.y,
            player_instance.flip,
            player_instance.player.colors,
            context
        );

        // draw the grabbed unit
        if(player_instance.grabbed_unit) {

            let x = player_instance.x + constants.PADDING + (player_instance.cursor_index * (constants.PADDING + constants.UNIT_WIDTH));
            let y = player_instance.y + constants.PADDING + constants.BOARD_HEIGHT;
            
            if(player_instance.flip) {
                x = constants.SIDE_WIDTH - x - constants.UNIT_WIDTH;
                y = constants.SIDE_HEIGHT - y - constants.UNIT_HEIGHT;
            }

            context.fillStyle = player_instance.player.colors[player_instance.grabbed_unit - 1];
            context.fillRect(x, y, constants.UNIT_WIDTH, constants.UNIT_HEIGHT);

        }

        // draw the cursor
        let cursor_tip_x = player_instance.x + constants.PADDING + (player_instance.cursor_index * (constants.PADDING + constants.UNIT_WIDTH)) + (constants.UNIT_WIDTH / 2);
        let cursor_tip_y = player_instance.y + constants.PADDING + constants.BOARD_HEIGHT + (constants.UNIT_HEIGHT / 2);
        
        if(player_instance.flip) {
            cursor_tip_x = constants.SIDE_WIDTH - cursor_tip_x;
            cursor_tip_y = constants.SIDE_HEIGHT - cursor_tip_y;
        }

        context.fillStyle = 'black';
        context.beginPath();
        context.moveTo(cursor_tip_x, cursor_tip_y);
        if(player_instance.flip) {
            context.lineTo(cursor_tip_x + (constants.UNIT_WIDTH / 2), cursor_tip_y - (constants.UNIT_HEIGHT / 2));
            context.lineTo(cursor_tip_x - (constants.UNIT_WIDTH / 2), cursor_tip_y - (constants.UNIT_HEIGHT / 2));
        } else {
            context.lineTo(cursor_tip_x + (constants.UNIT_WIDTH / 2), cursor_tip_y + (constants.UNIT_HEIGHT / 2));
            context.lineTo(cursor_tip_x - (constants.UNIT_WIDTH / 2), cursor_tip_y + (constants.UNIT_HEIGHT / 2));
        }
        context.fill();

    }

}