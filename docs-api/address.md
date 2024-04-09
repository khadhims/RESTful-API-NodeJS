# Address API Spec

## Create Address API
Endpoint : POST /api/contacts/:contactsId/addresses
Headers  : 
- Authorization : token

Req Body : 
```json
{
  "street"      : "Jalan Sunu Raya",
  "city"        : "Makassar",
  "province"    : "South Sulawesi",
  "country"     : "Indonesia",
  "postal_code" : "1522199"
}
```
Res Body Success : 
```json
{
  "data" : {
    "id" : 1,
    "street"      : "Jalan Sunu Raya",
    "city"        : "Makassar",
    "province"    : "South Sulawesi",
    "country"     : "Indonesia",
    "postal_code" : "1522199"
  }
}
```
Res Body Error   :
```json
{
  "errors": "Country is required"
}
```

## Update Address API
Endpoint : PATCH /api/contacts/:contactsId/addresses/:addressId
Headers  :
- Authorization : token

Req Body :
```json
{
  "street"      : "Jalan Sunu Raya", //Optional
  "city"        : "Makassar", //Optional
  "province"    : "South Sulawesi", //Optional
  "country"     : "Indonesia",
  "postal_code" : "1522199" //Optional
}
```
Res Body Success :
```json
{
  "data" : {
    "id": 1,
    "street"      : "Jalan Sunu Raya",
    "city"        : "Makassar",
    "province"    : "South Sulawesi",
    "country"     : "Indonesia",
    "postal_code" : "1522199"
  }
}
```
Res Body Error   :
```json
{
  "error" : "Country is required"
}
```

## GET Address API
Endpoint : GET /api/contacts/:contactsId/addresses/:addressId
Headers  :
- Authorization : token

Res Body Success :
```json
{
  "data" : {
    "id": 1,
    "street"      : "Jalan Sunu Raya",
    "city"        : "Makassar",
    "province"    : "South Sulawesi",
    "country"     : "Indonesia",
    "postal_code" : "1522199"
  }
}
```
Res Body Error   :
```json
{
  "error" : {
    "contact" : "Contact is not found",
    "address" : "Address is not found"
  }
}
```

## List Address API
Endpoint : GET /api/contacts/:contactsId/addresses
Headers  :
- Authorization : token

Res Body Success :
```json
{
  "data": [
    {
      "id": 1,
      "street"      : "Jalan Sunu Raya",
      "city"        : "Makassar",
      "province"    : "South Sulawesi",
      "country"     : "Indonesia",
      "postal_code" : "1522199"
    },
    {
      "id": 2,
      "street"      : "Jalan Tamnagapa",
      "city"        : "Makassar",
      "province"    : "South Sulawesi",
      "country"     : "Indonesia",
      "postal_code" : "1522112"
    }
  ]
}
```
Res Body Error   :
```json
{
  "error" : "Contact is not found"
}
```

## Remove Address API
Endpoint : DELETE /api/contacts/:contactsId/addresses/:addressId
Headers  :
- Authorization : token

Res Body Success :
```json
{
  "data" : "sucess"
}
```
Res Body Error   :
```json
{
  "error" : {
    "contact" : "Contact is not found",
    "address" : "Address is not found"
  }
}
```