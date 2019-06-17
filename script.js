GraphQL = (function(){
    function createClient(endpoint){
        async function query(query_string, callback) {
            const options = {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                },
                body: JSON.stringify({
                    query: query_string,
                    variables: null
                })
            };

            let res = await fetch(endpoint, options);
            callback(res.json());     
        }

        return {query};
    }
  
    return {createClient};
  })();

  let client = GraphQL.createClient("https://www.graphqlhub.com/graphql");

  let query = `
  {
    hn {
      topStories(limit:30, offset:0) {
        title,
        score,
        descendants,
        time,
        url
        by {
            id
        }
      }
    }
  }
  `;

(async () => {
    client.query(query, async (res) => {
        const response = await res;
        const topStories = response.data.hn.topStories;
        console.log(topStories);

        let tr1, tr2, trSpace, url; // Define outside loop so variable is not reinstantiated on every iteration
        let main = document.getElementById('article-main');
        //console.log(Date(1560794504));
        topStories.forEach((el, i) => {
            url = (new URL(el.url)).host.split(".");
            url = url.length > 2 ? url.slice(1).join(".") : url.join(".");

            let then = new Date(el.time).getTime();
            let now = Math.ceil(new Date().getTime()/1000)

            let hours = Math.floor((now - then) / (60*60));
            // console.log(hours);

            tr1 = document.createElement("tr");
            tr1.className = "article-top";
            tr1.innerHTML = `
                <td align="right">
                    <span class="number">${i+1}.</span>
                </td>
                <td align="right">
                    <a href=""><img class="vote" src="https://news.ycombinator.com/grayarrow2x.gif"></a>
                </td>
                <td>
                    <a href="" class="article-link">${el.title}</a>
                    <span class="article-site">(<a href="">${url}</a>)</span>
                </td>
            `;
            
            tr2 = document.createElement("tr");
            tr2.className = "article-sub";
            tr2.innerHTML = `
                <tr class="article-sub">
                    <td colspan="2"></td>
                    <td>
                        <span class="point">${el.score} points by <a href="">${el.by.id}</a> ${hours} hours ago | <a href"">hide</a> | <a href="">${el.descendants} comments</a></span>
                    </td>
                </tr>
            `;

            trSpace = document.createElement("tr");
            trSpace.className = "spacer";
            
            main.appendChild(tr1);
            main.appendChild(tr2);
            main.appendChild(trSpace);
        });

        trSpace = document.createElement("tr");
        trSpace.className = "spacer";

        let trMore = document.createElement("tr");
        trMore.innerHTML = `
            <td colspan="2"></td>
            <td><a href="" id="more-link">More</a></td>
        `;

        main.appendChild(trSpace);
        main.appendChild(trMore);
    });
})();
  