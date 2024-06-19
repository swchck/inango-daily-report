import IDailyReportPlugin from '@/interfaces/plugin';
import { isReportDirExists } from "@/utils";
import { Notice, TFile } from "obsidian";

export default async function archiveOldReports(plugin: IDailyReportPlugin) {
	/* Check if the reports folder exists, if not create it */
	const isReportsDirExists = await isReportDirExists(plugin);
	if (!isReportsDirExists) {
		await plugin.app.vault.createFolder(`${plugin.settings.General.reportsFolder}`);
	}

	/* Get All Files in the reports folder */
	const files = await plugin.app.vault.adapter.list(plugin.settings.General.reportsFolder);
	if (Object.keys(files).length === 0) {
		new Notice('No daily report files found');
		return;
	}

	/* Iterate over all files and if they are older than 7 days 
	and has property sended, move them to the archive folder */
	const filePromises = files.files.map(async (file: string) => {
		const note = plugin.app.vault.getAbstractFileByPath(`${file}`);

		if (!(note instanceof TFile)) return;

		const cache = plugin.app.metadataCache.getFileCache(note);
		if (!cache || !cache.frontmatter || cache.frontmatter['sent'] !== true) return;

		const createdAt = new Date(note.stat.ctime);
		const now = new Date();
		const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

		/* Check if the note is older than 7 days */
		if (createdAt >= sevenDaysAgo) return;

		const year = createdAt.getFullYear();
		const weekNumber = Math.ceil((((createdAt.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1) / 7);

		// Calculate the start and end dates of the week
		const weekStart = new Date(year, 0, 1 + (weekNumber - 1) * 7);
		const weekEnd = new Date(year, 0, 1 + weekNumber * 7 - 1);

		// Format the dates as YYYY-MM-DD
		const formatDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

		const yearFolder = `${plugin.settings.General.reportsFolder}/archive/${year}`;
		const weekFolder = `${yearFolder}/week-${weekNumber} (${formatDate(weekStart)} to ${formatDate(weekEnd)})`;

		const [isYearFolderExists, isWeekFolderExists] = await Promise.all([
			plugin.app.vault.adapter.exists(yearFolder),
			plugin.app.vault.adapter.exists(weekFolder)
		]);

		if (!isYearFolderExists) {
			await plugin.app.vault.createFolder(yearFolder);
		}

		if (!isWeekFolderExists) {
			await plugin.app.vault.createFolder(weekFolder);
		}

		const newFilePath = `${weekFolder}/${file.split('/').pop()}`;
		try {
			await plugin.app.vault.adapter.rename(file, newFilePath);
			new Notice(`Daily report ${file} has been archived.`);
		} catch (error) {
			new Notice(`Error archiving daily report ${file}: ${error.message}`);
		}
	});

	await Promise.all(filePromises);
}
