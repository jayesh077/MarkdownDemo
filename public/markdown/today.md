# Hadoop Multi-Node cluster Installation
1. Prepare all (e.g. four) machines. 
	Install java-1.8-64 bit & ssh on machine.

2. Disable ipv6 on all machines -- /etc/sysctl.conf

```
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
```

3. In /etc/hosts ensure entry of all machines hostnames.

```
192.168.56.1	master
192.168.56.101	slave1
192.168.56.102	slave2
192.168.56.103	slave3
```

4. Create user "hduser" on all machines.

5. Enable password-less login for SSH (from hduser login). 

```sh
ssh-keygen -t rsa -P ""
cat $HOME/.ssh/id_rsa.pub >> $HOME/.ssh/authorized_keys
chmod 600 $HOME/.ssh/authorized_keys
ssh master
```

6. Master should be able to login to all slave machines.

```sh
ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@slave1
ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@slave2
ssh-copy-id -i $HOME/.ssh/id_rsa.pub hduser@slave3
```

7. Copy Hadoop 2.7.3 to $HOME (/home/hduser) & extract there. In $HOME/.bashrc of each machine setup HADOOP_HOME and PATH:

```
export HADOOP_HOME=$HOME/hadoop-2.7.3
export PATH=$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$PATH
```

8. In $HADOOP_HOME/etc/hadoop/hadoop-env.sh of each machine:

```
	export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
```
	
9. In $HADOOP_HOME/etc/hadoop/core-site.xml of each machine:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
	<property>
		<name>fs.defaultFS</name>
		<value>hdfs://master:9000</value>
	</property>
</configuration>
```

10. In $HADOOP_HOME/etc/hadoop/hdfs-site.xml of master:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
	<property>
		<name>dfs.name.dir</name>
		<value>${user.home}/bigdata/hd-data/nn</value>
	</property>
	<property>
		<name>dfs.replication</name>
		<value>2</value>
	</property>
</configuration>
```

11. In $HADOOP_HOME/etc/hadoop/hdfs-site.xml of each slave:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
	<property>
		<name>dfs.replication</name>
		<value>2</value>
	</property>
	<property>
		<name>dfs.data.dir</name>
		<value>${user.home}/bigdata/hd-data/dn</value>
	</property>
</configuration>
```

12. In $HADOOP_HOME/etc/hadoop/mapred-site.xml of each machine:

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>
</configuration>
```

13. In $HADOOP_HOME/etc/hadoop/yarn-site.xml of master machine:

```xml
<?xml version="1.0"?>
<configuration>
	<property>
		<name>yarn.resourcemanager.hostname</name>
		<value>master</value>
	</property>
</configuration>
```

14. In $HADOOP_HOME/etc/hadoop/yarn-site.xml of each slave machine:

```xml
<?xml version="1.0"?>
<configuration>
	<property>
		<name>yarn.resourcemanager.hostname</name>
		<value>master</value>
	</property>
	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
	<property>
		<name>yarn.nodemanager.local-dirs</name>
		<value>${user.home}/bigdata/hd-data/yarn/data</value>
	</property>
	<property>
		<name>yarn.nodemanager.logs-dirs</name>
		<value>${user.home}/bigdata/hd-data/yarn/logs</value>
	</property>
	<property>
		<name>yarn.nodemanager.disk-health-checker.max-disk-utilization-per-disk-percentage</name>
		<value>99.9</value>
	</property>
	<property>
		<name>yarn.nodemanager.vmem-check-enabled</name>
		<value>false</value>
	</property>
</configuration>
```

15. In $HADOOP_HOME/etc/hadoop/slaves of master machine:

```
slave1
slave2
slave3
```

16. Format namenode from master machine:

```sh
hdfs namenode -format
```

17. Start HDFS & YARN from master machine. Then verify using jps command on each machine.

```sh
start-dfs.sh
start-yarn.sh
jps
```
18. Stop HDFS & YARN from master machine. Then verify using jps command on each machine.

```sh
stop-yarn.sh
stop-dfs.sh
jps
```

