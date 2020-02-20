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
- [ ] LocalStorage for some of the settings
- [ ] Validation of add/edit property, (~~msl~~, ~~for~~, gps, phone, email, )
- [ ] Env var for company name, phone, email for use across site ** plan for deploying to different areas (onMount?!)
- [ ] Perhaps an indicator that property is sold or rented.
- [ ] Implementation of poly.google.com/ or pannellum.org or matterport.com or sketchfab VR walkthru with or without images
- [ ] Concider using geojson to have more control over layers and markers
- [ ] MapboxGL has issues on firefox and any other browsers that don't support webgl. HereMap?!
- [x] Better Error page
- [ ] Turn checkbox/radio/switch into toggle component
- [ ] Phone, Email and maybe Back icon (for close) svg icons for Details

#### Notes

- [ ] DB must be changed in index.svelte, api.js, _Editor.svelte, both [slug].svelte, list.svelte, default.json (config). Should be made to work from central location of default.json.
- [ ] .env needs dotenv alongside it

#### GitHub Pages (not deploying properly)

package.json
> "homepage":  "<https://secretgspot.github.io/cariari-realty",>
>"scripts":  {
  // ...
  "predeploy":  "npm run export",
  "deploy":  "gh-pages -d __sapper__/export"
  }

bash
  npm  install --save-dev gh-pages

  npm run export

  npm run deploy
