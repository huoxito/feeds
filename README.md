# GITHUB FEEDS

- ~~Accept org name via url param~~
- ~~Auto reload feed~~
- ~~Wrap up basic event formatting~~
  - ~~Horizontal scroll for content too wide~~

- ~~Notify tab on new events~~
- ~~Keep trying to fetch requests even on network error. Maybe every 1min.~~
- ~~Display notification if any fetch failed~~

- ~~Make recently loaded events look different~~
- ~~What looks like running in 'production'?~~

- Not displaying errors on undefined? wtf
- Warn before letting user reload the page

---

- see docker image FROM node:8.2.1-alpine
- favicon not always loading, weird situation with PUBLIC_URL

    172.18.0.1 - - [25/Aug/2017:01:49:52 +0000] "GET /%PUBLIC_URL%/favicon.ico HTTP/1.1" 400 173 "-" "-" "-"

- Missing comment when issue gets closed with a comment, click "Close and comment"
- tests
- Provide text input and check box for org name and private flag
- Make so timestamps are always updated
- Provide ignore checklist
- Infinite scrolling
- Filter by user
- ~~Show commits pushed and PRs merged~~
- ~~Localize timestamps~~
- ~~Experiment with conditional requests https://developer.github.com/v3/#conditional-requests~~

- ~~Keep 100 messages max in list?~~

### Playground

- read octokit, sawyer, faraday and faraday-http-cache
- wtf are promises for fuck sake, learn it
- service workers?
