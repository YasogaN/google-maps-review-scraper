import { describe, expect, it } from "vitest";
import { Impit } from "impit";
import { createClient } from "../../src/client.js";

describe("createClient", () => {
  it("creates a client without a proxy", () => {
    const client = createClient({ proxy: { url: undefined } });
    expect(client).toBeInstanceOf(Impit);
  });

  it("creates a client with a proxy and TLS errors ignored", () => {
    const client = createClient({ proxy: { url: "http://proxy:8080", tls: true } });
    expect(client).toBeInstanceOf(Impit);
  });

  it("defaults tls to false when it is omitted", () => {
    const client = createClient({ proxy: { url: "http://proxy:8080" } });
    expect(client).toBeInstanceOf(Impit);
  });

  it("ignores tls when the proxy url is not set", () => {
    const client = createClient({ proxy: { url: undefined, tls: true } });
    expect(client).toBeInstanceOf(Impit);
  });
});
