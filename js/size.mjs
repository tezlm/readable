export default function fmtSize(size) {
	if (size === 0) return "empty";
	if (size === 1) return "1 byte";

	const sizes = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];
	let maxSize = 1024;
	for(let i = 0; i < sizes.length; i++) {
		if(size < maxSize) {
			const inUnit = Math.floor(size / (maxSize / 10240)) / 10;
			return `${inUnit} ${sizes[i]}`;
		}
		maxSize *= 1024;
	}

	return "very big";
}
