// Class definition for OpenBrowserUtil
export default class OpenBrowserUtil {
	// Static method to open a given URL in the default browser
	static async open(url: any) {
		try {
			// Dynamically import the "open" module
			const openModule = await import("open");
			const open = openModule.default;

			// Use the "open" module to open the URL in the default browser
			await open(url);
		} catch (error: any) {
			// Log an error message if there is any issue opening the browser
			console.error("Error opening browser:", error.message);
		}
	}
}
