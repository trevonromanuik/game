import utils from './utils';
import constants from './constants';
import Gameboard from './gameboard';

export default class PlayerInstance {

    constructor(game, player, x, y, flip) {
        
        this.id = utils.id();

        this.game = game;

        this.player = player;
        this.colors = this.player.colors;

        this.x = x;
        this.y = y;
        this.flip = flip;

        this.hp = 30;
        this.mp = 0;
        this.gameboard = new Gameboard(player, x, y, flip);
        this.gameboard.populate([1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3]);

        this.cursor_index = 0;
        this.grabbed_unit = null;

    }

    keyDown(key) {
        return !!(!this.game.prev_state.pressed_keys[key] &&
            this.game.state.pressed_keys[key]);
    }

    keyUp(key) {
        return !!(this.game.prev_state.pressed_keys[key] &&
            !this.game.state.pressed_keys[key]);
    }

    update(progress) {

        if(this.game.state.cur_player !== this.id) return;

        let left = this.keyDown(constants.KEYS.LEFT);
        let right = this.keyDown(constants.KEYS.RIGHT);
        let up = this.keyDown(constants.KEYS.UP);
        let down = this.keyDown(constants.KEYS.DOWN);

        if(this.flip) {
            let t;

            t = left;
            left = right;
            right = t;

            t = up;
            up = down;
            down = t;
        }

        if(left ^ right) {
            if(left) {
                if(this.cursor_index > 0) {
                    this.cursor_index--;
                }
            } else {
                if(this.cursor_index < (constants.BOARD_SPACES_X - 1)) {
                    this.cursor_index++;
                }
            }
        } else if(up ^ down) {
            if(up) {
                (() => {
                    // short out if the player hasn't grabbed a unit
                    if(!this.grabbed_unit) return;
                
                    // add the unit to the column
                    let index = this.gameboard.addUnitToColumn(this.cursor_index, this.grabbed_unit);
    
                    // short out if the column is full
                    if(index === -1) return;
    
                    this.grabbed_unit = null;
                })();
            } else {
                (() => {
                    // short out if the player already grabbed a unit
                    if(this.grabbed_unit) return;
                    
                    // grab the last unit from the column
                    let unit = this.gameboard.removeUnitFromColumn(this.cursor_index);
                    
                    // short out if the column is empty
                    if(unit === 0) return;
                    
                    this.grabbed_unit = unit;
                })();
            }
        }

    }
    
    draw(context) {
        
        this.gameboard.draw(context);

        // draw the grabbed unit
        if(this.grabbed_unit) {

            let x = this.x + constants.PADDING + (this.cursor_index * (constants.PADDING + constants.UNIT_WIDTH));
            let y = this.y + constants.PADDING + constants.BOARD_HEIGHT;
            
            if(this.flip) {
                x = constants.SIDE_WIDTH - x - constants.UNIT_WIDTH;
                y = constants.SIDE_HEIGHT - y - constants.UNIT_HEIGHT;
            }

            context.fillStyle = this.colors[this.grabbed_unit - 1];
            context.fillRect(x, y, constants.UNIT_WIDTH, constants.UNIT_HEIGHT);

        }

        // draw the cursor
        let cursor_tip_x = this.x + constants.PADDING + (this.cursor_index * (constants.PADDING + constants.UNIT_WIDTH)) + (constants.UNIT_WIDTH / 2);
        let cursor_tip_y = this.y + constants.PADDING + constants.BOARD_HEIGHT + (constants.UNIT_HEIGHT / 2);
        
        if(this.flip) {
            cursor_tip_x = constants.SIDE_WIDTH - cursor_tip_x;
            cursor_tip_y = constants.SIDE_HEIGHT - cursor_tip_y;
        }

        context.fillStyle = 'black';
        context.beginPath();
        context.moveTo(cursor_tip_x, cursor_tip_y);
        if(this.flip) {
            context.lineTo(cursor_tip_x + (constants.UNIT_WIDTH / 2), cursor_tip_y - (constants.UNIT_HEIGHT / 2));
            context.lineTo(cursor_tip_x - (constants.UNIT_WIDTH / 2), cursor_tip_y - (constants.UNIT_HEIGHT / 2));
        } else {
            context.lineTo(cursor_tip_x + (constants.UNIT_WIDTH / 2), cursor_tip_y + (constants.UNIT_HEIGHT / 2));
            context.lineTo(cursor_tip_x - (constants.UNIT_WIDTH / 2), cursor_tip_y + (constants.UNIT_HEIGHT / 2));
        }
        context.fill();

    }

}