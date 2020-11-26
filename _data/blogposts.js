const fetch = require("node-fetch");

// function to get blogposts
async function getAllBlogposts() {
    // max number of records to fetch per query
    const recordsPerQuery = 100;

    // number of records to skip (start at 0)
    let recordsToSkip = 0;

    let makeNewQuery = true;

    let blogposts = [];

    // make queries until makeNewQuery is set to false
    while (makeNewQuery) {
        try {
            // initiate fetch
            const data = await fetch('https://api.tpfc.co.nz/blog-posts?_sort=CreatedAt:DESC')

            // store the JSON response when promise resolves
            const response = await data.json();

            // handle CMS errors
            if (response.errors) {
                let errors = response.errors;
                errors.map((error) => {
                    console.log(error.message);
                });
                throw new Error("Houston... We have a CMS problem");
            }

            // update blogpost array with the data from the JSON response
            blogposts = blogposts.concat(response);

            // prepare for next query
            recordsToSkip += recordsPerQuery;

            // stop querying if we are getting back less than the records we fetch per query
            if (response.length < recordsPerQuery) {
                makeNewQuery = false;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    // format blogposts objects
    const blogpostsFormatted = blogposts.map((item) => {
        return {
            id: item.id,
            title: item.Title,
            slug: item.UrlRoute,
            body: item.Content,
            author: item.author,
            date: item.PublishedAt
        };
    });

    // return formatted blogposts
    return blogpostsFormatted;
}

// export for 11ty
module.exports = getAllBlogposts;