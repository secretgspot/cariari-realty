```txt
MMMMMMMMMMMMMMMWXOxdolllodxOXWMMMMMMMMMMMMMMM
MMMMMMMMMMMNOdc,..         ..,cdOXMMMMMMMMMMM
MMMMMMMMXkc.                     .cxXMMMMMMMM
MMMMMWKo'                           'oKWMMMMM
MMMMXd.         .;'.      ';.         .dXMMMM
MMW0;           ,kK0kxxxk0Kk,           ;0WMM
MWO'    .,:;'.   .o0NMMMN0o.   .';:,.    'OWM
M0'     ;kNWN0o,   .cXMXc.   ,oONWNO;     '0M
Nc        'lONMNkc,;xNMNx,,ckNMNOl'.       :N
k.          .;kNMWXNMMMMMNXWMNk;.          .k
o              :dc'oNMMMNo':d:              o
l                  lNMMMNl                  l
o                .oNMMMMMNo.                o
k.              .xWMMMMMMMWx.              .k
N:            .c0WMMMMMMMMMW0c.            :N
M0'         .l0WMMMMMMMMMMMMMW0l.         '0M
MWO'     'cxXWMMMMMWNNNNNWMMMMMMXxc'     'kWM
MMM0;   lNWMWXOdlc;,'...',;cldOXWMMXl   ;0WMM
MMMMXd. 'llc,.                 .;cll, .dXMMMM
MMMMMWKo'                           'oKMMMMMM
MMMMMMMMXxc.                     .cxXMMMMMMMM
MMMMMMMMMMMXOdc,..         ..,cdONMMMMMMMMMMM
MMMMMMMMMMMMMWMWXOxdolllodxOXWMMMMMMMMMMMMMMM
```

# Cariari Realty

Small app dedicated to listing properties in an area, utilizing mapboxgl, firebase and svelte.

## TODO

- Rethink/redo loading/splash
- Map Filter
- Resolve issue with recenter/resize of a map on preview
- Store across pages (sapper/store?)
- Rethink access for client/admin
- QR 1st print, QR property details for outside of property.

### Feautures

| URL | Action |
| ------ | ------ |
| / | main map view with preview and details |
| /property | add new property |
| /property/list | lists all of the properties with filter |
| /property/id | modify property (client view), able to remove by switching active status |
| /property/id?admin=true | modify property (admin view), able to remove from db and switch active status |
| /property/id?qr=true | property printout sheet |