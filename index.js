
const REGEX = {
	FLAGS: /^(([-])?([-])?([a-zA-Z]+)(([-][a-zA-Z]+)+)?)$/,
	AZ: /^([a-zA-Z]+)$/,
	OPTION_NAME: /^(([-][-])?([a-zA-Z]+)(([-][a-zA-Z]+)+)?)$/
}
const OPTION_TYPES = ["string", "boolean", "number"]

class Command {
	// Properties
	#p = null;
	#a = []; //? Aliases
	#d = ""; //? Description
	#f = null; //? Action Function

	// Command
	#c = []; //? Commands Object
	#cn = []; //? Commands Name
	#ca = []; //? Sub Commands Aliases

	// Option
	#o = []; //? Options Name
	#os = []; //? Options Short Name
	#ot = []; //? Options Type
	#od = []; //? Options Description
	#ov = []; //? Options Values
	#oa = []; //? Options Action


	constructor(n, p) {
		if (typeof n != "string" || n.length == 0)
			throw new Error("new Command name should be a string!")

		if (p instanceof Command) {
			if (REGEX.AZ.exec(n) == null)
				throw new Error("only alphabets are allowed in Command name!")
			this.#p = p
		}

		
		this.name = n
		Object.defineProperty(this, "name", {
			writable: false,
			configurable: false,
			enumerable: false
		})
		
	}

	description(t) {
		if (typeof t != "string")
			throw new Error("type of Command description should be string!");

		this.#d = t;
		return this;
	}

	//* Option
	add_option(t, n, v, s, d, a) {
		if (typeof t == 'string') {
		t = OPTION_TYPES.indexOf(t)
		if (t < 0)
			throw new TypeError("The Type should be equal to <string|boolean|number !")
		} else if (typeof t == 'number') {
			if (t < 0 || t > 2)
				throw new Error('The Type should be betweeb 0 and 2!')
		} else
			throw new TypeError('The Type Argument should be string or number!')

		if (typeof n != "string")
			throw new TypeError("Option name should be a string!");
		if (REGEX.OPTION_NAME.exec(n) == null)
			throw new Error("name is in wrong pattern. (Ex. release, no-copy)")
		if (n[0] == "-") n = n.slice(2)

		if (v === undefined) v = null
		if (v != null) {
			if (typeof v != OPTION_TYPES[t])
				throw new TypeError("default_value should be same as the Option Type or set as null!")
		}

		const i = this.#o.length
		this.#o[i] = n
		this.#ot[i] = t
		this.#ov[i] = v
		this.#os[i] = null
		this.#od[i] = null
		this.#oa[i] = null

		s = s || null
		if (s != null) this.optionShortName(i, s)
		d = d || null
		if (d != null) this.optionDescription(i, d)
		a = a || null
		if (a != null) this.optionAction(i, a)
		return i;
	}

	get_option_index(n) {
		let i = this.#o.indexOf(n)
		if (i == -1) i = this.#os.indexOf(n)
		return i
	}

	#opIndex(i) {
		if (typeof i == 'string') {
			i = this.#o.indexOf(i)
			if (i < 0)
				throw new Error("Couldn't find the Option!")
		} else if (typeof i == 'number') {
			if (typeof this.#o[i] != 'string')
				throw new Error("Couldn't find the Option!")
		} else
			throw new TypeError("Type of option argument should be number or string !")
	}

