# GITHUB FEEDS

### Run

```
docker-compose up
```
### Playground

- create-react-app
- octokit, sawyer, faraday and faraday-http-cache
- service workers?

### backlogs

- ~~Notify tab on new events~~
- ~~Keep trying to fetch requests even on network error. Maybe every 1min.~~
- ~~Display notification if any fetch failed~~
- ~~Make recently loaded events look different~~
- Warn before letting user reload the page

---

- 8s timeout to api calls
- '.' (dot) focus on first even. And 'j' / 'k' could be used to navigate elements
- CommitCommentEvent is pretty common. Handle it
- Not displaying errors on undefined? wtf
- favicon not always loading, weird situation with PUBLIC_URL

    172.18.0.1 - - [25/Aug/2017:01:49:52 +0000] "GET /%PUBLIC_URL%/favicon.ico HTTP/1.1" 400 173 "-" "-" "-"

- Missing comment when issue gets closed with a comment, click "Close and comment"
- tests
- Provide text input and check box for org name and private flag
- Make so timestamps are always updated
- Provide ignore checklist
- Infinite scrolling
- Filter by user
