#!/bin/bash

# 等待 Couchbase 服务启动
echo "等待 Couchbase 启动..."
sleep 20

# 检查是否已经初始化
if /opt/couchbase/bin/couchbase-cli cluster-info -c localhost:8091 -u Administrator -p hiltonadmin &>/dev/null; then
    echo "Couchbase 已经初始化"
    exit 0
fi

# 初始化 Couchbase 集群
echo "初始化 Couchbase 集群..."
/opt/couchbase/bin/couchbase-cli cluster-init \
    --cluster localhost:8091 \
    --cluster-username Administrator \
    --cluster-password hiltonadmin \
    --cluster-ramsize 2048 \
    --cluster-index-ramsize 512 \
    --services data,index,query

# 创建 bucket
echo "创建 bucket: hilton"
/opt/couchbase/bin/couchbase-cli bucket-create \
    --cluster localhost:8091 \
    --username Administrator \
    --password hiltonadmin \
    --bucket hilton \
    --bucket-type couchbase \
    --bucket-ramsize 512 \
    --enable-flush 0

echo "Couchbase 初始化完成"
