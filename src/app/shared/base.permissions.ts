import { Injectable } from "@angular/core";

export interface IBasePermission {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

export enum RoleTypes {
    super_admin = 'super_admin',
    admin = 'admin',
    manager_admin = 'manager_admin',
    manager_viewer = 'manager_viewer',
    member_admin = 'member_admin',
    member_viewer = 'member_viewer',
    team_admin = 'team_admin',
    team_viewer = 'team_viewer',
    diocese_admin = 'diocese_admin',
    diocese_viewer = 'diocese_viewer'
}

@Injectable({
    providedIn: "root"
})

export class BasePermissions {

    constructor() { }

    getBasePermissionForRole(roleCode: string) {
        switch (roleCode) {
            case RoleTypes.super_admin:
                return this.getSuperAdminBasePermissions();
            case RoleTypes.admin:
                return this.getAdminBasePermissions();
            case RoleTypes.manager_admin:
                return this.getManagerAdminBasePermissions();
            case RoleTypes.manager_viewer:
                return this.getManagerViewerBasePermissions();
            case RoleTypes.member_admin:
                return this.getMemberAdminBasePermissions();
            case RoleTypes.member_viewer:
                return this.getMemberViewerBasePermissions();
            case RoleTypes.team_admin:
                return this.getTeamAdminBasePermissions();
            case RoleTypes.team_viewer:
                return this.getTeamViewerBasePermissions();
            case RoleTypes.diocese_admin:
                return this.getDioceseAdminBasePermissions();
            case RoleTypes.diocese_viewer:
                return this.getDioceseViewerBasePermissions();
            default:
                return this.getDefaultBasePermissions();
        }
    }

    getBasePermission(view: boolean, create: boolean, edit: boolean, hasDelete: boolean): IBasePermission {
        return {
            view: view,
            create: create,
            edit: edit,
            delete: hasDelete,
        }
    }

    getDefaultBasePermissions() {
        let basePermission: any = {
            ready: false,
            myAppReady: false,
            teams: this.getBasePermission(false, false, false, false),
            diocese: this.getBasePermission(false, false, false, false),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(false, false, false, false),
            problems: {
                view: false,
                allproblems: this.getBasePermission(false, false, false, false),
                myproblems: this.getBasePermission(false, false, false, false),
            },
            records: {
                view: false,
                members: this.getBasePermission(false, false, false, false),
                sacraments: this.getBasePermission(false, false, false, false),
            },
            settings: {
                view: false,
                users: this.getBasePermission(false, false, false, false),
                mychurch: this.getBasePermission(false, false, false, false),
            }
        }
        return basePermission;
    }

    getSuperAdminBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(true, true, true, true),
            diocese: this.getBasePermission(true, true, true, true),
            manage:
            {
                view: true,
                teams: this.getBasePermission(true, true, true, true),
                diocese: this.getBasePermission(true, true, true, true),
            },
            sampledata: this.getBasePermission(true, true, true, true),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(true, true, true, true),
            },
            records: {
                view: true,
                members: this.getBasePermission(true, true, true, true),
                sacraments: this.getBasePermission(true, true, true, true),
            },
            settings: {
                view: true,
                users: this.getBasePermission(true, true, true, true),
                mychurch: this.getBasePermission(true, true, true, true),
            }
        }
        return basePermission;
    }

    getAdminBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(true, true, true, true),
            diocese: this.getBasePermission(true, true, true, true),
            manage:
            {
                view: true,
                teams: this.getBasePermission(true, true, true, true),
                diocese: this.getBasePermission(true, true, true, true),
            },
            sampledata: this.getBasePermission(true, true, true, true),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(true, true, true, true),
            },
            records: {
                view: true,
                members: this.getBasePermission(true, true, true, true),
                sacraments: this.getBasePermission(true, true, true, true),
            },
            settings: {
                view: true,
                users: this.getBasePermission(true, true, true, true),
                mychurch: this.getBasePermission(true, true, true, true),
            }
        }
        return basePermission;
    }

    getManagerAdminBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(true, true, true, true),
            diocese: this.getBasePermission(true, true, true, true),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(true, true, true, true),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(true, true, true, true),
            },
            records: {
                view: true,
                members: this.getBasePermission(true, true, true, true),
                sacraments: this.getBasePermission(true, true, true, true),
            },
            settings: {
                view: true,
                users: this.getBasePermission(false, false, false, false),
                mychurch: this.getBasePermission(true, true, true, true),
            }
        }
        return basePermission;
    }

    getManagerViewerBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(true, false, false, false),
            diocese: this.getBasePermission(true, false, false, false),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(true, true, true, true),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(true, false, false, false),
            },
            records: {
                view: true,
                members: this.getBasePermission(true, false, false, false),
                sacraments: this.getBasePermission(true, false, false, false),
            },
            settings: {
                view: false,
                users: this.getBasePermission(false, false, false, false),
                mychurch: this.getBasePermission(false, false, false, false),
            }
        }
        return basePermission;
    }

    getMemberAdminBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(false, false, false, false),
            diocese: this.getBasePermission(false, false, false, false),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(true, true, true, true),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(false, false, false, false),
            },
            records: {
                view: true,
                members: this.getBasePermission(true, true, true, true),
                sacraments: this.getBasePermission(true, true, true, true),
            },
            settings: {
                view: false,
                users: this.getBasePermission(false, false, false, false),
                mychurch: this.getBasePermission(false, false, false, false),
            }
        }
        return basePermission;
    }

    getMemberViewerBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(false, false, false, false),
            diocese: this.getBasePermission(false, false, false, false),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(false, false, false, false),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(false, false, false, false),
            },
            records: {
                view: true,
                members: this.getBasePermission(true, false, false, false),
                sacraments: this.getBasePermission(true, false, false, false),
            },
            settings: {
                view: false,
                users: this.getBasePermission(false, false, false, false),
                mychurch: this.getBasePermission(false, false, false, false),
            }
        }
        return basePermission;
    }

    getTeamAdminBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(true, true, true, true),
            diocese: this.getBasePermission(false, false, false, false),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(true, true, true, true),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(false, false, false, false),
            },
            records: {
                view: true,
                members: this.getBasePermission(true, true, true, true),
                sacraments: this.getBasePermission(false, false, false, false),
            },
            settings: {
                view: true,
                users: this.getBasePermission(true, true, true, true),
                mychurch: this.getBasePermission(false, false, false, false),
            }
        }
        return basePermission;
    }

    getTeamViewerBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(true, false, false, false),
            diocese: this.getBasePermission(false, false, false, false),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(false, false, false, false),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(false, false, false, false),
            },
            records: {
                view: false,
                members: this.getBasePermission(false, false, false, false),
                sacraments: this.getBasePermission(false, false, false, false),
            },
            settings: {
                view: false,
                users: this.getBasePermission(false, false, false, false),
                mychurch: this.getBasePermission(false, false, false, false),
            }
        }
        return basePermission;
    }

    getDioceseAdminBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(false, false, false, false),
            diocese: this.getBasePermission(true, true, true, true),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(true, true, true, true),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(false, false, false, false),
            },
            records: {
                view: true,
                members: this.getBasePermission(true, true, true, true),
                sacraments: this.getBasePermission(false, false, false, false),
            },
            settings: {
                view: true,
                users: this.getBasePermission(true, true, true, true),
                mychurch: this.getBasePermission(false, false, false, false),
            }
        }
        return basePermission;
    }

    getDioceseViewerBasePermissions() {
        let basePermission: any = {
            ready: true,
            myAppReady: true,
            teams: this.getBasePermission(false, false, false, false),
            diocese: this.getBasePermission(true, false, false, false),
            manage:
            {
                view: false,
                teams: this.getBasePermission(false, false, false, false),
                diocese: this.getBasePermission(false, false, false, false),
            },
            sampledata: this.getBasePermission(false, false, false, false),
            problems: {
                view: true,
                myproblems: this.getBasePermission(true, true, true, true),
                allproblems: this.getBasePermission(false, false, false, false),
            },
            records: {
                view: false,
                members: this.getBasePermission(false, false, false, false),
                sacraments: this.getBasePermission(false, false, false, false),
            },
            settings: {
                view: false,
                users: this.getBasePermission(false, false, false, false),
                mychurch: this.getBasePermission(false, false, false, false),
            }
        }
        return basePermission;
    }


}