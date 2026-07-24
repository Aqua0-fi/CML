/**
 * Aqua0 Residency — Google Sheet receiver
 *
 * Turns a Google Sheet into the backend for the application form.
 * Each submission POSTed to the deployed web app becomes one row.
 *
 * Setup:
 *   1. Create (or open) a Google Sheet.
 *   2. Extensions > Apps Script. Delete the boilerplate, paste this file, Save.
 *   3. Deploy > New deployment > (gear) Web app.
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Deploy, then authorize (on the "unverified app" screen: Advanced >
 *      Go to project > Allow).
 *   4. Copy the Web app URL (ends in /exec).
 *   5. Put it in .env.local as:  RESIDENCY_FORM_ENDPOINT=<that url>
 *      then restart the dev server (and set the same var in your host for prod).
 *
 * After changing this code, redeploy: Deploy > Manage deployments > (pencil) >
 * Version: New version > Deploy. The /exec URL stays the same.
 */

const SHEET_NAME = "Applications";

// Column order in the sheet. Matches the fields the API forwards.
const COLUMNS = [
  "timestamp",
  "name",
  "email",
  "handle",
  "location",
  "role",
  "workingOn",
  "links",
  "defiExperience",
  "impressiveBuilt",
  "impressiveNonWork",
  "stayLength",
  "stayDates",
  "coverage",
  "coverageSituation",
  "buildExplore",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

    const row = COLUMNS.map(function (c) {
      if (c === "timestamp") return new Date();
      return data[c] || "";
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
