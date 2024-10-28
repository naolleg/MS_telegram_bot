const { google } = require('googleapis');
const auth = require('../utils/auth');


async function readRowFromSheet(rowNumber) {
  try {
    const sheets = google.sheets('v4');
    const spreadsheetId = '1hv3Gx8Pvot1M1ulmE8CmwEtmfa2kguAL1BMluhikn1h54w';
    const range = `Sheet1!1:${rowNumber}`; // Read rows 1 to rowNumber

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      auth,
    });

    const data = response.data.values;
    if (data.length > 0) {
      const headerRow = data[0];
      const userRow = data[rowNumber - 1]; // Adjust the index to get the correct row

      const formattedData = headerRow.map((header, index) => {
        return `${header} - ${userRow[index]}`;
      }).join('\n');

      return formattedData;
    } else {
      return 'No data found in the spreadsheet.';
    }
  } catch (err) {
    console.error('Error reading data from sheet:', err);
    throw err;
  }
}

module.exports = { readRowFromSheet };
