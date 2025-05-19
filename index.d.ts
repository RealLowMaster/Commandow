// Type Definitions for Commandow v0.0.1
// Project Repository: https://github.com/RealLowMaster/commandow
// Definition by: RealLowMaster <https://github.com/RealLowMaster>
// Definition: https://github.com/RealLowMaster/commandow/index.d.ts

/**
 * String that follows Version Pattern.
 *
 * Example: `"1.0.0"`, `"0.1.0"`, `"0.0.1"`.
 */
/**
 * String that follows CLI Flags Pattern.
 *
 * Example: `"-v"`, `"--version"`, `"-h"`, `"--version"`.
 */
declare type FlagString = string;
/**
 * Command-Line Text.
 *
 * use `{cliName}` - Name of this CLI you set.
 *
 * use `{cliVersion}` - Version of this CLI you set.
 */
declare type CMDString = string;
/**
 * values to use as an Option Type
 */
declare type OptionType = "string" | "number" | "boolean" | 0 | 1| 2;

/**
 * Commandow -> Command Class
 * @author [RealLowMaster]("https://github.com/RealLowMaster")
 */
declare class Command {
	/**
	 * Initialize a new `Command` for `Commandow`
	 * @param {string} name - Command Name
	 * @param {Command | null} parent - The Parent Command
	 */
	constructor(name: string, parent: Command | null);
	/**
	 * write description for this Command.
	 *
	 * @param {string} txt - Desciption Text
	 * @return {Command}
	 */
	description(text: string): Command;
	/**
	 * Write or Link a Function to be Executed when this command has been used.
	 * @param {function} action Action Function
	 * @return {Command}
	 */
	action(action: Function): Command;
	/**
	 * Add Option/Flag to this Command.
	 * @param {string} name - Option Full Name
	 * @param {OptionType} type - `string` or `0`, `boolean` or `1`, `number` or `2`
	 * @param {string|number|boolean|null} default_value - should be same type as Option Type or Null
	 * @param {string | undefined} [shortFormedName] - Option Short Version of Full Name
	 * @param {string | undefined} [description] - Option Description
	 * @param {Function | undefined} [action] - Action/Callback for the Option
	 * @returns {number} - Returns Index of Option
	 */
	add_option(
		type: OptionType,
		name: string,
		default_value: string | number | boolean | null,
		shortFormedName: string | undefined,
		description: string | undefined,
		action: Function | undefined
	): number;
	/**
	 * get an Option Index from its name or its short name.
	 * @param {string} name - Option Name or its short for name
	 * @returns {number} - -1 means it couldn't find the option!
	 */
	get_option_index(name: string): number;
	/**
	 * Set an Option Short Formed Name
	 * @param {string | number} option - The Option Name or Index
	 * @param {string} text - The Short Formed Name for the Option
	 * @returns {Command}
	 */
	optionShortName(option: string | number, text: string): Command;
	/**
	 * Set an Option Description
	 * @param {string | number} option - The Option Name or Index
	 * @param {string} text - The Text about what this Option is for
	 * @returns {Command}
	 */
	optionDescription(option: string | number, text: string): Command;
	/**
	 * Set an Action/Callback for the Option
	 * @param {string | number} option - The Option Name or Index
	 * @param {Function} action - a Function that execute when using the option
	 * @returns {Command}
	 */
	optionAction(option: string | number, action: Function): Command;
	/**
	 * Commands that has been Added.
	 * @returns {Command[]}
	 * @readonly
	 */
	readonly commands: Command[];
	/**
	 * Add new Command.
	 * @param {string} name Command name
	 * @returns {Command}
	 */
	add_Command(name: string): Command;
	/**
	 * Get Command Aliases
	 * @returns {string[]}
	 * @readonly
	 */
	readonly aliases: string[];
	/**
	 * Add Alias/Aliases for your Command.
	 * @param {...string} aliases - Alias/Aliases Name for the Command
	 * @returns {Command}
	 */
	alias(...aliases: string): Command;
	/**
	 * Check if given name is same with Command Name or 1 of its aliases
	 * @param {string} name - Name to check
	 * @returns {boolean}
	 */
	hasName(name: string): boolean;
	/**
	 * Check if given name is same with Children Commands Name or 1 of their aliases
	 * @param {string} name - Name to check
	 * @returns {boolean}
	 */
	hasNameInChildren(name: string): boolean;
	/**
	 * returns `true` if given name is same with Command Name or 1 of its aliases.
	 * returns `true` if given name is same with 1 of the Children Command Name or 1 of their aliases.
	 * @param {string} name - Name to check
	 * @returns {boolean}
	 */
	hasNameInFamily(name: string): boolean;
	/**
	 * Parse The Command to Run Actions
	 * @param {string[]} argv - argv from process.argv
	 * @param {number} start_index - index to start at. (Default: 2)
	 * @returns {void}
	 */
	parse(argv: string[], start_index: number): void;
}

/**
 * Commandow -> Main Module
 * @author [RealLowMaster]("https://github.com/RealLowMaster")
 */
declare class Commandow extends Command {
	/**
	 * Initialize a new `Commandow`.
	 *
	 * @param {string} name - write a name for this CLI.
	 * @author [RealLowMaster]("https://github.com/RealLowMaster")
	 * @version 0.0.1
	 */
	constructor(name: string);
	/**
	 * Version of this CLI/etc... .
	 *
	 * Default is: `"1.0.0"`.
	 * @returns {string}
	 * @readonly
	 */
	readonly version: string;

	/**
	 * set CLI Version number.
	 * @param {number} major - version when you make incompatible API changes
	 * @param {number} minor - version when you add functionality in a backward compatible manner
	 * @param {number} patch - version whem you make backward compatible bug fixes
	 * @returns {Commandow}
	 */
	versionNumber(major: number, minor: number, patch: number): Commandow;
	/**
	 * write a Text to be used for printing CLI version.
	 *
	 * use `{cliName}` - Name of this CLI, you set.
	 *
	 * use `{cliVersion}` - Version of this CLI you set.
	 *
	 * Default is: `"{cliName} - v{cliVersion}"`.
	 * @param text {@link CMDString} - write text to be printed in Command-Line.
	 */
	versionText(...text: CMDString[]): Commandow;
	/**
	 * write a text to be used as `version` flag Description in `help-menu`.
	 *
	 * Default is: `"print the version number"`.
	 * @param {CMDString} text {@link CMDString} - text of Description.
	 */
	versionDescription(text: CMDString): Commandow;
	/**
	 * write a text to be used as `help` flag Description in `help-menu`.
	 *
	 * Default is: `"display help for {cliName} commands"`.
	 * @param {CMDString} text {@link CMDString} - text of Description.
	 */
	helpDescription(text: CMDString): Commandow;
}

export = Commandow