import { Clarinet, Tx, Chain, Account, types } from "@hirosystems/clarinet-sdk/vitest-helpers";

Clarinet.test({
  name: "Mint ve transfer doğru çalışıyor mu?",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let user1 = accounts.get("wallet_1")!;
    let user2 = accounts.get("wallet_2")!;

    // Mint işlemi
    let mintBlock = chain.mineBlock([
      Tx.contractCall("token", "mint", [types.principal(user1.address), types.uint(500)], deployer.address)
    ]);

    mintBlock.receipts[0].result.expectOk().expectBool(true);

    // Transfer işlemi
    let transferBlock = chain.mineBlock([
      Tx.contractCall("token", "transfer", [types.principal(user2.address), types.uint(200)], user1.address)
    ]);

    transferBlock.receipts[0].result.expectOk().expectBool(true);

    // Bakiye kontrol
    let call1 = chain.callReadOnlyFn("token", "get-balance", [types.principal(user1.address)], user1.address);
    call1.result.expectOk().expectUint(300);

    let call2 = chain.callReadOnlyFn("token", "get-balance", [types.principal(user2.address)], user2.address);
    call2.result.expectOk().expectUint(200);
  }
});
