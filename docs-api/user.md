# User API Spec

## Register User API
Endpoint : POST /api/users
Req Body : 

```json
{
  "name"     : "Khadhi Musaid Syah",
  "email"    : "kmusaidsyah@gmail.com",
  "username" : "jokes07",
  "password" : "musimsemi123"
}
```
Res Body Success : 
```json
{
  "data" : {
    "username" : "jokes07",
    "name"     : "Khadhi Musaid Syah",
    "email"    : "kmusaidsyah@gmail.com" 
  }
}
```
Res Body Error : 
```json
{
  "error" : {
    "email"   : "email is already registered",
    "username": "Username is already registered",
    "password": "The password must be a minimum of 8 characters"
  }
}
```
## Login User API
Endpoint : POST /api/users/login
Req Body : 

```json
{
  "username" : "jokes07",
  "password" : "musimsemi123"
}
```
Res Body Success :
```json
{
  "data" : {
    "token": "unique-token"
  }
}
```
Res Body Error :
```json
{
  "error" : "Username or Password is wrong"
}
```

## Update User API
Endpoint : PATCH /api/users/current
Headers  : 
- Authorization : token
Req Body : 

```json
{
  "email": "kopeeedhh@gmail.com",
  "name" : "Khadhi Musaid",    //optional
  "password": "new password", //optional
  "confirm" : "new password" //optional
}
```
Res Body Success :
```json
{
  "data" : {
    "username" : "jokes07",
    "name"     : "Khadhi Musaid Syah",
    "email"    : "kopeeedhh@gmail.com"
  }
}
```
Res Body Error : 
```json
{
  "error" : {
    "name"  : "The name length must be a maximum of 100 characters",
    "email" : "email is already registered",
    "password": "New password doesn't match"
  }
}
```

## Get User API
Endpoint : GET /api/users/current
Headers  :
- Authorization : token

Res Body Success :
```json
{
  "data" : {
    "username": "jokes07",
    "name"    : "Khadhi Musaid Syah"
  }
}
```
Res Body Error  :
```json
{
  "error" : "Unauthorized"
}
```
## Logout User API
Endpoint : DELETE /api/users/logout
Headers  :
- Authorization : token

Res Body Success : 
```json
{
  "data": "success"
}
```
Res Body Error : 
```json
{
  "error" : "Unauthorized"
}
```