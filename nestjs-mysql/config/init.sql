use ms;

INSERT INTO permission (id,updateTime,createTime,pId,name,isPage,title) VALUES
	 (1,'2022-10-31 10:02:13.462527000','2022-10-31 10:02:13.462527000',NULL,'system',0,'系统管理'),
	 (2,'2022-10-31 10:03:28.557102000','2022-10-31 10:03:28.557102000',1,'menu',0,'菜单管理'),
	 (3,'2022-10-31 10:04:02.498897000','2022-10-31 10:04:02.498897000',2,'add',1,'新增'),
	 (4,'2022-10-31 10:04:22.878257000','2022-10-31 10:04:22.878257000',2,'edit',1,'编辑'),
	 (5,'2022-10-31 10:04:47.846269000','2022-10-31 10:04:47.846269000',2,'delete',1,'删除'),
	 (6,'2022-10-31 10:08:29.297521000','2022-10-31 10:08:29.297521000',1,'user',0,'用户管理'),
	 (7,'2022-10-31 10:09:04.729055000','2022-10-31 10:09:04.729055000',6,'add',1,'新增'),
	 (8,'2022-10-31 10:09:19.848227000','2022-10-31 10:09:19.848227000',6,'edit',1,'编辑'),
	 (9,'2022-10-31 10:09:44.476344000','2022-10-31 10:09:44.476344000',6,'delete',1,'删除'),
	 (10,'2022-10-31 10:10:35.637969000','2022-10-31 10:10:35.637969000',6,'permission',1,'权限设置'),
	 (11,'2022-10-31 10:11:29.297521000','2022-10-31 10:08:29.297521000',1,'role',0,'角色管理'),
	 (12,'2022-10-31 10:11:30.729055000','2022-10-31 10:09:04.729055000',11,'add',1,'新增'),
	 (13,'2022-10-31 10:11:40.848227000','2022-10-31 10:09:19.848227000',11,'edit',1,'编辑'),
	 (14,'2022-10-31 10:11:44.476344000','2022-10-31 10:09:44.476344000',11,'delete',1,'删除');

INSERT INTO role (id,updateTime,createTime,name) VALUES
	 (1,'2022-10-31 19:39:37','2022-10-31 19:28:18.765100','管理员');



INSERT INTO user (id,updateTime,createTime,username,password) VALUES
     (1,'2022-10-31 19:04:52.122807','2022-10-31 19:05:52.122807','admin','3e2be89f3f29b428da618df540c8ba6984b00f0a8e4d865732dde045e9e19bca'),
	 (2,'2022-10-31 19:05:52.122807','2022-10-31 19:05:52.122807','test','3e2be89f3f29b428da618df540c8ba6984b00f0a8e4d865732dde045e9e19bca');

INSERT INTO user_role (id,updateTime,createTime,userId,roleId) VALUES
	 (1,'2022-10-31 19:44:10.029893','2022-10-31 19:44:10.029893',2,1);

INSERT INTO role_permission (id, updateTime,createTime,roleId,permissionId) VALUES
     (1,'2022-10-31 19:39:37.043498','2022-10-31 19:39:37.043498',1,1),
	 (2,'2022-10-31 19:39:37.043498','2022-10-31 19:39:37.043498',1,6),
	 (3,'2022-10-31 19:39:37.049178','2022-10-31 19:39:37.049178',1,7),
	 (4,'2022-10-31 19:39:37.052412','2022-10-31 19:39:37.052412',1,11),
	 (5,'2022-10-31 19:39:37.055323','2022-10-31 19:39:37.055323',1,12),
	 (6,'2022-10-31 19:39:37.057975','2022-10-31 19:39:37.057975',1,13);


