Library is designed to extract only needed typings from project.

For example: export all database model typing as an external library. 

## Usage

Cmd usage:
```
ts-extract-typings --config ./typings/core/ts-extract-config.ts
```

Programmatic usage:
```
import extractor from "@zvs001/ts-extractor"
extractor.extract(config)
```

Config File example:
```typescript
// ts-extract-config.ts
import { Config } from "@zvs001/ts-extractor"

const config: Config = {
  cwdDir: './models',
  outputDir: './typings/core',
  match: '*',
  interfaces: {
    ignore: [
      /Payload$/,
    ],
  },
}

export default config

```
