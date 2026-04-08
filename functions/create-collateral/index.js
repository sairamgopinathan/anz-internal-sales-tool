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

function toStoredArray(value) {
  return JSON.stringify(parseJsonArray(value));
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

function sanitizeSql(value) {
  return String(value).replace(/'/g, "''");
}

module.exports = async (context, basicIO) => {
  try {
    const app = catalyst.initialize(context, { scope: 'admin' });
    const link = basicIO.getArgument('link');

    if (!link) {
      basicIO.setStatus(400);
      basicIO.write(JSON.stringify({ error: 'Link is required.' }));
      context.close();
      return;
    }

    const duplicate = await app
      .zcql()
      .executeZCQLQuery(`SELECT ROWID, asset_name FROM collateral_entries WHERE link = '${sanitizeSql(link)}' LIMIT 1`);

    if ((duplicate || []).length) {
      const existingRecord = duplicate[0].collateral_entries || duplicate[0];
      basicIO.setStatus(409);
      basicIO.write(JSON.stringify({ error: `This link already exists for ${existingRecord.asset_name}.` }));
      context.close();
      return;
    }

    const table = app.datastore().table('collateral_entries');
    const insertedRow = await table.insertRow({
      asset_name: basicIO.getArgument('asset_name') || '',
      link,
      asset_type: basicIO.getArgument('asset_type') || '',
      stages: toStoredArray(basicIO.getArgument('stages')),
      situations: toStoredArray(basicIO.getArgument('situations')),
      competitors: toStoredArray(basicIO.getArgument('competitors')),
      segments: toStoredArray(basicIO.getArgument('segments')),
      industries: toStoredArray(basicIO.getArgument('industries')),
      tags: toStoredArray(basicIO.getArgument('tags')),
      intent: basicIO.getArgument('intent') || '',
      summary: basicIO.getArgument('summary') || '',
      recommended_when: basicIO.getArgument('recommended_when') || '',
      sort_priority: Number(basicIO.getArgument('priority') || 0),
    });

    basicIO.write(JSON.stringify(toRecord(insertedRow)));
    context.close();
  } catch (error) {
    basicIO.setStatus(500);
    basicIO.write(
      JSON.stringify({
        error: 'Failed to create collateral in Catalyst',
        details: error.message || String(error),
      }),
    );
    context.close();
  }
};
