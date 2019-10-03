```txt
              (&@@@&(
         @@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@,@@@@@@@,@@@@@@@@@
   @@@@@@@@@@@       @@@@@@@@@@@
  @@@@&   .@@@@@   @@@@@.   &@@@@
 @@@@@@@@    /@@, ,@@/    @@@@@@@@
(@@@@@@@@@@            ,@@@@@@@@@@(
@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@     @@@@@@@@@@@@@@@
(@@@@@@@@@@@@@       @@@@@@@@@@@@@(
 @@@@@@@@@@@           @@@@@@@@@@@
  @@@@@@@@               @@@@@@@@
   @@@@        .*#*.        @@@@
    @@&  (@@@@@@@@@@@@@@@(  &@@
      @@@@@@@@@@@@@@@@@@@@@@@
         @@@@@@@@@@@@@@@@@
              (&@@@&(
```

# Cariari Realty

Small app dedicated to listing properties in an area, utilizing mapboxgl, firebase and svelte.

## TODO

- Rethink/redo loading/splash
- Map Filter
- Resolve issue with recenter/resize of a map on preview
- Store across pages (sapper/store?)
- Rethink access for client/admin

### Feautures
* / - main map view with preview and deatails
* /property - add new property
* /property/list - lists all of the properties with filter
* /property/id - modify property (client view), able to remove by switching active status
* /property/id?admin=true - modify property (admin view), able to remove from db and switch active status
* /property/id?qr=true - property printout sheet