import IDailyReportPlugin from '@/interfaces/plugin';
import { Settings } from "@/interfaces/settings";
import SettingTab from '@/settings';
import { Plugin } from 'obsidian';
import { configureCommands, configureRibbons, configureSettings } from './src';

/**
 * `DailyReportPlugin` is a class that extends `Plugin` and implements `IDailyReportPlugin`.
 * It represents a plugin for daily reports.
 * 
 * @property {Settings} settings - Represents the settings for the `DailyReportPlugin`.
 * 
 * @export
 * @class DailyReportPlugin
 * @extends {Plugin}
 * @implements {IDailyReportPlugin}
 */
export default class DailyReportPlugin extends Plugin implements IDailyReportPlugin {
	settings: Settings;

	/**
	 * `onload` is an asynchronous method that is called when the plugin is loaded.
	 * It configures the settings, ribbons, commands, and adds a settings tab.
	 * 
	 * @async
	 * @memberof DailyReportPlugin
	 */
	async onload() {
		/* Load settings */
		configureSettings(this);

		/* Configure Ribbon Menu */
		configureRibbons(this);

		/* Configure Commands */
		configureCommands(this);

		/* Register the settings tab */
		this.addSettingTab(new SettingTab(this.app, this));
	}

	/**
	 * `onunload` is a method that is called when the plugin is unloaded.
	 * It saves the settings and logs the unloading of the plugin.
	 * 
	 * @memberof DailyReportPlugin
	 */
	onunload() {
		this.saveData(this.settings);
	}
}
