# NoSQL Database Types
* All RDBMS store data in form of tables, rows & columns.
* NoSQL have four types of representing, storing & processing the data.

## Document oriented db
* Records are stored as XML/JSON documents.
* Compared to RDBMS
	- Tables - Collections
	- Rows - Documents
	- Columns - Fields
* Flexible schema: Different documents can have different fields.
* e.g. MongoDb, BaseX, ...

## Column oriented db
* In RDBMS rows are scattered in server disk. But all fields of each row are kept together.
* When table have many columns, but need to fetch few for a query, the performace is reduced.
* All columns are stored in different files. This is column-based storage (not row based storage).
* Flexible Schema: db collection have multiple column families and each family can have flexible number of columns in it.
* e.g. Address Book:
	- Name
	- Birth Date
	- Contact
		- email
		- mobile
		- phone
		- fax
* Note that columns in Contact column family are flexible.* Each record is identified by a rowId (like primary key).
* Each column family is stored in separate file & each value is associated with rowId.
* e.g. HBase.

## Graph oriented db
* Graph is a set of vertices & edges.
* In graph oriented db, vertex holds data and edges reprent relation between data.
* These db work on graph algorithms.
* Used to access any data related to any entity in fastest possible time - O(1).
* e.g. GraphDb, Neo4J, TitanDb.

## Key-Value db
* Data is stored in huge distributed (horizontal scaling) hashtable. Searching by key is very fast.
* Key can be anything; however people use strings for keys. e.g. "cdac/dac/karad_sunbeam/1234".
* Value can be anything e.g. string, JSON, image, document, ...
* e.g. Redis, Oracle KV store, ...

# MongoDb Operators:
* $type: Check type of field. (Array is 4, null is 10, ...).
* $exists: Check if given field is available in record or not.

```JS
//Q. fetch all records where "age" field have null value.
db.persons.find({
	"age": { $type: 10 }
});

//Q. fetch all records where "age" field is present in document.
db.persons.find({
	"age": { $exists: true }
});
```

# RDBMS Table Relations
* Two tables are related to each other by means of PK & FK.
* There are four types of relationships:

### One-to-One relation
* One row in a table is related to one row in another table.
* PK of first table is FK of second table OR two tables have same PK.
* (Employee) -------- (Address)

### One-to-Many relation
* One row in a table is related to multiple rows in another table.
* PK of first table is FK of second table. In this case first table is called as "Parent table" & second table is called as "Child table".
* (Department)1 --------- *(Employee)

### Many-to-One relation
* Counterpart of One-to-Many
* (Employee)* --------- 1(Department)

### Many-to-Many relation
* One row in first table is related to multiple rows in second table.
* One row in second table is related to multiple rows in first table.
* (Employee)* --------- *(Meeting)
* This is implemented with a separate table keeping FK related to both table's PK.

# RDBMS Normalization	
* Concept of table design --> Table, Structure, Data Types, Width, Constraints, Relations.
* Goals:
	- Efficient table structure
	- Avoid data redaundency i.e. unnecessary duplication of data (to save disk space)
	- Reduce problems of insert, update & delete.
* Done from input perspective.
* Based on user requirements.
* Part of software design phase.
* View entire appln on per transaction basis & then normalize each transaction separately.

* Transaction Examples:
	- Banking: Open New Account, Deposit Amount, Withdraw Amount.
	- Rail Reservation: Reservation, Cancellation.
	- Online Shopping: Customer Order, Stock Update, New Product, ...
			
## Getting ready for Normalisation:
* For given transaction make list of all the fields.
* Strive for atomicity.
* Get general description of all field properties.
* For all practical purposes we can have a single table with all the columns. Give meaningful names to the table.
* Assign datatypes and widths to all columns on the basis of general desc of fields properties.
* Remove computed columns.
* Assign primary key to the table.
* At this stage data is in unnormalised form.
		
## UNF --> starting point of normalisation.
* Delete anomaly
* Update anomaly
* Insert anomaly
	
