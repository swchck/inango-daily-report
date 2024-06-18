// General settings — main settings for the plugin
export interface GeneralSettings {
	reportsFolder: string;
	template: string;
}

export interface Settings {
	General: GeneralSettings;
	Mail: MailSettings;
}

// Mail settings — settings for the mailer
export interface MailSettings {
	subjectName: string;

	// Default mail recipients
	defaultRecipients: DefaultRecipientsSettings;

	mailServer: MailServerSettings;
	showUnsafe: boolean;
}

// Mail Server settings — settings for the mail server
export interface MailServerSettings {
	username: string;
	password: string;
	unsafe: MailServerUnsafeSettings;
}

// Mail Server Unsafe settings — settings for the mail server
export interface MailServerUnsafeSettings {
	host: string;
	port: number;
	secure: boolean;
	requireTLS: boolean;
	rejectUnauthorized: boolean;
}

// Default Recipients Settings — settings for the default recipients
export interface DefaultRecipientsSettings {
	teamleaders: string;
	tracker: string;
	manager: string;
	team: string;
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
