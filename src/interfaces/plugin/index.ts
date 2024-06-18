import { Plugin } from "obsidian";
import { Settings } from "../settings";

export default interface IDailyReportPlugin extends Plugin {
	settings: Settings;
	onload(): Promise<void>;
	onunload(): void;
}
