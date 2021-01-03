# Ngrok Heroku Config Vars

![app image](https://i.imgur.com/IHzDwin.gif)

This NodeJS app was created as a personal tool. I self-host some web services and there was a requirement for them to be exposed.

It uses [ngrok](https://github.com/bubenshchykov/ngrok) and [heroku-cli](https://devcenter.heroku.com/articles/heroku-cli) to:

* Expose any web service
* Fetch the exposed url + port (ngrok's free tier changes this every time it runs)
* Upload url + port to any heroku's config variables

## How to use
All you have to do is edit the `.env` file and maybe `app.js`

## `.env` file example

```dosini
DB_DATABASE=your_db
DB_PASS=your_pass
DB_USER=your_username
EXPOSE_PORT=port_to_expose
EXPOSE_PROTO=tcp_or_http
HEROKU_APP=heroku_app_name
NGROK_TOKEN=ngrok_token
```

## `app.js` lines to edit
You can read more about this [here](https://devcenter.heroku.com/articles/config-vars#managing-config-vars)
```javascript
`heroku config:set ` +
  `DB_DATABASE=${process.env.DB_DATABASE} DB_PASS=${process.env.DB_PASS} DB_USER=${process.env.DB_USER} ` +
  `NGROK_HOST=${pathname.hostname} NGROK_PORT=${pathname.port} ` +
  `-a ${process.env.HEROKU_APP}`,
```
