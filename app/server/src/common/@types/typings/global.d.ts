import type { Config as ConfigInterface } from '@/core';

/* The `export {};` statement is used to indicate that the file is a module and exports nothing. It is
often used in TypeScript files that only contain type declarations or interfaces, without any actual
code or exports. This statement ensures that the file is treated as a module and not as a script. */
export {};

declare global {
  export type Configs = ConfigInterface;
}
