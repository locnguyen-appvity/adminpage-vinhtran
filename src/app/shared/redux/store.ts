import {
    RESET_INVERTCOLOR,
    INVERT_COLOR,
    UPDATE_USER,
    UPDATE_BASEPERMISSIONS
} from './actions-define';
import { IAppState, INITIAL_STATE } from './state';

export function reducer(state: IAppState = INITIAL_STATE, action: any): IAppState {
    let newState: any;
    switch (action.type) {
        case INVERT_COLOR:
            newState = Object.assign({}, state, {
                dark: action.payload
            });
            return newState;
        case RESET_INVERTCOLOR:
            newState = Object.assign({}, state, {
                dark: false
            });
            return newState;
        case UPDATE_USER:
            newState = Object.assign({}, state, {
                user: action.payload
            });
            return newState;
        case UPDATE_BASEPERMISSIONS:
            newState = Object.assign({}, state, {
                userBasePermissions: action.payload
            });
            return newState;
    }
    return state;
}
