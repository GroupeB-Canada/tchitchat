/*! error-client.js - capte window.onerror et unhandledrejection, sans dépendance.
 *  Usage : <script>window.ERROR_MONITOR={url:"https://XXXX.lambda-url.ca-central-1.on.aws/",token:"JETON_PUBLIC",site:"comptab.ca"}</script>
 *          <script src="/error-client.js" defer></script>
 */
(function (w) {
  'use strict';
  var cfg = w.ERROR_MONITOR;
  if (!cfg || !cfg.url || !cfg.token) return;
  var site = cfg.site || w.location.hostname.replace(/^www\./, '');
  var sent = 0, MAX = cfg.maxPerPage || 10, seen = {};

  function send(message, stack) {
    try {
      message = String(message || 'Erreur inconnue').slice(0, 500);
      var key = message;
      if (sent >= MAX || seen[key]) return; // anti-tempête
      seen[key] = 1; sent++;
      var body = JSON.stringify({
        site: site, message: message, stack: String(stack || '').slice(0, 4000),
        url: w.location.href.slice(0, 500), userAgent: (w.navigator.userAgent || '').slice(0, 300),
        timestamp: new Date().toISOString()
      });
      w.fetch(cfg.url, {
        method: 'POST', body: body, keepalive: true, mode: 'cors', credentials: 'omit',
        headers: { 'content-type': 'application/json', 'x-error-token': cfg.token }
      }).catch(function () {});
    } catch (e) { /* ne jamais casser la page */ }
  }

  var prev = w.onerror;
  w.onerror = function (msg, src, line, col, err) {
    send(msg + (src ? ' (' + src + ':' + line + ':' + col + ')' : ''), err && err.stack);
    return typeof prev === 'function' ? prev.apply(this, arguments) : false;
  };
  w.addEventListener('unhandledrejection', function (ev) {
    var r = ev.reason;
    send('Promesse rejetée: ' + (r && r.message ? r.message : String(r)), r && r.stack);
  });
})(window);
