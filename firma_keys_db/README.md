# Base de datos de micro-servicio

## Instalación MySQL
```bash
sudo apt install gnupg
cd /tmp
wget https://dev.mysql.com/get/mysql-apt-config_0.8.22-1_all.deb
sudo dpkg -i mysql-apt-config*
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## Creación de base de datos
Nos conectamos con `sudo mysql -u root -p`
```sql
CREATE DATABASE firma_keys_db;
SHOW databases;
CREATE USER 'firma'@'localhost' IDENTIFIED BY 'firma';
CREATE USER 'firma'@'%' IDENTIFIED BY 'firma';
SELECT host, user, authentication_string FROM mysql.user;
GRANT ALL PRIVILEGES ON firma_keys_db.* TO 'firma'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SHOW GRANTS FOR firma;
```



## Permitir conexiones remotas
Por defecto MySQL solo permite conexiones dentro del mismo host. Para permitir conexiones remotas necesitamos definir en `/etc/mysql/mysql.conf.d/mysqld.cnf` la propiedad `bind-addresss` en `0.0.0.0`. Luego se reinicia el servicio con `sudo systemctl restart mysql`

## Exportar desde CLI
```bash
sudo mysqldump -u root -p firma_keys_db > firma_keys_db.sql
```
## Importar desde CLI
```bash
sudo mysql -u root -p < firma_keys_db.sql