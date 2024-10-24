class Option {
	constructor(n, short, type, desc) {
		n = n || null;
		if (typeof n != "string")
			throw new TypeError("Option name should be a string!");
		if (/^(([-][-])?([a-zA-Z]+)(([-][a-zA-Z]+)+)?)$/.exec(n) == null)
			throw new Error("name is in wrong pattern. (Ex. release, no-copy)");
		if (n[0] == "-") n = n.slice(2);
		this._name = n;
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

	short(s) {
		if (typeof s != "string")
			throw new TypeError("short should be a string!");
		if (/^([-]?[a-zA-Z]+)$/.exec(s) == null)
			throw new Error("short is in wrong pattern. (Ex. r, nc)");
		if (s[0] == "-") s = s.slice(1);
		if (s == this._name)
			throw new Error("short cannot be the same as Option name.");
		this._short = s;
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

class Command {
	#a = []; //? aliases
	#d = "";

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

	description(t) {
		if (typeof t != "string")
			throw new Error("type of Command description should be string!");

		this.#d = t;
		return this;
	}

	option(type, name, shortFormedName, description, action) {
		// #ADD
	}

	requiredOption() { }

	allowUnknownOption() { }

	action() { }
}

class Commandow {
	#cwd; //? Current Working Directory => process.cwd()
	#frx = /^(([-])?([-])?([a-zA-Z]+)(([-][a-zA-Z]+)+)?)$/; //? flags RegExp
	#c = []; //? cmds names
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

		if (typeof v != "string") throw new TypeError("version should be a string!");
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
	add_Command(n, d) {
		n = n || null;
		d = d || null;
		const cmd = new Command(n);
		const cmd_name = cmd.name;
		if (this.#c.indexOf(cmd_name) >= 0)
			throw new Error("Command with " + cmd_name + " already exists!");

		if (typeof d == "string") cmd.description(d);
		this.cmds.push(cmd);
		return cmd;
	}
}

module.exports = {
	Commandow: Commandow,
	Command: Command,
	Option: Option
}