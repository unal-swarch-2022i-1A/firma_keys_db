# Base de datos de micro-servicio

## SQL query
```bash
sudo mysql -u firma -p firma_keys_db
```
```sql
SELECT * FROM `key`;
```

## Generación de llaves
openssl genrsa [-out filename] [numbits]

* **-out filename** Output the key to the specified file. If this argument is not specified then standard output is used.
* **numbits** The size of the private key to generate in bits. This must be the last option specified. The default is 2048 and values less than 512 are not allowed.

```bash
openssl genrsa -out privatekey.pem 1024
openssl rsa -noout -text -in privatekey.pem
openssl rsa -in privatekey.pem -outform PEM -pubout -out publickey.pem
```

## Archivos PEM
PEM is just a standard; they contain text, and the format dictates that PEM files start with…
```
-----BEGIN <type>-----
```
…and end with:
```
-----END <type>-----
```
Everything in between is **base64 encoded** (uppercase and lowercase letters, digits, +, and /). This forms a block of data that can be used in other programs. A single PEM file can contain multiple blocks.

## Longitud
```bash
openssl genrsa -out privatekey.pem 1024
wc -c < privatekey.pem
openssl rsa -in privatekey.pem -outform PEM -pubout -out publickey.pem
wc -c < publickey.pem
```
salida
```bash
887
272
```

Leer https://security.stackexchange.com/questions/102508/why-is-openssl-key-length-different-from-specified-bytes

