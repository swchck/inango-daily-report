// Mailer — interface for sending emails
export interface SMTPClient {
	send(text: string): Promise<void>;
}