## Normalization steps:
1. Remove repeating group into a new table.
2. Key elements will be PK of new table.
3. (Optional) Add PK of original table to new table to give us Composite PK.
	- Repeat steps 1-3 infinitely -- to remove all repeating groups into new tables.
	- This is 1-NF. No repeating groups present here. One to Many relationship between two tables.
		
4. Only table with composite PK to be examined.
5. Those cols that are not dependent on the entire composite PK, they are to be removed into a new table.
6. The key eles on which the non-key eles were originally dependent, it is to be added to the new table, and it will be the PK of new table.
	- Repeat steps 4-6 infinitely -- to seperate all non-key eles from all tables with composite primary key.
	- This is 2-NF. Many-to-Many relationship.

7. Only non-key eles are examined for inter-dependencies.
8. Inter-depedent cols that are not directly related to PK, they are to be removed into a new table.
9. (a) Key ele will be PK of new table.
9. (a) The PK of new table is to be retained in original table for relationship purposes.
	- Repeat steps 7-9 infinitely to examine all non-key eles from all tables and separate them into new table if not dependent on PK.
	- This is 3-NF.	

- To ensure data consistecy (no wrong data entered by end user).
- Seperate table to be created of well-known data. So that min data will be entered by the end user.
- This is BCNF or 4-NF.

## Denormalization
* After normalization if certain queries are getting too slow & too complicated. In that case few fields or computed columns are added in relevant tables to improve speed of query execution.
* Obviously this is breaking some of the normalization rules. This is called as "Denormalization".

# Mongo Data Modeling
* How data is organized into mongo database.
* Two modeling methods:
	- Embedded data model
	- Referenced data model (Normalized data model)

## Embedded data model
* The related objects are embedded into some parent object.
* example:
	- emp collection:
		- _id, ename, sal, mgr, comm, job, hire, dept
		- dept is a nested object that contains _id, dname, loc
* Quick access to the related data e.g. dept data is available immediately with emp data.
* If multiple emp in single dept, then dept data is repeated in all customer.

```JS
db.emp.insert({
	"_id": 1,
	"ename": "A",
	"sal": 1000,
	"mgr": 5,
	"comm": null,
	"job": "CLERK",
	"hire": ISODate("2004-05-31"),
	"dept": {
		"_id": 50,
		"dname": "ADMIN",
		"loc": "KARAD"
	}
});
```
		
## Reference/Normalized data model
* Data is in separate collections.
* The documents are connected by some field.
* example:
	- dept collection
		- _id, dname, loc
	- emp collection
		- _id, ename, sal, mgr, comm, job, hire, deptno
	- Here "deptno" field is mapped to "_id" of dept.
* Reduces data redandency
* Fetching related data need join ($lookup aggregation)

# RDBMS to NoSQL migration
* An application is developed using RDBMS & in use.
* For getting advantages of NoSQL, we want to shift to NoSQL databases.
* This includes redevelopment of whole application, specially data layer of the application.
* Migrating from RDBMS to NoSQL will change from (NoSQL) database to database.

## Migration from MySQL to MongoDb
1. Understand structure of data in MySQL i.e. understand tables, constraints, relations among tables & indexes.
2. Define data model for MongoDb. Make appropriate use of embedded model & reference model. Define collections, validations & indexes.
3. Create views in RDBMS which will make data available as per requirement of Mongo Db model.
4. Write a custom script that will read data from views & write into JSON files (in desired format).
5. In mongo db create collection, then import all json files using **mongoimport** command.
	- mongoimport -d dacdb -c emp emp.json
6. Create indexes & validators on mongo collections.

* However if application is live, in such case special ETL tools can be used to transfer data from RDBMS to Mongo batchwise.
* Example command to convert MySQL data into JSON & then import into mongo.

