# Contact API Spec

## Create Contact API
Endpoint : POST /api/contacts
Headers  :
- Authorization

Req Body :
```json
{
  "firstName" : "Khadhi Musaid",
  "lastName"  : "Syah",
  "email"     : "kmusaidsyah@gmail.com",
  "phone"     : "081213633684"
}
```
Res Body Success :
```json
{
  "data": {
    "id" : 1, 
    "firstName" : "Khadhi Musaid",
    "lastName"  : "Syah",
    "email"     : "kmusaidsyah@gmail.com",
    "phone"     : "081213633684"
  }
}
```
Res Body Error   :

```json
{
  "errors": {
    "email"     : "Email's format is invalid",
    "phone"     : "Phone's number is invalid"
  }
}
```
## Update Contact API
Endpoint : PUT /api/contacts/:id
Headers  :
- Authorization

Req Body :
```json
{
  "firstName" : "Khadhi Musaid",
  "lastName"  : "Syah",
  "email"     : "kmusaidsyah@gmail.com",
  "phone"     : "081213633684"
}
```
Res Body Success :
```json
{
  "data": {
    "id" : 1,
    "firstName" : "Khadhi Musaid",
    "lastName"  : "Syah",
    "email"     : "kmusaidsyah@gmail.com",
    "phone"     : "081213633684"
  }
}
```
Res Body Error   :
```json
{
  "errors" : {
    "email" : "Email's format is invalid",
    "phone" : "Phone's number is invalid"
  }
}
```
## GET Contact API
Endpoint : GET /api/contacts/:id
Headers  :
- Authorization

Res Body Success :
```json
{
  "data": {
    "id" : 1,
    "firstName" : "Khadhi Musaid",
    "lastName"  : "Syah",
    "email"     : "kmusaidsyah@gmail.com",
    "phone"     : "081213633684"
  }
}
```
Res Body Error   :
```json
{
  "errors": "Contact is not found"
}
```
## Search Contact API
Endpoint : GET /api/contacts
Headers  :
- Authorization

Query Params : 
- name  : Search by firstName or lastName using like query (optional)
- email : Search by email using like query (optional)
- phone : Search by phone using like query (optional)
- page  : Number of page (default is 1)
- size  : Size per page (default is 5)

Res Body Success :
```json
{
  "data" : [
    {
      "id" : 1,
      "firstName" : "Khadhi Musaid",
      "lastName"  : "Syah",
      "email"     : "kmusaidsyah@gmail.com",
      "phone"     : "081213633684"
    },
    {
      "id" : 2,
      "firstName" : "Khadhi Musaid",
      "lastName"  : "Syah",
      "email"     : "kmusaidsyah@gmail.com",
      "phone"     : "081213633684"
    }
  ],
  "paging" : {
    "page" : 1,
    "total_page" : 3,
    "total_item" : 15
  }
}
```
Res Body Error   :
```json
{
  
}
```
## Remove Contact API
Endpoint : DELETE /api/contacts/:id
Headers  :
- Authorization

Res Body Success :
```json
{
  "data" : "success"
}
```
Res Body Error   :
```json
{
  "errors": "Contact is not found"
}
```