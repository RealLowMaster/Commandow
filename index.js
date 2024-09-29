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
	versionNumber(v) {
		if (typeof v != "string")
			throw new TypeError("version should be a string!");
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
}
