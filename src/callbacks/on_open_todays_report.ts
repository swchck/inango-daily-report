import IDailyReportPlugin from "@/interfaces/plugin";
import { Notice } from "obsidian";

export default async function onOpenTodaysReport(plugin: IDailyReportPlugin) {
	new Notice('Opening Daily Report...');

	onOpenTodaysReport(plugin)
		.catch((err: Error) => {
			console.log(err);
			new Notice(`Failed to open today's daily report 🫣`);
		});
}
