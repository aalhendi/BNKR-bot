import { Embed } from "discord.js";

	export default function getTodoId(embeds: Embed[]): string | undefined {
		for (let embed of embeds) {
			for (let field of embed.fields) {
				if (field.name == "ID") return field.value;
			}
		}
		return undefined;
	}
