const OPTION_TYPES = ["string", "boolean", "number"]

class Command {
	#a = []; //? aliases
	#d = "";
	#f = null;
	#o = []; //? Options Name
	#os = []; //? Options Short Name
	#ot = []; //? Options Type
	#od = []; //? Options Description
	#ov = []; //? Options Values


	constructor(n) {
		if (typeof n != "string" || n.length == 0)
			throw new Error("new Command name should be a string!");
		if (/^([a-zA-Z]+)$/.exec(n) == null)
			throw new Error("only alphabets are allowed in Command name");
		this.name = n;
		Object.defineProperty(this, "name", {
			writable: false,
			configurable: false,
			enumerable: false,
		});
	}

	/*
	alias(a) {
		if (typeof a != "string")
			throw new TypeError("alias should be a string!");
		if (/^([a-zA-Z])$/.exec(a) == null)
			throw new Error("alias" + a + "contains invalid characters.");

		if (a == this.name)
			throw new Error(
				"alias " + a + " cannot be the same as Command name!"
			);

		this.#a.push(a);
		return this;
	}
	*/

	description(t) {
		if (typeof t != "string")
			throw new Error("type of Command description should be string!");

		this.#d = t;
		return this;
	}

	add_option(t, n, s, v, d) {
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
		if (/^(([-][-])?([a-zA-Z]+)(([-][a-zA-Z]+)+)?)$/.exec(n) == null)
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

		s = s || null
		if (s != null) this.setOptionShort(i, s)
		d = d || null
		if (d != null) this.setOptionDescription(i, d)
		return i;
	}

