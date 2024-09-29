class Option {
	/**
	 * Initialize a new `Option` for Commandow Commands
	 * @param {string} name - Option Long Name
	 * @param {string} [short] - Option Short Name
	 * @param {string} [type] - Option Value Type (default: `"string"`)
	 * @param {string} [desc] - Option Description
	 */
	constructor(name, short, type, desc) {
		name = name || null;
		if (typeof name != "string")
			throw new TypeError("Option name should be a string!");
		if (/^(([-][-])?([a-zA-Z]+)(([-][a-zA-Z]+)+)?)$/.exec(name) == null)
			throw new Error("name is in wrong pattern. (Ex. release, no-copy)");
		if (name[0] == "-") name = name.slice(2);
		this._name = name;
		this._short = null;
		this._desc = null;
		this._type = "string";

		short = short || null;
		if (short != null) this.short(short);
		desc = desc || null;
		if (desc != null) this.description(desc);
		type = type || null;
		if (type != null) this.type(type);
	}

	/**
	 * Set short form for the option name
	 * @param {string} short - Short Name
	 * @returns {Option}
	 */
	short(short) {
		if (typeof short != "string")
			throw new TypeError("short should be a string!");
		if (/^([-]?[a-zA-Z]+)$/.exec(short) == null)
			throw new Error("short is in wrong pattern. (Ex. r, nc)");
		if (short[0] == "-") short = short.slice(1);
		if (short == this._name)
			throw new Error("short cannot be the same as Option name.");
		this._short = short;
		return this;
	}

	/**
	 * write a Description for Option to be used in help list.
	 * @param {string} txt - Description Text
	 * @returns {Option}
	 */
	description(txt) {
		if (typeof txt != "string")
			throw new TypeError("description text should be a string!");
		this._desc = txt;
		return this;
	}

	/**
	 * Set Type of The Option value.
	 * @param {string} type - Type Name
	 * @returns {Option}
	 */
	type(type) {
		const t = ["string", "boolean", "number"];
		if (t.indexOf(type) == -1)
			throw new Error("type should be equal to <string|boolean|number>");
		this._type = type;
	}
}

/**
 * Commandow -> Command Class
 */
class Command {
	#a = []; //? aliases
	#d = "";
	/**
	 * Initialize a new `Command` for Commandow
	 * @param {string} name - Command Name
	 */
	constructor(name) {
		if (typeof name != "string" || name.length == 0)
			throw new Error("new Command name should be a string!");
		if (/^([a-zA-Z]+)$/.exec(name) == null)
			throw new Error("only alphabets are allowed in Command name");
		this.name = name;
		Object.defineProperty(this, "name", {
			writable: false,
			configurable: false,
			enumerable: false,
		});
	}

	/**
	 * write an alias for this command.
	 *
	 * If you want multiple aliases, just call this method again.
	 *
	 * __Note__: Only the first alias will be shown in generated help.
	 *
	 * @param {string} alias
	 * @return {Command}
	 */
	alias(alias) {
		if (typeof alias != "string")
			throw new TypeError("alias should be a string!");
		if (/^([a-zA-Z])$/.exec(alias) == null)
			throw new Error("alias" + alias + "contains invalid characters.");

		if (alias == this.name)
			throw new Error(
				"alias " + alias + " cannot be the same as Command name!"
			);

		this.#a.push(alias);
		return this;
	}

	/**
	 * write description for this Command.
	 *
	 * @param {string} txt - Desciption Text
	 * @return {Command}
	 */
	describe(txt) {
		if (typeof txt != "string")
			throw new Error("type of Command description should be string!");

		this.#d = txt;
		return this;
	}

	option(flags, description, fn, defaultValue) {
		return this._optionEx({}, flags, description, fn, defaultValue);
	}

	requiredOption() {}

	allowUnknownOption() {}

	action() {}
}

/**
 * Commandow module Main class
 * @author [RealLowMaster]("https://github.com/RealLowMaster")
 */
class Commandow {
	/**
	 * Add new Command
	 * @param {string} name Command name
	 * @param {string|undefined} desc Command Description
	 * @returns {Command}
	 */
	add_Command(name, desc) {
		name = name || null;
		desc = desc || null;
		const cmd = new Command(name);
		const cmd_name = cmd.name;
		if (this.#c.indexOf(cmd_name) >= 0)
			throw new Error("Command with " + cmd_name + " already exists!");

		if (typeof desc == "string") cmd.description(desc);
		return cmd;
	}

	add_Flags(...name) {}

	/**
	 *
	 * @param {array[string]} argv
	 * @param {number} sliceIndex
	 * @returns {undefined}
	 */
	Parse(argv, sliceIndex = 2) {
		this._rawArgs = args;

		//? Check [argv] type
		if (!Array.isArray(argv))
			throw new TypeError("arguments should be an array of string");
		//? slice [arg]
		if (sliceIndex > 0) {
		}
		for (const i in arguments) {
			if (typeof i == "string") args.push();
		}

		const args = this._rawArgs.slice(sliceIndex);
		// if (args.length < this.#min_arg) {
		// 	console.error(
		// 		"---| Error |--- >>> minimum arguments needed is " + this.#min_arg
		// 	);
		// 	return;
		// }
	}
}

module.exports = Commandow;
// module.exports.Command = Command;
// module.exports.Option = Option;

/*
C:\Users\LowMaster>androidjs -h
node
Usage: bin [options] [command]

Android-Js Builder: 2.3.2

Options:
  -v, --version      output the version number
  -h, --help         display help for command

Commands:
  init [options]     Create new project
  build|b [options]  Build project
  update|u           Update module
  help [command]     display help for command
	*/
