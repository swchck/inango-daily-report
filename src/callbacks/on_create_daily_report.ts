import createDailyReport from '@/actions/create_daily_report';
import IDailyReportPlugin from '@/interfaces/plugin';
import { Notice } from 'obsidian';

export default async function onCreateDailyReport(plugin: IDailyReportPlugin) {
	new Notice('Creating New Daily Report...');

	createDailyReport(plugin)
		.then(() => {
			console.log('Daily report created successfully');
		})
		.catch((err: Error) => {
			console.log(err);
			new Notice('Error Creating New Daily Report 🫣');
		});
}
