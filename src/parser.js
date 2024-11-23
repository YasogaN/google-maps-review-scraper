export default async function parser(reviews) {
    return JSON.stringify(await Promise.all(reviews.map(review => {
        review = review[0];
        const parsedReview = {
            review_id: review[0],
            time: {
                published: review[1][2],
                last_edited: review[1][3],
            },
            author: {
                name: review[1][4][5][0],
                profile_url: review[1][4][5][1],
                url: review[1][4][5][2][0],
                id: review[1][4][5][3],
            },
            review: {
                rating: review[2][0][0],
                text: review[2][15] ? review[2][15][0][0] : null,
                langage: review[2][14] ? review[2][14][0] : null,
            },
            images: review[2][2] ? review[2][2].map(image => {
                return {
                    id: image[0],
                    url: image[1][6][0],
                    size: {
                        width: image[1][6][2][0],
                        height: image[1][6][2][1],
                    },
                    location: {
                        friendly: image[1][21][3][7][0],
                        lat: image[1][8][0][2],
                        long: image[1][8][0][1],
                    },
                    caption: image[1][21][3][5] ? image[1][21][3][5][0] : null,
                }
            }) : null,
            source: review[1][13][0]
        }
        return parsedReview;
    })), null, 2);
}