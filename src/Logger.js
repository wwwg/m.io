class Logger {
	static all(msg) {
		if (Logger.lvl >= Logger.LOG_ALL) {
			console.log(msg);
		}
	}
	static info(msg) {
		if (Logger.lvl >= Logger.LOG_INFO) {
			console.log(msg);
		}
	}
	static err(msg) {
		if (Logger.lvl >= Logger.LOG_ERR) {
			console.log(msg);
		}
	}
}
Logger.LOG_ALL = 0;
Logger.LOG_INFO = 1;
Logger.LOG_ERR = 2;
Logger.lvl = 1;
module.exports = Logger;