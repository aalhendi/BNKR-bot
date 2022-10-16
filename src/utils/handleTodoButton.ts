import { ButtonInteraction } from "discord.js";
import getTodoId from "./getTodoId";
import { db } from "./prisma";
import { confirmButtons, todoButtons } from "./todoButtons";

export default async function handleTodoButton(
	interaction: ButtonInteraction
): Promise<void> {
	const updateTodoStatus = async (status: string) => {
		await db.todo.update({
			where: {
				id: todoId
			},
			data: {
				status: status
			}
		});
		const embeds = interaction.message.embeds;
		const statusFieldIdx = embeds[0].fields.findIndex(
			(f) => f.name === "Status"
		);
		embeds[0].fields[statusFieldIdx].value = status;
		await interaction.update({ embeds: embeds });
		interaction.update;
	};

	const foundUser = await db.user.findUnique({
		where: {
			discordId: interaction.user.id
		}
	});
	const todoId = getTodoId(interaction.message.embeds);
	if (foundUser && todoId) {
		const todo = await db.todo.findUnique({
			where: {
				id: todoId
			}
		});
		if (todo && todo.authorId === foundUser.id) {
			// Can edit
			let status = todo.status;
			switch (interaction.customId) {
				case "setTodoComplete":
					status = "Complete";
					updateTodoStatus(status);
					break;
				case "setTodoPartial":
					status = "Partial";
					updateTodoStatus(status);
					break;
				case "setTodoIncomplete":
					status = "Incomplete";
					updateTodoStatus(status);
					break;
				case "deleteTodo":
					interaction.update({
						// update the interaction with new delete buttons
						components: [confirmButtons]
					});
					break;
				case "cancelTodoDelete":
					interaction.update({ components: [todoButtons] });
					break;
				case "confirmTodoDelete":
					await interaction.message.delete();
					await db.todo.delete({
						where: {
							id: todoId
						}
					});
					break;
				default:
					break;
			}
		}
	}
	return;
}
