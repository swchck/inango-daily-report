import { App, PluginSettingTab, Setting, TFile } from 'obsidian';
import IDailyReportPlugin from '../interfaces/plugin';

export default class SettingTab extends PluginSettingTab {
	plugin: IDailyReportPlugin;

	constructor(app: App, plugin: IDailyReportPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h1', { text: 'Inango Daily Report Plugin Settings' });

		containerEl.createEl('h2', { text: 'General Settings' });

		new Setting(containerEl)
			.setName('Reports Folder')
			.setDesc('Folder where daily reports will be saved.')
			.addText(text => text
				.setPlaceholder('Reports')
				.setValue(this.plugin.settings.General.reportsFolder)
				.onChange(async (value) => {
					this.plugin.settings.General.reportsFolder = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(containerEl)
			.setName('Template')
			.setDesc('Template for daily reports.')
			.addDropdown(async dropdown => {
				const files: TFile[] = this.app.vault.getMarkdownFiles();
				const options: Record<string, string> = {};

				for (const file of files) {
					options[file.path] = file.basename;
				}

				dropdown
					.addOptions(options)
					.setValue(this.plugin.settings.General.template)
					.onChange(async (value) => {
						console.log(value);
						this.plugin.settings.General.template = value;
						await this.plugin.saveData(this.plugin.settings);
					});
			});

		containerEl.createEl('h2', { text: 'Mail Settings' });

		new Setting(containerEl)
			.setName('Subject Name')
			.setDesc('Name that will be displayed in the subject of the mail.')
			.addText(text => text
				.setPlaceholder('Andrei Bogomazov')
				.setValue(this.plugin.settings.Mail.subjectName)
				.onChange(async (value) => {
					this.plugin.settings.Mail.subjectName = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(containerEl)
			.setName('Username')
			.setDesc('SMTP username.')
			.addText(text => text
				.setPlaceholder('username')
				.setValue(this.plugin.settings.Mail.mailServer.username)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.username = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(containerEl)
			.setName('Password')
			.setDesc('SMTP password.')
			.addText(text => text
				.setPlaceholder('password')
				.setValue(this.plugin.settings.Mail.mailServer.password)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.password = value;
					await this.plugin.saveData(this.plugin.settings);
				})
				.inputEl.type = 'password');

		new Setting(containerEl)
			.setName('Teamleaders')
			.setDesc('Default mail recipients for teamleaders.')
			.addText(text => text
				.setPlaceholder('teamleaders@inango-systems.com')
				.setValue(this.plugin.settings.Mail.defaultRecipients.teamleaders)
				.onChange(async (value) => {
					this.plugin.settings.Mail.defaultRecipients.teamleaders = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(containerEl)
			.setName('Tracker')
			.setDesc('Default mail recipients for tracker.')
			.addText(text => text
				.setPlaceholder('tracker@inango-systems.com')
				.setValue(this.plugin.settings.Mail.defaultRecipients.tracker)
				.onChange(async (value) => {
					this.plugin.settings.Mail.defaultRecipients.tracker = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(containerEl)
			.setName('Manager')
			.setDesc('Default mail recipients for manager.')
			.addText(text => text
				.setPlaceholder('manager@inango-systems.com')
				.setValue(this.plugin.settings.Mail.defaultRecipients.manager)
				.onChange(async (value) => {
					this.plugin.settings.Mail.defaultRecipients.manager = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(containerEl)
			.setName('Team')
			.setDesc('Default mail recipients for team.')
			.addText(text => text
				.setPlaceholder('yourteam@inango-systems.com')
				.setValue(this.plugin.settings.Mail.defaultRecipients.team)
				.onChange(async (value) => {
					this.plugin.settings.Mail.defaultRecipients.team = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		const toggleAndUnsafeSettingsEl = containerEl.createEl('div');

		new Setting(toggleAndUnsafeSettingsEl)
			.setName('Show Unsafe Settings')
			.setDesc('Show unsafe settings.')
			.addToggle(toggle => toggle
				.setValue(false)
				.onChange(async (value) => {
					this.plugin.settings.Mail.showUnsafe = value;
					await this.plugin.saveData(this.plugin.settings);
					unsafeSettingsEl.style.display = value ? 'block' : 'none';
				}));

		const unsafeSettingsEl = toggleAndUnsafeSettingsEl.createEl('div', { attr: { style: 'display: none;' } });

		if (this.plugin.settings.Mail.showUnsafe) {
			unsafeSettingsEl.style.display = 'block';
		}

		unsafeSettingsEl.createEl('h2', { text: '☢️ Unsafe Area ☢️' });
		unsafeSettingsEl.createEl(
			'p', {
			text: 'Do not touch these settings unless you know what you are doing!',
			attr: { style: 'color: red; font-weight: bold;' }
		});

		new Setting(unsafeSettingsEl)
			.setName('Host')
			.setDesc('SMTP host.')
			.addText(text => text
				.setPlaceholder('mail.inango.com')
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.host)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.host = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(unsafeSettingsEl)
			.setName('Port')
			.setDesc('SMTP port.')
			.addText(text => text
				.setPlaceholder('587')
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.port.toString())
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.port = parseInt(value);
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(unsafeSettingsEl)
			.setName('Secure')
			.setDesc('SMTP secure.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.secure)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.secure = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(unsafeSettingsEl)
			.setName('Require TLS')
			.setDesc('SMTP require TLS.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.requireTLS)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.requireTLS = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

		new Setting(unsafeSettingsEl)
			.setName('Reject Unauthorized')
			.setDesc('SMTP reject unauthorized.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.rejectUnauthorized)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.rejectUnauthorized = value;
					await this.plugin.saveData(this.plugin.settings);
				}));
	}
}
