import { ApplicationCommandType, ContextMenuCommandType } from "discord.js";
import Interaction from "../libs/structures/Interaction";

export default class Bookmark extends Interaction {
	name = "bookmark";
	commandType = 0; //context menu command
	contextMenuCommandType =
		ApplicationCommandType.Message as ContextMenuCommandType;
	dmPermission = true;
}
