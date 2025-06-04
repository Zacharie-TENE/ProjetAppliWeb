#!/bin/bash
kill -9 $(sudo lsof -t -i :9001)

hsqldb_home=./hsqldb
rc_file=auth.rc
urlid=Hagi
sql_file=db.sql

java -cp "$hsqldb_home/lib/hsqldb.jar" org.hsqldb.server.Server --database.0 file:mydb --dbname.0 xdb

