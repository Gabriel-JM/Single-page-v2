create table if not exists products_categories (
	id int not null primary key auto_increment,
	name varchar(80) not null,
	color char(7) not null
);
