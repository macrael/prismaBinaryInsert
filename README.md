An example project for experimenting with prisma's binary encoding and sqlRaw queries.

Run postgres, here's an easy way:

```
docker run -p 5555:5432 -e POSTGRES_PASSWORD=pgbin postgres
```

Initial Setup:
```
yarn install
export DATABASE_URL='postgresql://postgres:pgbin@localhost:5555/postgres?schema=public&connection_limit=5'
yarn prisma migrate dev

tsc && node ./build/index.js
```

I did local dev on this with: 
```
find src | entr -cs "tsc && node ./build/index.js"
```
