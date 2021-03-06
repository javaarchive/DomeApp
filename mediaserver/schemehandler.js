const URI = require("uri");
const assert = require("assert");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
let getYTData;
try {
	getYTData = require("./ytinfo.js");
} catch (ex) {
	console.warn("YouTube data fetcher could not be loaded");
}

// TODO: Fallback to updatable exe on not python found
async function checkPython3isAvalible() {
	try {
		const { stdout, stderr } = await exec("python --version");
		if (stdout.startsWith("Python 3")) {
			return true;
		} else {
			return false;
		}
	} catch (ex) {
		return false;
	}
}
async function getYTDataPython(id) {
	const { stdout, stderr } = await exec("python ytinfo.py " + id);
	try {
		return JSON.parse(stdout);
	} catch (ex) {
		throw "Unable to use youtube-dl to load info " + stdout.slice(0, 1000);
	}
	//console.log('stdout:', stdout);
	//console.log('stderr:', stderr);
}
module.exports = async function (uri) {
	let comps = uri.split("://");
	assert(comps.length == 2);
	console.log(comps);

	switch (comps[0]) {
		case "youtube":
			let pageData;
			try {
        pageData = await getYTData(comps[1]);
        return {
          duration: parseInt(pageData["videoDetails"]["lengthSeconds"])
        }
			} catch (ex) {
        console.log("Falling back to Python based information retrieval for youtube due to ",ex);
				if (await checkPython3isAvalible()) {
					pageData = await getYTDataPython(comps[1]);
					return {
						duration: pageData["duration"],
					};
				}
			}
			break;
		default:
			throw "Unrecgonized scheme: " + scheme;
	}
};
