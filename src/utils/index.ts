import IDailyReportPlugin from '@/interfaces/plugin';
import { Notice, TFile } from "obsidian";

/**
 * Checks if the reports directory exists.
 * 
 * This function first checks if the reports folder is set in the plugin settings. If it is not set,
 * it displays a notice asking the user to set the reports folder in the settings.
 * If the reports folder is set, it checks if the folder exists in the vault.
 *
 * @param {IDailyReportPlugin} plugin - The plugin to use to check if the reports directory exists.
 * @returns {Promise<boolean | void>} - A Promise that resolves to a boolean indicating whether the reports directory exists, or void if the reports folder is not set.
 */
export async function isReportDirExists(plugin: IDailyReportPlugin) {
	/* Check if the reports folder is set */
	if (!plugin.settings.General.reportsFolder) {
		new Notice('Please set the reports folder in the settings');
		return;
	}

	/* Check if the reports folder exists */
	return await plugin.app.vault.adapter.exists(`${plugin.settings.General.reportsFolder}`);
}

/**
 * Checks if a report exists.
 * 
 * This function checks if a report with the provided name exists in the reports folder specified in the plugin settings.
 *
 * @param {IDailyReportPlugin} plugin - The plugin to use to check if the report exists.
 * @param {string} name - The name of the report to check.
 * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the report exists.
 */
export async function isReportExists(plugin: IDailyReportPlugin, name: string) {
	return await plugin.app.vault.adapter.exists(`${plugin.settings.General.reportsFolder}/${name}`);
}

/**
 * Marks a report as sent.
 * 
 * This function processes the frontmatter of the provided note. It sets the 'sent' property to true
 * and the 'sent_at' property to the current date and time in ISO format.
 *
 * @param {IDailyReportPlugin} plugin - The plugin to use to mark the report as sent.
 * @param {TFile} note - The note to mark as sent.
 * @returns {Promise<void>} - A Promise that resolves when the report has been marked as sent.
 */
export async function markReportAsSent(plugin: IDailyReportPlugin, note: TFile): Promise<void> {
	return plugin.app.fileManager.processFrontMatter(
		note,
		(frontmatter) => {
			frontmatter["sent"] = true;
			frontmatter["sent_at"] = new Date().toISOString();
		}
	)
}

/**
 * Checks if a report has been sent.
 * 
 * This function retrieves the metadata cache for the provided note. If the cache exists,
 * it checks the frontmatter for 'sent' and 'sent_at' properties. If 'sent' is true and 'sent_at' exists,
 * the function returns true, indicating that the report has been sent. Otherwise, it returns false.
 *
 * @param {TFile} note - The note to check if the report has been sent.
 * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the report has been sent.
 */
export async function isReportSent(note: TFile): Promise<boolean> {
	const cache = this.app.metadataCache.getFileCache(note);
	if (cache) {
		if (cache.frontmatter && cache.frontmatter['sent'] === true && cache.frontmatter['sent_at']) {
			return true;
		}
	}
	return false;
}
