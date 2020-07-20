const util = require(`util`);
const fs = require(`fs`);
const plist = require(`plist`);

const exec = util.promisify(require(`child_process`).exec);
const readFile = util.promisify(fs.readFile);

const TMP_FILE = `/tmp/btdefaults`;

const listeningModes = {
	1: `OFF`,
	2: `NOISE CANCELLING`,
	3: `SIDETONE`,
};

async function getStatus() {
	await exec(
		`defaults export /Library/Preferences/com.apple.Bluetooth ${TMP_FILE}`
	);
	await exec(`plutil -convert xml1 ${TMP_FILE}`);

	const btPlist = await readFile(TMP_FILE, `utf8`);
	const parsed = plist.parse(btPlist);

	let inEar = false;
	let listeningMode = 1;
	parsed.BRPairedDevices.forEach((device) => {
		const info = parsed.DeviceCache[device];

		if (`InEar` in info) inEar = info.InEar;
		if (`ListeningMode` in info) listeningMode = info.ListeningMode;
	});

	return `John's AirPods are ${
		inEar ? `IN EAR` : `NOT IN EAR`
		} and set to ${listeningModes[listeningMode]}. He ${
		listeningMode === 2
			? `SHOULD NOT BE DISTURBED`
			: `CAN BE BOTHERED`
		}.`;
}

module.exports = getStatus;