	setOptionShort(i, s) {
		if (typeof i == 'string') {
			i = this.#o.indexOf(i)
			if (i < 0)
				throw new Error("Couldn't find the Option!")
		} else if (typeof i == 'number') {
			if (typeof this.#o[i] != 'string')
				throw new Error("Couldn't find the Option!")
		} else
			throw new TypeError("Type of option argument should be number or string !")

		if (typeof s != "string")
			throw new TypeError("short should be a string!")
		if (/^([-]?[a-zA-Z]+)$/.exec(s) == null)
			throw new Error("short is in wrong pattern. (Ex. r, nc)")
		if (s[0] == "-") s = s.slice(1)
		if (s == this.#o[i])
			throw new Error("short cannot be the same as Option name.")
		this.#os[i] = s;
		return i;
	}

	setOptionDescription(i, t) {
		if (typeof i == 'string') {
			i = this.#o.indexOf(i)
			if (i < 0)
				throw new Error("Couldn't find the Option!")
		} else if (typeof i == 'number') {
			if (typeof this.#o[i] != 'string')
				throw new Error("Couldn't find the Option!")
		} else
			throw new TypeError("Type of option argument should be number or string !")

		if (typeof t != "string")
			throw new TypeError("description text should be a string!")
		this.#od[i] = t
		return i
	}


	requiredOption() { }

	allowUnknownOption() { }

	action(f) {
		if (typeof f != 'function')
			throw new TypeError("Action Should be a Funtion!")

		this.#f = f
		return this
	}
}

class Commandow {
	#cwd; //? Current Working Directory => process.cwd()
	#frx = /^(([-])?([-])?([a-zA-Z]+)(([-][a-zA-Z]+)+)?)$/; //? flags RegExp
	#c = []; //? cmds names
	#ca = []; //? cmds aliases
	#caa = []; //? cmds all aliases
	#ma = null;
	//* Version
	#v = "1.0.0";
	#vf = ["-v", "--version"];
	#vd = "print the version number";
	#vt = "{name} - v{version}";
	//* Help
	#hf = ["-h", "--help"];
	#hd = "display help for {name} commands";

	constructor(n) {
		if (typeof n != "string")
			throw new Error("name is Require and should be a string");
		this.name = n;
		Object.defineProperty(this, "name", {
			writable: false,
			configurable: false,
			enumerable: false,
		});
		this.#cwd = process.cwd();
		this.cmds = [];
		this.opts = [];
	}

	//* Version
	get version() {
		return this.#v;
	}
	versionNumber(m, mi = 0, p = 0) {
		if (typeof m != 'number' || m < 0) throw new TypeError('Commandow.versionNumber->major should be typeof number equal or bigger than 0!')
		if (typeof mi != 'number' || mi < 0) throw new TypeError('Commandow.versionNumber->major should be typeof number equal or bigger than 0!')
		if (typeof p != 'number' || p < 0) throw new TypeError('Commandow.versionNumber->major should be typeof number equal or bigger than 0!')

		const v = m + "." + mi + "." + p
		if (/^([0-9]+[.][0-9]+[.][0-9]+)$/.exec(v) == null)
			throw new Error("version is in the wrong pattern. (ex. 1.0.0 or 0.0.1)");
		this.#v = v;
		return this;
	}
	versionFlags(...f) {
		if (f.length == 0)
			throw new Error("you should at least set 1 flag for version command!");
		const r = [];
		for (let i = 0, l = f.length; i < l; i++) {
			if (typeof f[i] != "string")
				throw new Error("flags index " + i + "is not string!");
			if (this.#frx.exec(f[i]) == null)
				throw new Error("flags index " + i + " is in wrong pattern!");
			r.push(f[i]);
		}
		this.#vf = r;
		return this;
	}
	versionText(...t) {
		if (t.length == 0)
			throw new Error("versionText need at least one argument");
		let r = "";
		for (const i in t) {
			r += i + "\n";
		}
		if (!r.includes("{version}"))
			throw new Error(
				'version text should contain "{version}" for knowing where to print version number!'
			);
		this.#vt = v;
		return this;
	}
	versionDescription(d) {
		if (typeof d != "string")
			throw new TypeError("versionDescription should be a string!");
		this.#vd = v;
		return this;
	}

	//* Help
	helpFlags(...f) {
		if (f.length == 0)
			throw new Error("you should at least set 1 flag for help command!");
		const r = [];
		for (let i = 0, l = f.length; i < l; i++) {
			if (typeof f[i] != "string")
				throw new Error("flags index " + i + "is not string!");
			if (this.#frx.exec(f[i]) == null)
				throw new Error("flags index " + i + " is in wrong pattern!");
			r.push(f[i]);
		}
		this.#hf = r;
		return this;
	}
	helpDescription(d) {
		if (typeof d != "string")
			throw new TypeError("helpDescription should be a string!");
		this.#hd = d;
		return this;
	}

	//* Command
	add_Command(n, ...a) {
		n = n || null
		const cmd = new Command(n)
		const cn = cmd.name
		if (this.#c.indexOf(cn) >= 0)
			throw new Error("Command with " + cn + " already exists!")

		const index = this.#c.length
		if (a != null) {
			if (Array.isArray(a)) {
				const aliases = []
				for (let i = 0, l = a.length; i < l; i++) {
					// Is String
					if (typeof a[i] != 'string') {
						console.warn('[WARN] Command "' + cn + '", alias at index ' + i + ' is not a string! (skipped)')
						continue
					}
					// Same Name With Command Name
					if (a[i] == cn) {
						console.warn('[WARN] Command "' + cn + '", alias at index ' + i + ' is same with the command name! (skipped)')
						continue
					}
					// Validate Character
					if (/^([a-zA-Z])$/.exec(a[i]) == null){
						console.warn('[WARN] Command "' + cn + '", alias at index ' + i + ' contains invalid characters! (skipped)')
						continue
					}
					// Same Name With Other Command Names
					if (this.#c.includes(a[i])) {
						console.warn('[WARN] Command "' + cn + '", alias at index ' + i + ' has same name with another command! (skipped)')
						continue
					}
					// Same Name With Other Aliases
					if (this.#caa.includes(a[i]) || aliases.includes(a[i])) {
						console.warn('[WARN] Command "' + cn + '", alias at index ' + i + ' has same name with another alias! (skipped)')
						continue
					}

					aliases.push(a[i])
					this.#caa.push(a[i])
				}
				this.#ca[index] = aliases
			} else
				throw new TypeError("alias value should be an Array of String!")
		}

		this.cmds[index] = cmd
		this.#c[index] = cn
		return cmd
	}

	setMainAction(f) {
		if (typeof f != 'function')
			throw new TypeError('MainAction should be a Funtion!')
		
		this.#ma = f
		return this
	}

	parse(a) {
		console.log(a)

		if (!Array.isArray(a))
			throw new TypeError("Type of Argv should be Array!")

		if (a.length < 2) {
			if (typeof this.#ma == 'function') this.#ma()
			return
		}

		for (let i = 2, l = a.length; i < l; i++) {
			console.log(a[i])
		}
	}
}

module.exports = {
	Commandow: Commandow,
	Command: Command
}

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