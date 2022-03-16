#!/bin/bash
pidfile="/run/chrony/chronyd.pid"
if [ -f "$pidfile" ]
then
    rm $pidfile
fi
chronyd