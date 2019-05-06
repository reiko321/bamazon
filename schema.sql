DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (

item_id INTEGER NOT NULL AUTO_INCREMENT,

product_name VARCHAR(100) NULL,

department_name VARCHAR(100) NULL,

price DECIMAL(5,2) ,

stock_quantity INTEGER NULL,

primary key (item_id)
);