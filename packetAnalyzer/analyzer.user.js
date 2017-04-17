// ==UserScript==
// @name         m.io packet analyzer
// @version      0.0.1
// @description  Captures incoming and outgoing traffic between the Moomoo.io game server. 
// @author       The m.io project
// @match        http://moomoo.io/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(() => {
	window.stop();
	const OUT = 'https://github.com/wwwwwwwwwwwwwwwwwwwwwwwwwwwwww/m.io/blob/master/packetAnalyzer/sniff.js';
	const SCRIPT_OUT = '<script src="' + OUT + '"></script>\n';
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://moomoo.io/',
		onload: e => {
			document.open();
			document.write(SCRIPT_OUT + doc);
			document.close();
		}
	});
})();