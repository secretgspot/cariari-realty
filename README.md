# Cariari Realty

```txt
                .;'.      ';.
                ,kK0kxxxk0Kk,
        .,:;'.   .o0NMMMN0o.   .';:,.
        ;kNWN0o,   .cXMXc.   ,oONWNO;
          'lONMNkc,;xNMNx,,ckNMNOl'.
            .;kNMWXNMMMMMNXWMNk;.
               :dc'oNMMMNo':d:
                   lNMMMNl
                 .oNMMMMMNo.
                .xWMMMMMMMWx.
              .c0WMMMMMMMMMW0c.
            .l0WMMMMMMMMMMMMMW0l.
         'cxXWMMMMMWNNNNNWMMMMMMXxc'
        lNWMWXOdlc;,'   ',;cldOXWMMXl
        'llc,.                 .;cll,
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

- [ ] Map Filter
- [ ] Store across pages (sapper/store?)
- [ ] Filters settings should be in store
- [ ] LocalStorage for some of the settings
- [ ] Concider using geojson to have more control over layers and markers
- [ ] Map snapshot for property details (gps)
- [ ] Cleanup Preview, Details
- [x] Validation of add/edit property
- [x] confirmation dialog when deleting property
- [ ] Realtor details (name, image), optional GRAVATAR
- [ ] Env var for company name, phone, email for use across site
- [x] Edit, check that photo is a photo and not empty, check that feature is a feature and not empty
- [ ] Perhaps an indicator that property is sold or rented.
