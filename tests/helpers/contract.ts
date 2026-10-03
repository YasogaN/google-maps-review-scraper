/**
 * Helpers for detecting changes in the raw BOQ response shape.
 *
 * The Google Maps endpoint is undocumented and can change without notice. The
 * live suite compares the observed structure against a committed schema and
 * against the structural assumptions the parser relies on, so a change in the
 * response surfaces as a failing (scheduled) test instead of silent breakage.
 */

export interface BoqSchema {
  /** Minimum number of reviews the endpoint is expected to return. */
  reviewLength: { min: number };
  /** Allowed types per top-level review index. Optional fields may be absent. */
  indices: Record<string, string[]>;
  /** Top-level indexes that must always be present. */
  requiredIndices: string[];
}

/** Classify a raw JSON value for shape comparison. */
export function kind(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/** Map each top-level review index to the set of types observed across reviews. */
export function topLevelShape(reviews: unknown[]): Record<string, string[]> {
  const byIndex: Record<string, Set<string>> = {};
  for (const review of reviews) {
    if (!Array.isArray(review)) continue;
    review.forEach((element, index) => {
      (byIndex[String(index)] ??= new Set()).add(kind(element));
    });
  }
  return Object.fromEntries(
    Object.entries(byIndex)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([index, types]) => [index, [...types].sort()]),
  );
}

/** Return human-readable violations of the committed response schema. */
export function schemaViolations(reviews: unknown[], schema: BoqSchema): string[] {
  const problems: string[] = [];
  const observed = topLevelShape(reviews);

  for (const [index, types] of Object.entries(observed)) {
    const allowed = schema.indices[index];
    if (!allowed) {
      problems.push(`new top-level index ${index} appeared (types: ${types.join(", ")})`);
      continue;
    }
    for (const type of types) {
      if (!allowed.includes(type)) {
        problems.push(`index ${index} has new type "${type}" (allowed: ${allowed.join(", ")})`);
      }
    }
  }

  for (const required of schema.requiredIndices) {
    if (!observed[required]) problems.push(`required index ${required} is missing`);
  }

  if (reviews.length < schema.reviewLength.min) {
    problems.push(`only ${reviews.length} reviews returned (expected at least ${schema.reviewLength.min})`);
  }

  return problems;
}

/**
 * Return violations of the structural assumptions `boqParser` relies on.
 * These are the invariants that, if broken by Google, break parsing.
 */
export function contractViolations(reviews: unknown[]): string[] {
  const problems: string[] = [];

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return ["no reviews returned"];
  }

  reviews.forEach((review, index) => {
    if (!Array.isArray(review)) {
      problems.push(`review ${index} is not an array`);
      return;
    }
    if (review.length < 6) problems.push(`review ${index} is shorter than 6 (${review.length})`);
    if (typeof review[1] !== "number") problems.push(`review ${index} rating is not a number`);
    if (!Array.isArray(review[2])) problems.push(`review ${index} time is not an array`);
    if (!Array.isArray(review[3])) problems.push(`review ${index} author is not an array`);
    if (typeof review[5] !== "string") problems.push(`review ${index} id is not a string`);

    if (!review.some(element => Array.isArray(element) && element[0] === "Google")) {
      problems.push(`review ${index} has no Google source anchor`);
    }

    const response = review[4];
    if (response !== null && response !== undefined) {
      if (!Array.isArray(response)) problems.push(`review ${index} response is not an array or null`);
      else if (response[2] != null && typeof response[2] !== "string") {
        problems.push(`review ${index} response text is not a string`);
      }
    }
  });

  return problems;
}
