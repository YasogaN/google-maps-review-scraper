import type { ParsedReview } from "./types.js";

/**
 * Parses an array of reviews and returns a minified JSON string.
 * @param {any[][]} reviews - Array of review data wrappers.
 * @returns {ParsedReview[]} An array of the parsed reviews.
 */
export default function parseReviews(reviews: any[][]): ParsedReview[] {
	if (!Array.isArray(reviews)) return [];

	const parsedReviews: ParsedReview[] = reviews.map((item) => {
		const review = Array.isArray(item[0]) ? item[0] : item;

		// Safety check for empty or malformed review wrappers
		if (!review) return null;

		const responseData = review[3];
		const hasResponse = !!responseData?.[14]?.[0]?.[0];

		return {
			review_id: review[0],
			time: {
				published: review[1]?.[2],
				last_edited: review[1]?.[3],
			},
			author: {
				name: review[1]?.[4]?.[5]?.[0],
				profile_url: review[1]?.[4]?.[5]?.[1],
				url: review[1]?.[4]?.[5]?.[2]?.[0],
				id: review[1]?.[4]?.[5]?.[3],
			},
			review: {
				rating: review[2]?.[0]?.[0],
				text: review[2]?.[15]?.[0]?.[0] || null,
				language: review[2]?.[14]?.[0] || null,
			},
			images: review[2]?.[2]?.map((image: any) => ({
				id: image[0],
				url: image[1]?.[6]?.[0],
				size: {
					width: image[1]?.[6]?.[2]?.[0],
					height: image[1]?.[6]?.[2]?.[1],
				},
				location: {
					friendly: image[1]?.[21]?.[3]?.[7]?.[0],
					lat: image[1]?.[8]?.[0]?.[2],
					long: image[1]?.[8]?.[0]?.[1],
				},
				caption: image[1]?.[21]?.[3]?.[5]?.[0] || null,
			})) || null,
			source: review[1]?.[13]?.[0],
			response: hasResponse ? {
				text: responseData[14][0][0] || null,
				time: {
					published: responseData[1] || null,
					last_edited: responseData[2] || null,
				},
			} : null
		};
	}).filter((r): r is ParsedReview => r !== null); // Remove any failed parses

	// Use null, 0 or no arguments for minified JSON as per your docstring
	return parsedReviews;
}