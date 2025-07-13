import { describe, it, expect } from "vitest";
import { createChain, types, Tx, Chain } from "clarinet";

/// <reference types="vitest" />

describe("marketplace contract", () => {
  let chain: Chain;

  beforeEach(() => {
    chain = createChain();
  });

  it("should return the product when it exists", () => {
    const wallet_1 = chain.accounts.get("wallet_1")!.address;

    chain.mineBlock([
      Tx.contractCall("marketplace", "add-product", [
        types.ascii("Telefon"),
        types.uint(2000),
      ], wallet_1)
    ]);

    const result = chain.callReadOnlyFn("marketplace", "get-product", [
      types.uint(1)
    ], wallet_1);

    const product = result.result.expectOk().expectTuple();

    expect(product.name.expectAscii()).toBe("Telefon");
    expect(product.price.expectUint()).toBe(2000);
    expect(product.seller.expectPrincipal()).toBe(wallet_1);
    expect(product.buyer.expectNone()).toBeTruthy();
  });

  it("should return error if product not found", () => {
    const wallet_1 = chain.accounts.get("wallet_1")!.address;

    const result = chain.callReadOnlyFn("marketplace", "get-product", [
      types.uint(9999)
    ], wallet_1);

    result.result.expectErr().expectUint(404);
  });
});
