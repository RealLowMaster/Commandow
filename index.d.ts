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
declare type OptionType = "string" | "number" | "boolean";

/**
 * Commandow -> Command Option/Flag Class
 * @author [RealLowMaster]("https://github.com/RealLowMaster")
 */
export declare class Option {
	/**
	 * Initialize a new `Option` for `Commandow Commands`
	 * @param {string} name - Option Full Name
	 * @param {OptionType} type - Type of Option value
	 * @param {string | undefined} [short] - Option Short Version of Full Name
	 * @param {string} [description] - Option Description
	 * @param {Function | undefined} [action] - a Function to be execute when Option has been used
	 */
	constructor(
		name: string,
		type: string,
		short: string | undefined,
		description: string,
		action: Function | undefined
	);
	/**
	 * Set short form for the option name
	 * @param {string} shortFormedName - Short Name
	 * @returns {Option}
	 */
	short(shortFormedName: string);
}

/**
 * Commandow -> Command Class
 * @author [RealLowMaster]("https://github.com/RealLowMaster")
 */
export declare class Command {
	/**
	 * Initialize a new `Command` for `Commandow`
	 * @param {string} name - Command Name
	 */
	constructor(name: string);
	/**
	 * write an alias for this command.
	 *
	 * If you want multiple aliases, just call this method again.
	 *
	 * __Note__: Only the first alias will be shown in generated help.
	 *
	 * @param {...string} alias The Aliase Name or Names.
	 * @return {Command}
	 */
	alias(...alias: string[]): Command;
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
	 * @param {OptionType} type - Type of Option value
	 * @param {string | undefined} [shortFormedName] - Option Short Version of Full Name
	 * @param {string | undefined} [description] - Option Description
	 * @param {Function | undefined} [action] - a Function to be execute when Option has been used
	 */
	option(
		type: OptionType,
		name: string,
		shortFormedName: string | undefined,
		description: string | undefined,
		action: Function | undefined
	): Command;
	/**
	 *
	 */
}

/**
 * Commandow -> Main Module
 * @author [RealLowMaster]("https://github.com/RealLowMaster")
 */
export declare class Commandow {
	/**
	 * Initialize a new `Commandow`.
	 *
	 * @param name write a name for this CLI.
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
	 * set Flags to call this `CLI Version Print`.
	 *
	 * Default is: `('-v', '--version')`.
	 * @param {...FlagString} flags {@link FlagString} - write flags to be set for Version usage.
	 */
	versionFlags(...flags: FlagString[]): Commandow;
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
	 * set Flags to call `CLI help-menu`.
	 *
	 * Default is: `('-h', '--help')`.
	 * @param {...FlagString} flags {@link FlagString} - write flags to be set for Help Menu usage.
	 */
	helpFlags(...flags: FlagString[]): Commandow;
	/**
	 * write a text to be used as `help` flag Description in `help-menu`.
	 *
	 * Default is: `"display help for {cliName} commands"`.
	 * @param {CMDString} text {@link CMDString} - text of Description.
	 */
	helpDescription(text: CMDString): Commandow;

	/**
	 * Add new Command.
	 * @param {string} name Command name
	 * @param {string | undefined} description Command Description
	 * @returns {Command}
	 */
	add_Command(name: string, description: string | undefined): Command;
}
