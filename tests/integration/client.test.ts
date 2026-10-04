import { beforeEach, describe, expect, it, vi } from "vitest";

const { ImpitMock } = vi.hoisted(() => ({ ImpitMock: vi.fn() }));

vi.mock("impit", () => ({ Impit: ImpitMock }));

import { createClient } from "../../src/client.js";

beforeEach(() => {
  ImpitMock.mockReset();
});

describe("createClient", () => {
  it("creates a client without proxy options when no proxy is configured", () => {
    createClient({ proxy: { url: undefined } });

    expect(ImpitMock).toHaveBeenCalledTimes(1);
    const options = ImpitMock.mock.calls[0]![0] as Record<string, unknown>;
    expect(options).not.toHaveProperty("proxyUrl");
    expect(options).not.toHaveProperty("ignoreTlsErrors");
  });

  it("passes the proxy url and ignores TLS errors when requested", () => {
    createClient({ proxy: { url: "http://proxy:8080", tls: true } });

    const options = ImpitMock.mock.calls[0]![0] as Record<string, unknown>;
    expect(options.proxyUrl).toBe("http://proxy:8080");
    expect(options.ignoreTlsErrors).toBe(true);
  });

  it("defaults ignoreTlsErrors to false when tls is omitted", () => {
    createClient({ proxy: { url: "http://proxy:8080" } });

    const options = ImpitMock.mock.calls[0]![0] as Record<string, unknown>;
    expect(options.proxyUrl).toBe("http://proxy:8080");
    expect(options.ignoreTlsErrors).toBe(false);
  });

  it("ignores tls when the proxy url is not set", () => {
    createClient({ proxy: { url: undefined, tls: true } });

    const options = ImpitMock.mock.calls[0]![0] as Record<string, unknown>;
    expect(options).not.toHaveProperty("proxyUrl");
    expect(options).not.toHaveProperty("ignoreTlsErrors");
  });
});
