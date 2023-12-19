// Mailer — interface for sending emails
export interface Mailer {
	send(text: string): void;
}
