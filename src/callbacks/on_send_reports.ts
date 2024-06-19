import sendDailyReports from "@/actions/send_daily_reports";
import IDailyReportPlugin from "@/interfaces/plugin";
import { Notice } from "obsidian";

export default async function onSendReports(plugin: IDailyReportPlugin) {
	new Notice('Sending Daily Reports...');

	sendDailyReports(plugin)
		.then(() => {
			new Notice('Daily Reports Sent!');
		})
		.catch((err: Error) => {
			new Notice('Error Sending Daily Reports 🫣');
			console.error(err);
		});
}
