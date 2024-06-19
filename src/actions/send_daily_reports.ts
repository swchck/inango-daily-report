import IDailyReportPlugin from '@/interfaces/plugin';
import { SMTPMailer } from '@/mailsender';
import { isReportDirExists, markReportAsSent } from '@/utils';
import { Notice, TFile } from 'obsidian';

export default async function sendDailyReports(plugin: IDailyReportPlugin) {
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

	/* Iterate over all files and send them */
	files.files.forEach(async (file: string) => {
		const note = plugin.app.vault.getAbstractFileByPath(`${file}`);
		if (note instanceof TFile) {
			const cache = plugin.app.metadataCache.getFileCache(note);
			if (cache) {
				/* Check if the report has been sent */
				if (cache.frontmatter && cache.frontmatter['sent'] === true) {
					return;
				}

				const content = await plugin.app.vault.adapter.read(`${file}`);
				const m = new SMTPMailer(plugin.settings.Mail)
				m.send(content)
					.then(async () => {
						/* Add sent property to the frontmatter */
						markReportAsSent(plugin, note)
							.catch(async (error) => {
								new Notice('Error marking report as sent');
								console.error(error);
							});
						new Notice('Daily report sent');
					})
					.catch(async (error) => {
						console.error(error);
						new Notice('Error sending daily report');
					});
			}
		}
	});
}
