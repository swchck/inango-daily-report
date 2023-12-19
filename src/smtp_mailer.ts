import { Mailer } from '@/interfaces/mailer';
import { MailSettings } from '@/interfaces/settings/mail_settings';
import * as nodemailer from 'nodemailer';

export class SMTPMailer implements Mailer {
	private readonly transporter: nodemailer.Transporter;
	private readonly mailOptions: nodemailer.SendMailOptions;

	constructor(settings: MailSettings) {
		this.transporter = nodemailer.createTransport({
			host: settings.mailServer.unsafe.host,
			port: settings.mailServer.unsafe.port,
			secure: false,
			requireTLS: true,
			auth: {
				user: settings.mailServer.username,
				pass: settings.mailServer.password,
			},
			tls: {
				rejectUnauthorized: settings.mailServer.unsafe.rejectUnauthorized,
			},
		});

		// TODO: add ability to change default recipients
		const defaultRecipients = [
			settings.defaultRecipients.teamleaders,
			settings.defaultRecipients.tracker,
			settings.defaultRecipients.manager,
			settings.defaultRecipients.team
		]
			.filter((recipient) => recipient !== '')
			.join(', ');
		const date = new Date();
		formatDate(date);
		const subject = `${settings.subjectName}: ${formatDate(date)}: Daily report`

		this.mailOptions = {
			from: settings.mailServer.username,
			to: defaultRecipients,
			bcc: settings.mailServer.username,
			subject: subject,
		};
	}

	send(text: string): void {
		this.mailOptions.text = text;
		console.log('transporter: ', this.transporter);

		this.transporter.sendMail(this.mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	}
}

function formatDate(date: Date): string {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
	const year = date.getFullYear();

	return `${day}.${month}.${year}`;
}
