# Remote MongoDB Connection

This documentation shows how to connect to remote MongoDB instance hosted on AWS server through SSH Tunnel redirection. 

## Establish SSH Connection to AWS EC2 Server

Have your server key `serverKey.pem` ready.

Now we will create a SSH tunnel on port 27018 to the remote server on port 27017.

```sh
ssh -i "./serverKey.pem" -N -f -L 27018:127.0.0.1:27017 <userName>@<ip_address>
```

Here, `userName = ubuntu`, `ip_address = aws_public_ip`

Now all traffic to `localhost:27018` wil be redirected to port 27017 on remote server 

## Connect through Terminal


```sh
mongo db_name -u userName -p password --port 27018
```



Here, `db_name = lyber-server`

## Connect through PyMongo

```python
import pymongo

client = pymongo.MongoClient("mongodb://userName:password@127.0.0.1:27017/lyber-server"")

db = client["lyber-server"]

estimates = client["estimates"]

requests = client["requests"]

print(requests.count())
```

```