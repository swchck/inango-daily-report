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
