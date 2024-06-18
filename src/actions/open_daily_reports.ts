import IDailyReportPlugin from '@/interfaces/plugin';
import { isReportDirExists, isReportExists } from '@/utils';

export default async function openDailyReport(plugin: IDailyReportPlugin) {
	const now = new Date().toISOString().slice(0, 10);
	const name = `${now}.md`;

	const isReportsDirExists = await isReportDirExists(plugin);
	if (!isReportsDirExists) {
		await plugin.app.vault.createFolder(`${plugin.settings.General.reportsFolder}`);
	}

	const isFileExists = await isReportExists(plugin, name);
	if (isFileExists) {
		await plugin.app.workspace.openLinkText(name, `${plugin.settings.General.reportsFolder}`);
	} else {
		await plugin.app.vault.create(`${plugin.settings.General.reportsFolder}/${name}`, '');
		// Open the file after it has been created
		await plugin.app.workspace.openLinkText(name, `${plugin.settings.General.reportsFolder}`);
	}
}
