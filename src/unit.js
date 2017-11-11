import constants from './constants';

const UNIT_SPEED = 0.8;

export default class Unit {

    static create(type, color_index) {

        let unit = {
            type,
            color_index,
            x: 0,
            y: 0,
            target_x: 0,
            target_y: 0
        };

        return unit;

    }

    static moveTo(unit, x, y) {
        unit.target_x = x;
        unit.target_y = y;
    }

    static snapTo(unit, x, y) {
        unit.target_x = unit.x = x;
        unit.target_y = unit.y = y;
    }

    static isMoving(unit) {
        return !(unit.x === unit.target_x && unit.y === unit.target_y);
    }

    static update(unit, progress) {
        
        if(unit.x < unit.target_x) {
            unit.x += (UNIT_SPEED * progress);
            if(unit.x > unit.target_x) {
                unit.x = unit.target_x;
            }
        } else if(unit.x > unit.target_x) {
            unit.x -= (UNIT_SPEED * progress);
            if(unit.x < unit.target_x) {
                unit.x = unit.target_x;
            }
        }

        if(unit.y < unit.target_y) {
            unit.y += (UNIT_SPEED * progress);
            if(unit.y > unit.target_y) {
                unit.y = unit.target_y;
            }
        } else if(unit.y > unit.target_y) {
            unit.y -= (UNIT_SPEED * progress);
            if(unit.y < unit.target_y) {
                unit.y = unit.target_y;
            }
        }

    }

    static draw(unit, color, context) {
        context.fillStyle = color;
        context.fillRect(unit.x, unit.y, constants.UNIT_WIDTH, constants.UNIT_HEIGHT);
    }

}