# Set up MongoDB 3.6 on AWS EC2

## Change Ownership of folder

```sh
sudo chmod -R mongodb:mongodb /var/log/mongodb
sudo chmod -R mongodb:mongodb /var/lib/mongodb 
```

## Start Mongod service

```sh
sudo mongod --config /etc/mongod.conf --fork
```

Start the `mongod` process with config file `mongod.conf` and fork the process in the background.

**Problem** 

need to run as admin. Can't run as normal user. 

If run `mongod ...`, errors occur:

```
2018-07-22T22:16:05.005-0500 F CONTROL  [main] Failed global initialization: FileNotOpen: Failed to open "/var/log/mongodb/mongod.log"
```

Ideally, it should run as a service.

```sh
sudo service mongod start
```

Config file path: `/lib/systemd/system/mongod.service`

## Stop Mongod service

(hacky)

```sh
ps ax | grep mongod
```

then kill the corresponding process given pid.

