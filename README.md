# FEEDS

### Github oauth app setup

- Visit [Developer Settings](https://github.com/settings/developers) and create new OAuth app
- Setup auth callback URL to {your-domain}/auth/callback

### Configure ENV vars

Set these on your local .env and / or on heroku:

```
CLIENT_APP_ID=client-id-from-github-oauth-app
CLIENT_APP_SECRET=client-secret-from-github-oauth-app
SECRET_COOKIE=crazy-random-string
```

### Development

Start sinatra application with:

```
./application.rb
```

Visit localhost:4567/auth for github oauth. 

Start react app:

```
cd client && yarn start 
```

### Deploy

Configure heroku cli and add heroku git remote url (deploy script expects a remote named "heroku").

```
./deploy.sh
```

### THE MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
