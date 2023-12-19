import { GeneralSettings } from "./general_settings";
import { MailSettings } from "./mail_settings";

export interface Settings {
	General: GeneralSettings;
	Mail: MailSettings;
}

export const DEFAULT_SETTINGS: Settings = {
	General: {
		reportsFolder: 'Reports',
		template: '',
	},
	Mail: {
		subjectName: '',
		mailServer: {
			username: '',
			password: '',
			unsafe: {
				host: '',
				port: 587,
				secure: false,
				requireTLS: true,
				rejectUnauthorized: false,
			},
		},
		defaultRecipients: {
			teamleaders: '',
			tracker: '',
			manager: '',
			team: '',
		},
		showUnsafe: false,
	},
}
