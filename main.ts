import { INANGO_ICON } from '@/inango_icon';
import { DEFAULT_SETTINGS, Settings } from '@/interfaces/settings';
import { SMTPMailer } from '@/smtp_mailer';
import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TFile, addIcon } from 'obsidian';

// Remember to rename these classes and interfaces!


export default class DailyReportPlugin extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		// Add Inango Icon
		addIcon('inango-plugin-icon', INANGO_ICON)

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('inango-plugin-icon', 'Send Daily Reports', (evt: MouseEvent) => {
			new Notice('Sending Daily Reports...');
			this.sendDailyReports().then((info) => {
				new Notice('Daily Reports Sent!');
			}).catch((err) => {
				new Notice('Error Sending Daily Reports 🫣');
			});
		});
		ribbonIconEl.addClass('inango-plugin-icon-class');


		// This adds a commands that can be invoked from the command palette.
		this.addCommand({
			id: 'open-daily-reports-folder',
			name: 'Open Daily Reports Folder',
			callback: async () => {
				new Notice('Opening Daily Reports Folder...');
				this.openDailyReport().then((info) => {
					new Notice('Daily Reports Folder Opened!');
				}).catch((err) => {
					console.log(err);
					new Notice('Error Opening Daily Reports Folder 🫣');
				});
			}
		})
		this.addCommand({
			id: 'create-new-daily-report',
			name: 'Create New Daily Report',
			callback: async () => {
				new Notice('Creating New Daily Report...');
				this.openDailyReport().then((info) => {
					console.log(info);
				}).catch((err) => {
					console.log(err);
					new Notice('Error Creating New Daily Report 🫣');
				});
			}
		})
		this.addCommand({
			id: 'send-daily-reports',
			name: 'Send Daily Reports',
			callback: async () => {
				new Notice('Sending Daily Reports...');
				this.sendDailyReports().then((info) => {
					new Notice('Daily Reports Sent!');
				}).catch((err) => {
					new Notice('Error Sending Daily Reports 🫣');
				});
			}
		})
		this.addCommand({
			id: 'insert-daily-report-template',
			name: 'Insert Daily Report Template',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const sel = editor.getCursor();

				console.log(this.settings.General.template);

				// Get template file
				let templ = "";
				if (this.settings.General.template !== "") {
					templ = await this.app.vault.adapter.read(`${this.settings.General.template}`)
				} else {
					new Notice('Template file is not set!');
					return;
				}

				// Insert template
				editor.replaceRange(templ, sel);
			},
		})

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log("Saving settings for Inango Daily Report Plugin...")
		this.saveSettings();
		console.log('Unloading OInango Daily Report Plugin...');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async sendDailyReports() {
		const currentDate = new Date().toISOString().slice(0, 10);
		const filename = `${currentDate}.md`;

		const isReportsDirExists = await this.app.vault.adapter.exists(`${this.settings.General.reportsFolder}`);
		if (!isReportsDirExists) {
			await this.app.vault.createFolder(`${this.settings.General.reportsFolder}`);
		}

		const isFileExists = await this.app.vault.adapter.exists(`${this.settings.General.reportsFolder}/${filename}`);
		if (isFileExists) {
			const file = await this.app.vault.adapter.read(`${this.settings.General.reportsFolder}/${filename}`);
			new SMTPMailer(this.settings.Mail).send(file);
		} else {
			new Notice('Daily report file does not exist, creating it...');
			if (this.settings.General.template) {
				const template = await this.app.vault.adapter.read(`${this.settings.General.template}`);
				await this.app.vault.create(`${this.settings.General.reportsFolder}/${filename}`, template);
			}
			await this.app.vault.create(`${this.settings.General.reportsFolder}/${filename}`, '');
		}
	}

	async openDailyReport() {
		const currentDate = new Date().toISOString().slice(0, 10);
		const filename = `${currentDate}.md`;

		const isReportsDirExists = await this.app.vault.adapter.exists(`${this.settings.General.reportsFolder}`);
		if (!isReportsDirExists) {
			await this.app.vault.createFolder(`${this.settings.General.reportsFolder}`);
		}

		const isFileExists = await this.app.vault.adapter.exists(`${this.settings.General.reportsFolder}/${filename}`);
		if (isFileExists) {
			new Notice('File already exists, openning it...');
			await this.app.workspace.openLinkText(filename, `${this.settings.General.reportsFolder}`);
		} else {
			new Notice('Creating new daily report file...');
			await this.app.vault.create(`${this.settings.General.reportsFolder}/${filename}`, '');
		}
	}
}

class SettingTab extends PluginSettingTab {
	plugin: DailyReportPlugin;

	constructor(app: App, plugin: DailyReportPlugin) {
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
					await this.plugin.saveSettings();
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
						await this.plugin.saveSettings();
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
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Username')
			.setDesc('SMTP username.')
			.addText(text => text
				.setPlaceholder('username')
				.setValue(this.plugin.settings.Mail.mailServer.username)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.username = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Password')
			.setDesc('SMTP password.')
			.addText(text => text
				.setPlaceholder('password')
				.setValue(this.plugin.settings.Mail.mailServer.password)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.password = value;
					await this.plugin.saveSettings();
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
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Tracker')
			.setDesc('Default mail recipients for tracker.')
			.addText(text => text
				.setPlaceholder('tracker@inango-systems.com')
				.setValue(this.plugin.settings.Mail.defaultRecipients.tracker)
				.onChange(async (value) => {
					this.plugin.settings.Mail.defaultRecipients.tracker = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Manager')
			.setDesc('Default mail recipients for manager.')
			.addText(text => text
				.setPlaceholder('manager@inango-systems.com')
				.setValue(this.plugin.settings.Mail.defaultRecipients.manager)
				.onChange(async (value) => {
					this.plugin.settings.Mail.defaultRecipients.manager = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Team')
			.setDesc('Default mail recipients for team.')
			.addText(text => text
				.setPlaceholder('yourteam@inango-systems.com')
				.setValue(this.plugin.settings.Mail.defaultRecipients.team)
				.onChange(async (value) => {
					this.plugin.settings.Mail.defaultRecipients.team = value;
					await this.plugin.saveSettings();
				}));

		const toggleAndUnsafeSettingsEl = containerEl.createEl('div');

		new Setting(toggleAndUnsafeSettingsEl)
			.setName('Show Unsafe Settings')
			.setDesc('Show unsafe settings.')
			.addToggle(toggle => toggle
				.setValue(false)
				.onChange(async (value) => {
					this.plugin.settings.Mail.showUnsafe = value;
					await this.plugin.saveSettings();
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
					await this.plugin.saveSettings();
				}));

		new Setting(unsafeSettingsEl)
			.setName('Port')
			.setDesc('SMTP port.')
			.addText(text => text
				.setPlaceholder('587')
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.port.toString())
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.port = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(unsafeSettingsEl)
			.setName('Secure')
			.setDesc('SMTP secure.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.secure)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.secure = value;
					await this.plugin.saveSettings();
				}));

		new Setting(unsafeSettingsEl)
			.setName('Require TLS')
			.setDesc('SMTP require TLS.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.requireTLS)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.requireTLS = value;
					await this.plugin.saveSettings();
				}));

		new Setting(unsafeSettingsEl)
			.setName('Reject Unauthorized')
			.setDesc('SMTP reject unauthorized.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.Mail.mailServer.unsafe.rejectUnauthorized)
				.onChange(async (value) => {
					this.plugin.settings.Mail.mailServer.unsafe.rejectUnauthorized = value;
					await this.plugin.saveSettings();
				}));
	}
}

