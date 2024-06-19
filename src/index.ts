import IDailyReportPlugin from '@/interfaces/plugin';
import { DEFAULT_SETTINGS } from "@/interfaces/settings";
import { addIcon } from "obsidian";
import { INANGO_ICON } from "./assets/inango_icon";
import onArchiveReports from './callbacks/on_archive_reports';
import onCreateDailyReport from "./callbacks/on_create_daily_report";
import onInsertTemplate from "./callbacks/on_insert_template";
import onOpenTodaysReport from './callbacks/on_open_todays_report';
import onSendReports from "./callbacks/on_send_reports";

/**
 * Configures the settings for the provided plugin.
 * 
 * This function first loads the data from the plugin. If the settings are not available,
 * it uses the default settings. The settings are then assigned to the plugin.
 *
 * @param {IDailyReportPlugin} plugin - The plugin for which to configure the settings.
 * @returns {Promise<void>} - A Promise that resolves when the settings have been configured.
 */
async function configureSettings(plugin: IDailyReportPlugin) {
	/* Await the plugin's loadData method to get the settings
		if the settings are not available, use the default settings */
	plugin.settings = await Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
}

/**
 * Configures the ribbon icons for the provided plugin.
 * 
 * This function first adds an icon with the ID 'inango-plugin-icon' and the provided INANGO_ICON.
 * Then, it adds this icon to the ribbon with the label 'Send Reports'. When the icon is clicked,
 * it triggers the 'onSendReports' function with the plugin as the argument.
 * Finally, it adds the class 'inango-plugin-icon-class' to the ribbon icon element.
 *
 * @param {IDailyReportPlugin} plugin - The plugin for which to configure the ribbon icons.
 */
function configureRibbons(plugin: IDailyReportPlugin) {
	/* Include Inango Icon */
	addIcon('inango-plugin-icon', INANGO_ICON)


	/* Put icon in ribbon */
	const ribbonIconEl = plugin.addRibbonIcon(
		'inango-plugin-icon',
		'Send Reports',
		onSendReports.bind(null, plugin)
	);
	ribbonIconEl.addClass('inango-plugin-icon-class');
}

/**
 * Configures the commands for the provided plugin.
 * 
 * This function adds several commands to the plugin that can be invoked from the command palette.
 * Each command has an ID, a name, and a callback function. The callback function is bound to the plugin.
 * The commands are:
 * - 'create-new-daily-report': Creates a new daily report.
 * - 'send-daily-reports': Sends the daily reports.
 * - 'insert-daily-report-template': Inserts a daily report template.
 * - 'archive-daily-reports': Archives the daily reports.
 * - 'open-todays-report': Opens today's report.
 *
 * @param {IDailyReportPlugin} plugin - The plugin for which to configure the commands.
 */
function configureCommands(plugin: IDailyReportPlugin) {
	// plugin adds a commands that can be invoked from the command palette.
	plugin.addCommand({
		id: 'create-new-daily-report',
		name: 'Create New Daily Report',
		callback: onCreateDailyReport.bind(null, plugin)
	})
	plugin.addCommand({
		id: 'send-daily-reports',
		name: 'Send Daily Reports',
		callback: onSendReports.bind(null, plugin)
	})
	plugin.addCommand({
		id: 'insert-daily-report-template',
		name: 'Insert Daily Report Template',
		editorCallback: onInsertTemplate.bind(null, plugin),
	})
	plugin.addCommand({
		id: 'archive-daily-reports',
		name: 'Archive Daily Reports',
		callback: onArchiveReports.bind(null, plugin)
	})
	plugin.addCommand({
		id: 'open-todays-report',
		name: 'Open Today\'s Report',
		callback: onOpenTodaysReport.bind(null, plugin)
	})
}

export { configureCommands, configureRibbons, configureSettings };

