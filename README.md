# OMS Dashboard

OMS Dashboard V 1.00

## Installation 

### Production

1. Install npm packages

```bash
npm install
```


2. Add port Proxy to Apache Config
```bash
 ProxyPass / http://127.0.0.1:3000/
 ProxyPassReverse / http://127.0.0.1:3000/
```
This step is necessary to allow port 3000 to become accessible on the default port 80 . The default port on which the project runs may be changed at Line 12 from the file : server/index.js. By default it is set to port 3000

```bash
 const PORT =  3000;
```

3. Install PM2

```bash
npm install pm2@latest -g
```

4. Start Main Server 
```
pm2 start app.js --watch
```
5. Start Monitor

```
pm2 monit
```

### Alternative

The project may also be started using : Nodemon, Forever etc

```
npm install -g nodemon

nodemon server.js
```
```
npm install forever

forever start app.js
```

## License
Property of Nordic Weltech