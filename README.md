#Sens'it callback handler

##Purpose

* Handle the push callback every time your [Sens'it](http://sensit.io) sends a message  
* Store the data in a datastore (here, a PostgreSQL db) 
* Display logs

##Sens'it ?

Check the [official website](http://sensit.io).

It's a connected object, intended as a giveaway.

It has a button, plus a few sensors :
* temperature
* sound detection
* accelerometer

Data of the sensors is sent periodically, or when you press the button.  
Data are sent using the [SIGFOX](http://sigfox.com) network  
You can activate/deactivate selected sensors using the web interface


##Heroku - Quick deploy

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/nicolsc/sensit-callback/tree/master)

###Add the DB Url in environnement

```
$ heroku config:set DATABASE_URL=postgresql:///whatever 
```

You can use an heroku addon for this : 

```
$ heroku addons:create heroku-postgresql
```

###Init the DB

Make sure the postInstall script ran as expected, creating the tables.

You can run it manually using  

```
$ heroku run npm install
```

##Set up your callback

Log-in on your [Sens'it account](https://www.sensit.io/account), activate the developer access & fill-in the _callback URL_ text field.  
You're done :)

##Documentation

Available [here](https://api.sensit.io/v1/)