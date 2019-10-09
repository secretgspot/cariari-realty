# Cariari Realty

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

Small app dedicated to listing properties in an area, utilizing mapboxgl, firebase and svelte.

## Features

| URL | Action |
| ------ | ------ |
| / | main map view with preview and details |
| /id | displays property details for id provided (used for sharing) |
| /property | add new property |
| /property/list | lists all of the properties with filter |
| /property/id | modify property (client view), able to remove by switching active status |
| /property/id | modify property (admin view) after entering **konami**, able to remove from db and switch active status |
| /property/id?qr=true | property printout sheet |

### TODO

- [ ] Rethink/redo loading/splash
- [ ] Map Filter
- [ ] Store across pages (sapper/store?)
- [x] Rethink access for client/admin
- [x] Preview section scroll to top when marker selected
- [x] List, add checkbox for showing with photos or compact view
- [x] List, reformat grid vs list view
- [ ] LocalStorage for some of the settings
- [ ] Concider using geojson to have more control over layers and markers
- [ ] Map snapshot for property details (gps)
