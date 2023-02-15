## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

Ik verwacht dat volgende packages reeds geïnstalleerd zijn:

- [Bootstrap](https://yarnpkg.com/package/bootstrap)
- [React Bootstrap](https://yarnpkg.com/package/react-bootstrap)
- [uuid](https://yarnpkg.com/package/uuid)
- [Typeahead](https://github.com/ericgio/react-bootstrap-typeahead)

## Opstarten

Voor het opstarten van de applicatie is er een .env bestand nodig. Dit bestand moet de volgende (ingevulde) variabelen bevatten:

- REACT_APP_API_URL="http://localhost:9000/api"
- REACT_APP_AUTH0_DOMAIN="{YOUR-APPLICATION-DOMAIN}"
- REACT_APP_AUTH0_CLIENT_ID="{YOUR-APPLICATION-CLIENT-ID}"
- REACT_APP_AUTH0_API_AUDIENCE="{API-IDENTIFIER}"

Om de applicatie te starten moet je de volgende commando's uitvoeren:

- yarn install
- yarn start

## Testen

Voor het testen van de applicatie met Cypress is er een cypress.env.json nodig. Dit bestand moet de volgende code bevatten (met ingevulde variabelen):

```json
{
  "auth_audience": "",
  "auth_url": "",
  "auth_client_id": "",
  "auth_client_secret": "",
  "auth_username": "",
  "auth_password": ""
}
```

Om de applicatie te testen moet je de volgende commando's uitvoeren:

- yarn install
- yarn test
