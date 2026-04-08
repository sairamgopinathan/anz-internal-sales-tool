const catalyst = require('zcatalyst-sdk-node');

module.exports = async (context, basicIO) => {
  try {
    const app = catalyst.initialize(context, { scope: 'admin' });
    const id = basicIO.getArgument('id');

    if (!id) {
      basicIO.setStatus(400);
      basicIO.write(JSON.stringify({ error: 'Record id is required.' }));
      context.close();
      return;
    }

    const table = app.datastore().table('collateral_entries');
    await table.deleteRow(id);

    basicIO.write(JSON.stringify({ success: true }));
    context.close();
  } catch (error) {
    basicIO.setStatus(500);
    basicIO.write(
      JSON.stringify({
        error: 'Failed to delete collateral in Catalyst',
        details: error.message || String(error),
      }),
    );
    context.close();
  }
};
