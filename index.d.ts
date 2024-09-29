// Type Definitions for Commandow v0.0.1
// Project Repository: https://github.com/RealLowMaster/commandow
// Definition by: RealLowMaster <https://github.com/RealLowMaster>
// Definition: https://github.com/RealLowMaster/commandow/index.d.ts

/**
 * String that follows Version Pattern.
 *
 * Example: `"1.0.0"`, `"0.1.0"`, `"0.0.1"`.
 */
declare type VersionLikeString = string;
/**
 * String that follows CLI Flags Pattern.
 *
 * Example: `"-v"`, `"--version"`, `"-h"`, `"--version"`.
 */
declare type FlagString = string;
/**
 * Command-Line Text.
 *
 * use `{name}` - Name of this CLI you set.
 *
 * use `{version}` - Version of this CLI you set.
 */
declare type CMDString = string;

/**
 * Commandow module Main class
 * @author [RealLowMaster]("https://github.com/RealLowMaster")
 */
declare class Commondow {
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
	 * @returns {VersionLikeString} {@link VersionLikeString}
	 * @readonly
	 */
	readonly version: VersionLikeString;

	/**
	 * set CLI Version number.
	 */
	versionNumber(version: VersionLikeString): Commondow;
	/**
	 * set Flags to call this `CLI Version Print`.
	 *
	 * Default is: `('-v', '--version')`.
	 * @param {...FlagString} flags {@link FlagString} - write flags to be set for Version usage.
	 */
	versionFlags(...flags: FlagString[]): Commondow;
	/**
	 * write a Text to be used for printing CLI version.
	 *
	 * use `{name}` - Name of this CLI. you set.
	 *
	 * use `{version}` - Version of this CLI you set.
	 *
	 * Default is: `"{name} - v{version}"`.
	 * @param text {@link CMDString} - write text to be printed in Command-Line.
	 */
	versionText(...text: CMDString[]): Commondow;
	/**
	 * write a text to be used as `version` flag Description in `help-menu`.
	 *
	 * Default is: `"print the version number"`.
	 * @param {CMDString} text {@link CMDString} - text of Description.
	 */
	versionDescription(text: CMDString): Commondow;

	/**
	 * set Flags to call `CLI help-menu`.
	 *
	 * Default is: `('-h', '--help')`.
	 * @param {...FlagString} flags {@link FlagString} - write flags to be set for Help Menu usage.
	 */
	helpFlags(...flags: FlagString[]): Commondow;
	/**
	 * write a text to be used as `help` flag Description in `help-menu`.
	 *
	 * Default is: `"display help for {name} commands"`.
	 * @param {CMDString} text {@link CMDString} - text of Description.
	 */
	helpDescription(text: CMDString): Commondow;
}

export = Commondow;
