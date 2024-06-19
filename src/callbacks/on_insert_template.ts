import { Editor, MarkdownView, Notice } from 'obsidian';

export default async function onInsertTemplate(editor: Editor, view: MarkdownView) {
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
}
