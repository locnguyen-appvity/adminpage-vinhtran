import { IUser } from './user';

export interface IAppState {
    user?: IUser;
    users?: {
        total: number,
        data: Array<IUser>
    };
    basePermissions: {
        ready: false,
        permission: 'Viewer'
    };
    dark: boolean;
}

export const INITIAL_STATE: IAppState = {
    user: {
        id: 0,
    },
    users: {
        total: 0,
        data: new Array<IUser>()
    },
    basePermissions: {
        ready: false,
        permission: 'Viewer'
    },
    dark: false
}
