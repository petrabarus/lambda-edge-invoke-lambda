#!/usr/bin/env bash
# Usage:
#  ./request_url.sh <domain>
# e.g.  ./request_url.sh xxxxx.cloudfront.net

echo "Invoking via Function URL";
curl "https://$1/file1.html";
sleep 1;
echo "Invoking via Lambda SDK";
curl "https://$1/file2.html";
sleep 1;
echo "Invoking Non-AWS URL";
curl "https://$1/file3.html";
