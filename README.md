# Thoth
Aspectjs Contextual Logging POC

## References

- NestJS Pino - Platform agnostic logger for NestJS based on Pino with REQUEST CONTEXT IN EVERY LOG - <https://github.com/iamolegga/nestjs-pino>
- AspectJS - Library for aspect-oriented programming with JavaScript, which takes advantage of ECMAScript 2016 decorators syntax - <https://github.com/mgechev/aspect.js>

## Commands

```TypeScript

// Setup
npm install

npm run build

npm run start

// Lint
npm run lint
// Fix
npm run fix

// Test
...lol ...lmao

```

Once the service is running you can make requests to it with curl

```Bash
curl localhost:3000/api/
// Hello World!

curl localhost:3000/api/command
//{"some":"useful","data":"which","we":"need","something":"that","I":"need","To":"Find"}
```
