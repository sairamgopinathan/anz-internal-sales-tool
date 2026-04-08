const catalyst = require('zcatalyst-sdk-node');

function parseJsonArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function toRecord(row) {
  return {
    id: String(row.ROWID),
    assetName: row.asset_name || '',
    link: row.link || '',
    assetType: row.asset_type || '',
    stages: parseJsonArray(row.stages),
    situations: parseJsonArray(row.situations),
    competitors: parseJsonArray(row.competitors),
    segments: parseJsonArray(row.segments),
    industries: parseJsonArray(row.industries),
    tags: parseJsonArray(row.tags),
    intent: row.intent || '',
    summary: row.summary || '',
    recommendedWhen: row.recommended_when || '',
    priority:
      row.sort_priority === null || typeof row.sort_priority === 'undefined'
        ? null
        : Number(row.sort_priority),
  };
}

module.exports = async (context, basicIO) => {
  try {
    const app = catalyst.initialize(context, { scope: 'admin' });
    const response = await app.zcql().executeZCQLQuery('SELECT * FROM collateral_entries');
    const rows = (response || []).map((item) => toRecord(item.collateral_entries || item));

    basicIO.write(JSON.stringify(rows));
    context.close();
  } catch (error) {
    basicIO.setStatus(500);
    basicIO.write(
      JSON.stringify({
        error: 'Failed to fetch collateral from Catalyst',
        details: error.message || String(error),
      }),
    );
    context.close();
  }
};