```sh
mysql -u nilesh -pnilesh -D sales --column-names=FALSE --table=FALSE -e "SELECT CONCAT('{ cnum:', cnum, ', cname:\"', cname, '\", city:\"' , city, '\"}') FROM CUSTOMERS;" > cust.json
```

```sh
mongoimport -d kdac -c cust cust.json
```


# Mongo Consistency
- Each record editing is always atomic.
	- Multi-row tx are not straight forward.
	- Specialized design patterns can be used for such tx e.g. two phase commit.
- Changes done by one client are available to all clients.
- Number of clients can work simultaneously.
- All changes are saved on disk.

# MySQL client softwares
1. mysql SQL shell
2. mysql workbench (GUI desktop based tool)
	- sudo apt-get install mysql-workbench
3. phpmyadmin (GUI web based tool)
	- sudo apt-get install phpmyadmin
	- configuration steps
		- 
		- 
	- Browser: http://localhost/phpmyadmin

# MySQL as NoSQL - Document Store
* MySQL Document Store allows to work with SQL relational tables and schema-less JSON collections.
* Special JSON data type for column is introduced.
* MySQL has created the X Dev API which puts a strong focus on CRUD.
* X Protocol is a highly extensible and is optimized for CRUD as well as SQL.
* Developers can mix and match relational data and JSON documents in the same database as well as the same application.
* Need for separate NoSQL database is eliminated.
* Features:
	- Highly Reliable
	- Fully Consistent
	- High Availability
	- Online Hot Backup
	- Security
	- Reporting and Analytics
	- Easy to Use

## Architecture
* Native JSON Document Storage
	- Native JSON datatype
	- Efficiently stored in binary
	- Can be indexed.
	- Automatically validated.
* X Plugin
	- To use the X Protocol
	- To use Connectors & Shell to act as clients to the server.
* X Protocol
	- New client protocol based on top of the Protobuf library
	- For both CRUD and SQL operations.
* X DevAPI
	- A new, modern, async developer API for CRUD and SQL operations
	- Use X Protocol.
	- Collections as new Schema objects.
	- Documents are stored in Collections.
	- Dedicated CRUD operation set.
* MySQL Shell
	- Interactive Javascript, Python, or SQL interface
	- For development and administration
	- To perform data queries and updates
* MySQL Connectors
	- Support the X Protocol
	- To use X DevAPI.
        - MySQL Connector/Node.js
        - MySQL Connector/PHP
        - MySQL Connector/Python
        - MySQL Connector/J
        - MySQL Connector/NET
        - MySQL Connector/C++

## CRUD operations
```SQL
-- terminal> mysql -u root -p
SOURCE /home/nilesh/feb19/kdac/dbt/mysql-nosql/world_x_db.sql
```

```JS
// -- terminal> mysqlsh -u root -D world_x --js

db.getCollections()

db.countryinfo.add({
    GNP: .6,
    IndepYear: 1967,
    Name: "Sealand",
    demographics: {
        LifeExpectancy: 79,
        Population: 27
    },
    geography: {
        Continent: "Europe",
        Region: "British Islands",
        SurfaceArea: 193
    },
    government: {
        GovernmentForm: "Monarchy",
        HeadOfState: "Michael Bates"
    }
});

db.countryinfo.find();

db.createCollection("flags");

db.countryinfo.modify("_id = 'SEA'").\
set("demographics", {LifeExpectancy: 78, Population: 28})

db.countryinfo.remove("_id = 'SEA'")
```

# MySQL Architecture

## Physical architecture
* Configuration files
	- /etc/mysql/my.cnf
* Installed Files
	- Executable files
		- mysqld
		- mysqladmin
		- mysql
		- mysqldump
		- ...
	- Log files
		- pid files
		- socket files
		- document files
		- libraries
* Data Files
	- Data directory
		- Server logs
		- Status files
		- Innodb tablespaces & log buffer
	- Database directory files
		- Data & Index files (.ibd)
		- Object structure files (.frm, .opt)
		
