class Commandow {
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
