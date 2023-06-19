import { InjectionToken } from '@angular/core';

export interface IEnvironment {
    production: boolean;
    envName: string;
    landingPage: string;
};

export interface Settings {
    Title: string;
    Server: string;
    plural_project_label: string;
    single_project_label: string;
    single_subsite_label: string;
    plural_subsite_label: string;
    plural_member_label: string;
    single_member_label: string;
    search_settings: string;
    grid_settings: string;
    access_control: string;
    alt_options: string;
    brand_color_toolbar: string;
    plural_team_label: string;
    single_team_label: string;
    plural_site_label: string;
    single_site_label: string;
    history_report: string;
    stop_report: string;
    common_stops_report: string;
    alert_report: string;
    workspace_template: string;
    mgrs_value: string;
    light_logo: string;
    dark_logo: string;
    fav_logo: string;
    application: string;
    custom_fields: string;
    product_name: string;
    collects: string;
    current_user: string;
    app_id: string;
}

export interface SharedConfig {
    environment?: IEnvironment;
    Settings?: Settings;
}

export const SHARED_CONFIG = new InjectionToken<SharedConfig>('SHARED_CONFIG');

export function getGlobalSettings() {
    let settings: Settings = {
        Title: '',
        Server: '',
        plural_project_label: 'project_label',
        single_project_label: 'single_project_label',
        single_subsite_label: 'single_subsite_label',
        plural_subsite_label: 'subsite_label',
        plural_member_label: 'member_label',
        single_member_label: 'single_member_label',
        search_settings: 'search_settings',
        grid_settings: 'grid_settings',
        access_control: 'access_control',
        alt_options: 'alt_options',
        brand_color_toolbar: 'brand_color_toolbar',
        plural_team_label: 'team_label',
        single_team_label: 'single_team_label',
        plural_site_label: 'site_label',
        single_site_label: 'single_site_label',
        history_report: 'history_report',
        stop_report: 'stop_report',
        common_stops_report: 'common_stops_report',
        alert_report: 'alert_report',
        workspace_template: 'workspace_template',
        mgrs_value: 'mgrs_value',
        light_logo: 'light_logo',
        dark_logo: 'dark_logo',
        fav_logo: 'fav_logo',
        application: 'application',
        custom_fields: 'custom_fields',
        product_name: 'product_name',
        collects: 'collects',
        current_user: 'current_user',
        app_id: 'app_id'
    };
    return settings;
}

export const DEFAULT_SHARED_CONFIG: SharedConfig = {
    environment: {
        envName: 'dev',
        landingPage: '/aware/map',
        production: false
    },
    Settings: getGlobalSettings()
}