## Logical architecture
* Client
* Server (mysqld)
	- Accept & process client requests
	- Multi-threaded process
	- Dynamic memory allocation
		- Global allocation
		- Session allocation
* Parser
	- SQL syntax checking.
	- Generate sql_id for query.
	- Check user authentication.
* Optimizer
	- Generate efficient query execution plan
	- Make use of appropriate indexes
	- Check user authorization.
* Query cache
	- Server level (global) cache
	- Speed up execution if identical query is executed previously
* Key cache
	- Cache indexes
	- Only for MyISAM engine
* Storage engine
	- Responsible for storing data into files.
	- Features like transaction, storage size, speed depends on engine.
	- Supports multiple storage engines
	- Can be changed on the fly (table creation)
	- Important engines are InnoDB, MyISAM, NDB, Memory, Archive, CSV.

### InnoDB engine
* Fully transactional ACID.
* Row-level locking.
* Offers REDO and UNDO for transactions.
* Shared file to store objects (Data and Index in the same file - .ibd)
* InnoDB Read physical data and build logical structure (Blocks and Rows)
* Logical storage called as TABLESPACE.
* Data storage in tablespace
	- Multiple data files
	- Logical object structure using InnoDB data and log buffer

### MyISAM
* Non-transactional storage engine
* Table-level locking
* Speed for read
* Data storage in files and use key, metadata and query cache
	- .frm for table structure
	- .myi for table index
	- .myd for table data

### NDB
* Fully Transactional and ACID Storage engine.
* Row-level locking.
* Offers REDO and UNDO for transactions.
* NDB use logical data with own buffer for each NDB engine.
* Clustering: Distribution execution of data and using multiple mysqld.

# Clustering in MySQL
* Using multiple machines to store & process data.
* All machines are connected through high-speed network.
* Two types of clusters are supported.
	- InnoDB cluster
	- NDB cluster
	
## InnoDB cluster
* Designed for High-Availability
* System continue to function even if one of the server goes down
* Consists of multiple servers running **mysqld** and a **router**.
* Group replication
	- Multiple servers maintains same copy of the data.
	- Usually one of the server is primary (i.e. handles write+read)
	- Remaining all servers are secondary (i.e. only read)
	- If primary fails, one of the secondary is elected as primary.
* Router
	- Usually installed on same machine as of client application.
	- Client fire SQL queries to router.
	- Router send them to appropriate server from replication group.
	- Act as load balancer.
	- Use separate ports for write & read (in config files).
* MySQL shell
	- Used for creating & monitoring cluster
	- It is different from SQL shell -- mysqlsh
	- dba.createCluster()
	- cluster = dba.getCluster()
	- cluster.status()

## NDB cluster
* Designed for High-Availability (99.99% up time)
* Management node (ndb_mgmd)
	- manage the other nodes within the NDB Cluster
	- providing configuration data, starting and stopping nodes, and running backups.
	- node of this type should be started first
* Data node (ndbd)
	- stores cluster data
	- multiple nodes for replica per fragment
	- minimum two replicas per fragment for HA
	- cluster tables are stored completely in memory rather than on disk
* SQL/API node (mysqld)
	- accesses the cluster data
	- a specialized type of API node
	- minimum two replicas are recommended

# MySQL Snapshots
* Snapshot is state of database. It includes table metadata & data.
* Applications:
	- Porting existing appln on new server.
	- Recovering from database crash/corruption.
* Backup & Restore.
* Methods of snapshots:
	- MySQL workbench -- export & import
	- PhpMyAdmin -- export & import
	- MySQL utilities -- mysqldump & mysql
	- Raw files backup & restore -- very fast, difficult

## mysqldump & mysql

```sh
mysqldump -u [username] -p[password] [database_name] > [dump_file.sql]

mysqldump -u [username] -p[password]  [dbname1,dbname2...] > [dump_file.sql]

mysqldump -u [username] –p[password] --all-database > [dump_file.sql]

mysql -u [uname] -p[pass] [db_to_restore] < [backupfile.sql]
```



