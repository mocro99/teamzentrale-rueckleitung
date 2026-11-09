// Statische HTTPS-Weiterleitungsseite für die Meta-Anmelderückleitung (Instagram API mit Unified Login).
// Meta akzeptiert nur HTTPS-Rückleitungen; die Teamzentrale läuft lokal auf http://localhost:4173.
// Diese Seite gibt AUSSCHLIESSLICH die OAuth-Antwortparameter an das FEST eingetragene lokale Ziel weiter:
// kein offenes Weiterleiten, keine Speicherung, keine Netzwerkanfrage, keine Fremdskripte.
// Der Code allein ist wertlos: Er ist einmalig und braucht zum Tausch das Meta-App-Geheimnis, das nur auf deinem Rechner liegt;
// der state ist einmalig, 10 Minuten gültig und an den startenden Browser gebunden (Cookie der Teamzentrale).
(() => {
  'use strict';
  const ZIEL = 'http://localhost:4173/api/verbindungen/instagram/rueckleitung';
  const ERLAUBT = ['code', 'state', 'error', 'error_reason', 'error_description', 'error_code', 'error_message'];
  const MUSTER = /^[\x20-\x7E]{1,2000}$/; // nur druckbare ASCII-Zeichen, begrenzte Länge
  const ein = new URLSearchParams(window.location.search);
  // Adresse sofort säubern, damit Code und state nicht im Verlauf dieser Seite stehen bleiben.
  try { window.history.replaceState(null, '', window.location.pathname); } catch { /* ohne Wirkung auf die Weiterleitung */ }
  const aus = new URLSearchParams();
  for (const k of ERLAUBT) {
    const w = ein.get(k);
    if (w !== null && MUSTER.test(w)) aus.set(k, w);
  }
  const hinweis = document.getElementById('hinweis');
  if (!aus.has('state') || !(aus.has('code') || aus.has('error'))) {
    hinweis.textContent = 'Keine gültige Antwort von Meta erhalten. Bitte die Verbindung in der Teamzentrale neu starten.';
    return;
  }
  window.location.replace(`${ZIEL}?${aus.toString()}`);
})();
