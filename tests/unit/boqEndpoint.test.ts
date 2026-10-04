import { describe, expect, it } from "vitest";
import getBoqUrl from "../../src/boqEndpoint.js";

const BASE =
  "https://www.google.com/httpservice/web/PrivateLocalSearchUiDataService/GetLocalBoqProxy?msc=gwsrpc&reqpld=";

function payload(url: string): unknown[][] {
  const parsed = new URL(url);
  return JSON.parse(parsed.searchParams.get("reqpld") ?? "") as unknown[][];
}

describe("getBoqUrl", () => {
  it("builds a first-page URL without a pagination token", () => {
    const url = getBoqUrl({ placeId: "0xabc:0xdef", sortOrder: 2 });
    expect(url.startsWith(BASE)).toBe(true);

    const reqpld = payload(url);
    const inner = reqpld[1]![9] as unknown[];
    expect(inner[1]).toBe(2);
    expect(inner[9]).toBe(10);
    expect(inner[11]).toEqual(["0xabc:0xdef"]);
    expect(inner[19]).toBeUndefined();
  });

  it("builds a paginated URL including the token", () => {
    const url = getBoqUrl({ placeId: "place", sortOrder: 4, paginationToken: "tok" });
    const reqpld = payload(url);
    const inner = reqpld[1]![9] as unknown[];
    expect(inner[1]).toBe(4);
    expect(inner[11]).toEqual(["place"]);
    expect(inner[19]).toBe("tok");
  });

  it("defaults the pagination token to an empty string", () => {
    const withDefault = getBoqUrl({ placeId: "place", sortOrder: 1 });
    const withEmpty = getBoqUrl({ placeId: "place", sortOrder: 1, paginationToken: "" });
    expect(withDefault).toBe(withEmpty);
  });
});