	optionShortName(i, s) {
		i = this.#opIndex(i)

		if (typeof s != "string")
			throw new TypeError("short should be a string!")
		if (/^([-]?[a-zA-Z]+)$/.exec(s) == null)
			throw new Error("short is in wrong pattern. (Ex. r, nc)")
		if (s[0] == "-") s = s.slice(1)
		if (s == this.#o[i])
			throw new Error("short cannot be the same as Option name.")
		this.#os[i] = s
		return this
	}

	optionDescription(i, t) {
		i = this.#opIndex(i)

		if (typeof t != "string")
			throw new TypeError("description text should be a string!")
		this.#od[i] = t
		return this
	}

	optionAction(i, a) {
		i = this.#opIndex(i)

		if (typeof a != 'function')
			throw new TypeError('action should be a function!')
		this.#oa[i] = a
		return this
	}

	//* Command
	get commands() {
		return this.#c
	}

	add_Command(n) {
		n = n || null
		const cmd = new Command(n, this)
		const cn = cmd.name

		for (let i = 0, l = this.#c.length; i < l; i++) {
			if (this.#c[i].hasName(cn))
				throw new Error('a Command or an Alias with "' + cn + '" name already exists!')
		}

		this.#c.push(cmd)
		return cmd
	}

	//* Alias
	get aliases() {
		return this.#a;
	}

	alias(...n) {
		if (n == null || this.#a.length == 0) return this

		const aliases = this.#a
		for (let i = 0, l = n.length; i < l; i++) {
			// Is String
			if (typeof n[i] != 'string') {
				console.warn('[WARN] Command "' + this.name + '", alias at index ' + i + ' is not a string! (skipped)')
				continue
			}
			// Validate Character
			if (REGEX.AZ.exec(n[i]) == null){
				console.warn('[WARN] Command "' + this.name + '", alias at index ' + i + ' contains invalid characters! (skipped)')
				continue
			}
			// Same Name with Command or Command Aliases
			const tmp = (this.#p != null) ? this.#p.hasNameInChildren(n[i]) : this.hasName(n[i])
			if (tmp) {
				console.warn('[WARN] Command "' + this.name + '", alias at index ' + i + ' "' + n[i] + '" is same with a commands name or an alias! (skipped)')
				continue
			}

			aliases.push(n[i])
		}
		this.#a = aliases
	}

	hasName(n) {
		if (this.name == n || this.#a.includes(n)) return true
		return false
	}
	
	hasNameInChildren(n) {
		for (let i = 0, l = this.#c.length; i < l; i++) if (this.#c[i].hasName(n)) return true
		return false
	}

	hasNameInFamily(n) {
		if (this.name == n || this.#a.includes(n)) return true
		for (let i = 0, l = this.#c.length; i < l; i++) if (this.#c[i].hasName(n)) return true
		return false
	}


	//requiredOption() { }

	//allowUnknownOption() { }

	action(f) {
		if (typeof f != 'function')
			throw new TypeError("Action Should be a Funtion!")

		this.#f = f
		return this
	}
}

class Commandow extends Command {
	//* Version
	#v = "1.0.0";
	#vt = "{name} - v{version}";

	constructor(n) {
		super(n, null)
		
		// Add Version Option = Index 0
		this.add_option(1, 'version', false, 'v', 'print the version number')
		// Add Help Option = Index 1
		this.add_option(1, 'help', false, 'h', 'display help for {name} commands')
	}

	//* Version
	get version() {
		return this.#v
	}
	versionNumber(m, mi = 0, p = 0) {
		if (typeof m != 'number' || m < 0) throw new TypeError('versionNumber->major should be typeof number equal or bigger than 0!')
		if (typeof mi != 'number' || mi < 0) throw new TypeError('versionNumber->major should be typeof number equal or bigger than 0!')
		if (typeof p != 'number' || p < 0) throw new TypeError('versionNumber->major should be typeof number equal or bigger than 0!')

		const v = Math.floor(m) + "." + Math.floor(mi) + "." + Math.floor(p)
		if (/^([0-9]+[.][0-9]+[.][0-9]+)$/.exec(v) == null)
			throw new Error("version is in the wrong pattern. (ex. 1.0.0 or 0.0.1)");
		this.#v = v;
		return this;
	}

	/*
	 * set Flags to call this `CLI Version Print`.
	 *
	 * Default is: `('-v', '--version')`.
	 * @param {...FlagString} flags {@link FlagString} - write flags to be set for Version usage.
	 */
	//versionFlags(...flags: FlagString[]): Commandow;
	// versionFlags(...f) {
	// 	if (f.length == 0)
	// 		throw new Error("you should at least set 1 flag for version command!");
	// 	const r = [];
	// 	for (let i = 0, l = f.length; i < l; i++) {
	// 		if (typeof f[i] != "string")
	// 			throw new Error("flags index " + i + "is not string!");
	// 		if (REGEX.FLAGS.exec(f[i]) == null)
	// 			throw new Error("flags index " + i + " is in wrong pattern!");
	// 		r.push(f[i]);
	// 	}
	// 	this.#vf = r;
	// 	return this;
	// }
	versionText(...t) {
		if (t.length == 0)
			throw new Error("versionText need at least one argument")
		let r = "";
		for (const i of t) r += i + "\n"
		if (!r.includes("{version}"))
			throw new Error('version text should contain "{version}" for knowing where to print version number!')
		this.#vt = r
		return this
	}
	versionDescription(d) {
		this.optionDescription(0, d)
		return this
	}

	//* Help
	/*
	 * set Flags to call `CLI help-menu`.
	 *
	 * Default is: `('-h', '--help')`.
	 * @param {...FlagString} flags {@link FlagString} - write flags to be set for Help Menu usage.
	 */
	//helpFlags(...flags: FlagString[]): Commandow;
	// helpFlags(...f) {
	// 	if (f.length == 0)
	// 		throw new Error("you should at least set 1 flag for help command!");
	// 	const r = [];
	// 	for (let i = 0, l = f.length; i < l; i++) {
	// 		if (typeof f[i] != "string")
	// 			throw new Error("flags index " + i + "is not string!");
	// 		if (REGEX.FLAGS.exec(f[i]) == null)
	// 			throw new Error("flags index " + i + " is in wrong pattern!");
	// 		r.push(f[i]);
	// 	}
	// 	this.#hf = r;
	// 	return this;
	// }
	helpDescription(d) {
		this.optionDescription(1, d)
		return this
	}

	// #ADD Parse
	parse(a, s = 2) {
		

		// Check argv Type
		if (!Array.isArray(a))
			throw new TypeError("Type of Argv should be Array!")
		// Check start_index value
		if (typeof s != 'number' || s < 0)
			throw new Error("start_index should be a number greater than 0!")

		console.log(a)

		if (a.length <= s) {
			console.log('no-argv')
		}

		// if (a.length < s) {
		// 	if (typeof this.#ma == 'function') this.#ma({cwd: process.cwd()})
		// 	return
		// }

		for (let i = s, l = a.length; i < l; i++) {
			console.log(a[i])
		}
	}
}

module.exports = Commandow

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