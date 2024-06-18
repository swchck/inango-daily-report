import archiveOldReports from '@/actions/archive_old_reports';
import IDailyReportPlugin from '@/interfaces/plugin';
import { Notice } from 'obsidian';

export default async function onArchiveReports(plugin: IDailyReportPlugin) {
	new Notice('Archivate Reports...');

	archiveOldReports(plugin)
		.then(() => {
			console.log('Daily reports archived successfully');
		})
		.catch((err: Error) => {
			console.log(err);
			new Notice('Error on archive daily reports 🫣');
		});
}
