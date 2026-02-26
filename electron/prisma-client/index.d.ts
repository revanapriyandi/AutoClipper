
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model ClipProfile
 * 
 */
export type ClipProfile = $Result.DefaultSelection<Prisma.$ClipProfilePayload>
/**
 * Model Transcript
 * 
 */
export type Transcript = $Result.DefaultSelection<Prisma.$TranscriptPayload>
/**
 * Model ClipCandidate
 * 
 */
export type ClipCandidate = $Result.DefaultSelection<Prisma.$ClipCandidatePayload>
/**
 * Model Clip
 * 
 */
export type Clip = $Result.DefaultSelection<Prisma.$ClipPayload>
/**
 * Model Asset
 * 
 */
export type Asset = $Result.DefaultSelection<Prisma.$AssetPayload>
/**
 * Model Job
 * 
 */
export type Job = $Result.DefaultSelection<Prisma.$JobPayload>
/**
 * Model ThemePreset
 * 
 */
export type ThemePreset = $Result.DefaultSelection<Prisma.$ThemePresetPayload>
/**
 * Model Analytics
 * 
 */
export type Analytics = $Result.DefaultSelection<Prisma.$AnalyticsPayload>
/**
 * Model Settings
 * 
 */
export type Settings = $Result.DefaultSelection<Prisma.$SettingsPayload>
/**
 * Model AutopilotConfig
 * 
 */
export type AutopilotConfig = $Result.DefaultSelection<Prisma.$AutopilotConfigPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Projects
 * const projects = await prisma.project.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Projects
   * const projects = await prisma.project.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clipProfile`: Exposes CRUD operations for the **ClipProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClipProfiles
    * const clipProfiles = await prisma.clipProfile.findMany()
    * ```
    */
  get clipProfile(): Prisma.ClipProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transcript`: Exposes CRUD operations for the **Transcript** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transcripts
    * const transcripts = await prisma.transcript.findMany()
    * ```
    */
  get transcript(): Prisma.TranscriptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clipCandidate`: Exposes CRUD operations for the **ClipCandidate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClipCandidates
    * const clipCandidates = await prisma.clipCandidate.findMany()
    * ```
    */
  get clipCandidate(): Prisma.ClipCandidateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clip`: Exposes CRUD operations for the **Clip** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clips
    * const clips = await prisma.clip.findMany()
    * ```
    */
  get clip(): Prisma.ClipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.asset`: Exposes CRUD operations for the **Asset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assets
    * const assets = await prisma.asset.findMany()
    * ```
    */
  get asset(): Prisma.AssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.job`: Exposes CRUD operations for the **Job** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jobs
    * const jobs = await prisma.job.findMany()
    * ```
    */
  get job(): Prisma.JobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.themePreset`: Exposes CRUD operations for the **ThemePreset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ThemePresets
    * const themePresets = await prisma.themePreset.findMany()
    * ```
    */
  get themePreset(): Prisma.ThemePresetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analytics`: Exposes CRUD operations for the **Analytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Analytics
    * const analytics = await prisma.analytics.findMany()
    * ```
    */
  get analytics(): Prisma.AnalyticsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.settings`: Exposes CRUD operations for the **Settings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.settings.findMany()
    * ```
    */
  get settings(): Prisma.SettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.autopilotConfig`: Exposes CRUD operations for the **AutopilotConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AutopilotConfigs
    * const autopilotConfigs = await prisma.autopilotConfig.findMany()
    * ```
    */
  get autopilotConfig(): Prisma.AutopilotConfigDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Project: 'Project',
    ClipProfile: 'ClipProfile',
    Transcript: 'Transcript',
    ClipCandidate: 'ClipCandidate',
    Clip: 'Clip',
    Asset: 'Asset',
    Job: 'Job',
    ThemePreset: 'ThemePreset',
    Analytics: 'Analytics',
    Settings: 'Settings',
    AutopilotConfig: 'AutopilotConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "project" | "clipProfile" | "transcript" | "clipCandidate" | "clip" | "asset" | "job" | "themePreset" | "analytics" | "settings" | "autopilotConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      ClipProfile: {
        payload: Prisma.$ClipProfilePayload<ExtArgs>
        fields: Prisma.ClipProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClipProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClipProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>
          }
          findFirst: {
            args: Prisma.ClipProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClipProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>
          }
          findMany: {
            args: Prisma.ClipProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>[]
          }
          create: {
            args: Prisma.ClipProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>
          }
          createMany: {
            args: Prisma.ClipProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClipProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>[]
          }
          delete: {
            args: Prisma.ClipProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>
          }
          update: {
            args: Prisma.ClipProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>
          }
          deleteMany: {
            args: Prisma.ClipProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClipProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClipProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>[]
          }
          upsert: {
            args: Prisma.ClipProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipProfilePayload>
          }
          aggregate: {
            args: Prisma.ClipProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClipProfile>
          }
          groupBy: {
            args: Prisma.ClipProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClipProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClipProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ClipProfileCountAggregateOutputType> | number
          }
        }
      }
      Transcript: {
        payload: Prisma.$TranscriptPayload<ExtArgs>
        fields: Prisma.TranscriptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranscriptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranscriptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          findFirst: {
            args: Prisma.TranscriptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranscriptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          findMany: {
            args: Prisma.TranscriptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          create: {
            args: Prisma.TranscriptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          createMany: {
            args: Prisma.TranscriptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TranscriptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          delete: {
            args: Prisma.TranscriptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          update: {
            args: Prisma.TranscriptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          deleteMany: {
            args: Prisma.TranscriptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranscriptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TranscriptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          upsert: {
            args: Prisma.TranscriptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          aggregate: {
            args: Prisma.TranscriptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranscript>
          }
          groupBy: {
            args: Prisma.TranscriptGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranscriptGroupByOutputType>[]
          }
          count: {
            args: Prisma.TranscriptCountArgs<ExtArgs>
            result: $Utils.Optional<TranscriptCountAggregateOutputType> | number
          }
        }
      }
      ClipCandidate: {
        payload: Prisma.$ClipCandidatePayload<ExtArgs>
        fields: Prisma.ClipCandidateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClipCandidateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClipCandidateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>
          }
          findFirst: {
            args: Prisma.ClipCandidateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClipCandidateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>
          }
          findMany: {
            args: Prisma.ClipCandidateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>[]
          }
          create: {
            args: Prisma.ClipCandidateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>
          }
          createMany: {
            args: Prisma.ClipCandidateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClipCandidateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>[]
          }
          delete: {
            args: Prisma.ClipCandidateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>
          }
          update: {
            args: Prisma.ClipCandidateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>
          }
          deleteMany: {
            args: Prisma.ClipCandidateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClipCandidateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClipCandidateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>[]
          }
          upsert: {
            args: Prisma.ClipCandidateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipCandidatePayload>
          }
          aggregate: {
            args: Prisma.ClipCandidateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClipCandidate>
          }
          groupBy: {
            args: Prisma.ClipCandidateGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClipCandidateGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClipCandidateCountArgs<ExtArgs>
            result: $Utils.Optional<ClipCandidateCountAggregateOutputType> | number
          }
        }
      }
      Clip: {
        payload: Prisma.$ClipPayload<ExtArgs>
        fields: Prisma.ClipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          findFirst: {
            args: Prisma.ClipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          findMany: {
            args: Prisma.ClipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>[]
          }
          create: {
            args: Prisma.ClipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          createMany: {
            args: Prisma.ClipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>[]
          }
          delete: {
            args: Prisma.ClipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          update: {
            args: Prisma.ClipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          deleteMany: {
            args: Prisma.ClipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>[]
          }
          upsert: {
            args: Prisma.ClipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          aggregate: {
            args: Prisma.ClipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClip>
          }
          groupBy: {
            args: Prisma.ClipGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClipGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClipCountArgs<ExtArgs>
            result: $Utils.Optional<ClipCountAggregateOutputType> | number
          }
        }
      }
      Asset: {
        payload: Prisma.$AssetPayload<ExtArgs>
        fields: Prisma.AssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findFirst: {
            args: Prisma.AssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findMany: {
            args: Prisma.AssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          create: {
            args: Prisma.AssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          createMany: {
            args: Prisma.AssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          delete: {
            args: Prisma.AssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          update: {
            args: Prisma.AssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          deleteMany: {
            args: Prisma.AssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          upsert: {
            args: Prisma.AssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          aggregate: {
            args: Prisma.AssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsset>
          }
          groupBy: {
            args: Prisma.AssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetCountArgs<ExtArgs>
            result: $Utils.Optional<AssetCountAggregateOutputType> | number
          }
        }
      }
      Job: {
        payload: Prisma.$JobPayload<ExtArgs>
        fields: Prisma.JobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findFirst: {
            args: Prisma.JobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findMany: {
            args: Prisma.JobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          create: {
            args: Prisma.JobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          createMany: {
            args: Prisma.JobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          delete: {
            args: Prisma.JobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          update: {
            args: Prisma.JobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          deleteMany: {
            args: Prisma.JobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          upsert: {
            args: Prisma.JobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          aggregate: {
            args: Prisma.JobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob>
          }
          groupBy: {
            args: Prisma.JobGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobCountArgs<ExtArgs>
            result: $Utils.Optional<JobCountAggregateOutputType> | number
          }
        }
      }
      ThemePreset: {
        payload: Prisma.$ThemePresetPayload<ExtArgs>
        fields: Prisma.ThemePresetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ThemePresetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ThemePresetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>
          }
          findFirst: {
            args: Prisma.ThemePresetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ThemePresetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>
          }
          findMany: {
            args: Prisma.ThemePresetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>[]
          }
          create: {
            args: Prisma.ThemePresetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>
          }
          createMany: {
            args: Prisma.ThemePresetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ThemePresetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>[]
          }
          delete: {
            args: Prisma.ThemePresetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>
          }
          update: {
            args: Prisma.ThemePresetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>
          }
          deleteMany: {
            args: Prisma.ThemePresetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ThemePresetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ThemePresetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>[]
          }
          upsert: {
            args: Prisma.ThemePresetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePresetPayload>
          }
          aggregate: {
            args: Prisma.ThemePresetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateThemePreset>
          }
          groupBy: {
            args: Prisma.ThemePresetGroupByArgs<ExtArgs>
            result: $Utils.Optional<ThemePresetGroupByOutputType>[]
          }
          count: {
            args: Prisma.ThemePresetCountArgs<ExtArgs>
            result: $Utils.Optional<ThemePresetCountAggregateOutputType> | number
          }
        }
      }
      Analytics: {
        payload: Prisma.$AnalyticsPayload<ExtArgs>
        fields: Prisma.AnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          findFirst: {
            args: Prisma.AnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          findMany: {
            args: Prisma.AnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>[]
          }
          create: {
            args: Prisma.AnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          createMany: {
            args: Prisma.AnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalyticsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>[]
          }
          delete: {
            args: Prisma.AnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          update: {
            args: Prisma.AnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.AnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalyticsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>[]
          }
          upsert: {
            args: Prisma.AnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          aggregate: {
            args: Prisma.AnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalytics>
          }
          groupBy: {
            args: Prisma.AnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsCountAggregateOutputType> | number
          }
        }
      }
      Settings: {
        payload: Prisma.$SettingsPayload<ExtArgs>
        fields: Prisma.SettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findFirst: {
            args: Prisma.SettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findMany: {
            args: Prisma.SettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          create: {
            args: Prisma.SettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          createMany: {
            args: Prisma.SettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          delete: {
            args: Prisma.SettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          update: {
            args: Prisma.SettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          deleteMany: {
            args: Prisma.SettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          upsert: {
            args: Prisma.SettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          aggregate: {
            args: Prisma.SettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSettings>
          }
          groupBy: {
            args: Prisma.SettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingsCountArgs<ExtArgs>
            result: $Utils.Optional<SettingsCountAggregateOutputType> | number
          }
        }
      }
      AutopilotConfig: {
        payload: Prisma.$AutopilotConfigPayload<ExtArgs>
        fields: Prisma.AutopilotConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AutopilotConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AutopilotConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>
          }
          findFirst: {
            args: Prisma.AutopilotConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AutopilotConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>
          }
          findMany: {
            args: Prisma.AutopilotConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>[]
          }
          create: {
            args: Prisma.AutopilotConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>
          }
          createMany: {
            args: Prisma.AutopilotConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AutopilotConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>[]
          }
          delete: {
            args: Prisma.AutopilotConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>
          }
          update: {
            args: Prisma.AutopilotConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>
          }
          deleteMany: {
            args: Prisma.AutopilotConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AutopilotConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AutopilotConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>[]
          }
          upsert: {
            args: Prisma.AutopilotConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotConfigPayload>
          }
          aggregate: {
            args: Prisma.AutopilotConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAutopilotConfig>
          }
          groupBy: {
            args: Prisma.AutopilotConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<AutopilotConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.AutopilotConfigCountArgs<ExtArgs>
            result: $Utils.Optional<AutopilotConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    project?: ProjectOmit
    clipProfile?: ClipProfileOmit
    transcript?: TranscriptOmit
    clipCandidate?: ClipCandidateOmit
    clip?: ClipOmit
    asset?: AssetOmit
    job?: JobOmit
    themePreset?: ThemePresetOmit
    analytics?: AnalyticsOmit
    settings?: SettingsOmit
    autopilotConfig?: AutopilotConfigOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    transcripts: number
    candidates: number
    clips: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcripts?: boolean | ProjectCountOutputTypeCountTranscriptsArgs
    candidates?: boolean | ProjectCountOutputTypeCountCandidatesArgs
    clips?: boolean | ProjectCountOutputTypeCountClipsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTranscriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountCandidatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClipCandidateWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountClipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClipWhereInput
  }


  /**
   * Count Type ClipCountOutputType
   */

  export type ClipCountOutputType = {
    assets: number
    analytics: number
  }

  export type ClipCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | ClipCountOutputTypeCountAssetsArgs
    analytics?: boolean | ClipCountOutputTypeCountAnalyticsArgs
  }

  // Custom InputTypes
  /**
   * ClipCountOutputType without action
   */
  export type ClipCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCountOutputType
     */
    select?: ClipCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClipCountOutputType without action
   */
  export type ClipCountOutputTypeCountAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
  }

  /**
   * ClipCountOutputType without action
   */
  export type ClipCountOutputTypeCountAnalyticsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    durationMs: number | null
  }

  export type ProjectSumAggregateOutputType = {
    durationMs: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    title: string | null
    sourcePath: string | null
    durationMs: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    title: string | null
    sourcePath: string | null
    durationMs: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    title: number
    sourcePath: number
    durationMs: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectAvgAggregateInputType = {
    durationMs?: true
  }

  export type ProjectSumAggregateInputType = {
    durationMs?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    title?: true
    sourcePath?: true
    durationMs?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    title?: true
    sourcePath?: true
    durationMs?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    title?: true
    sourcePath?: true
    durationMs?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    title: string
    sourcePath: string
    durationMs: number | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    sourcePath?: boolean
    durationMs?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transcripts?: boolean | Project$transcriptsArgs<ExtArgs>
    candidates?: boolean | Project$candidatesArgs<ExtArgs>
    clips?: boolean | Project$clipsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    sourcePath?: boolean
    durationMs?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    sourcePath?: boolean
    durationMs?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    title?: boolean
    sourcePath?: boolean
    durationMs?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "sourcePath" | "durationMs" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcripts?: boolean | Project$transcriptsArgs<ExtArgs>
    candidates?: boolean | Project$candidatesArgs<ExtArgs>
    clips?: boolean | Project$clipsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      transcripts: Prisma.$TranscriptPayload<ExtArgs>[]
      candidates: Prisma.$ClipCandidatePayload<ExtArgs>[]
      clips: Prisma.$ClipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      sourcePath: string
      durationMs: number | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transcripts<T extends Project$transcriptsArgs<ExtArgs> = {}>(args?: Subset<T, Project$transcriptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    candidates<T extends Project$candidatesArgs<ExtArgs> = {}>(args?: Subset<T, Project$candidatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    clips<T extends Project$clipsArgs<ExtArgs> = {}>(args?: Subset<T, Project$clipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly title: FieldRef<"Project", 'String'>
    readonly sourcePath: FieldRef<"Project", 'String'>
    readonly durationMs: FieldRef<"Project", 'Int'>
    readonly status: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.transcripts
   */
  export type Project$transcriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    where?: TranscriptWhereInput
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    cursor?: TranscriptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Project.candidates
   */
  export type Project$candidatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    where?: ClipCandidateWhereInput
    orderBy?: ClipCandidateOrderByWithRelationInput | ClipCandidateOrderByWithRelationInput[]
    cursor?: ClipCandidateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClipCandidateScalarFieldEnum | ClipCandidateScalarFieldEnum[]
  }

  /**
   * Project.clips
   */
  export type Project$clipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    where?: ClipWhereInput
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    cursor?: ClipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClipScalarFieldEnum | ClipScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model ClipProfile
   */

  export type AggregateClipProfile = {
    _count: ClipProfileCountAggregateOutputType | null
    _min: ClipProfileMinAggregateOutputType | null
    _max: ClipProfileMaxAggregateOutputType | null
  }

  export type ClipProfileMinAggregateOutputType = {
    id: string | null
    name: string | null
    configJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClipProfileMaxAggregateOutputType = {
    id: string | null
    name: string | null
    configJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClipProfileCountAggregateOutputType = {
    id: number
    name: number
    configJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClipProfileMinAggregateInputType = {
    id?: true
    name?: true
    configJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClipProfileMaxAggregateInputType = {
    id?: true
    name?: true
    configJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClipProfileCountAggregateInputType = {
    id?: true
    name?: true
    configJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClipProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClipProfile to aggregate.
     */
    where?: ClipProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipProfiles to fetch.
     */
    orderBy?: ClipProfileOrderByWithRelationInput | ClipProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClipProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClipProfiles
    **/
    _count?: true | ClipProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClipProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClipProfileMaxAggregateInputType
  }

  export type GetClipProfileAggregateType<T extends ClipProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateClipProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClipProfile[P]>
      : GetScalarType<T[P], AggregateClipProfile[P]>
  }




  export type ClipProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClipProfileWhereInput
    orderBy?: ClipProfileOrderByWithAggregationInput | ClipProfileOrderByWithAggregationInput[]
    by: ClipProfileScalarFieldEnum[] | ClipProfileScalarFieldEnum
    having?: ClipProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClipProfileCountAggregateInputType | true
    _min?: ClipProfileMinAggregateInputType
    _max?: ClipProfileMaxAggregateInputType
  }

  export type ClipProfileGroupByOutputType = {
    id: string
    name: string
    configJson: string
    createdAt: Date
    updatedAt: Date
    _count: ClipProfileCountAggregateOutputType | null
    _min: ClipProfileMinAggregateOutputType | null
    _max: ClipProfileMaxAggregateOutputType | null
  }

  type GetClipProfileGroupByPayload<T extends ClipProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClipProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClipProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClipProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ClipProfileGroupByOutputType[P]>
        }
      >
    >


  export type ClipProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    configJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["clipProfile"]>

  export type ClipProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    configJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["clipProfile"]>

  export type ClipProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    configJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["clipProfile"]>

  export type ClipProfileSelectScalar = {
    id?: boolean
    name?: boolean
    configJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClipProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "configJson" | "createdAt" | "updatedAt", ExtArgs["result"]["clipProfile"]>

  export type $ClipProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClipProfile"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      configJson: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clipProfile"]>
    composites: {}
  }

  type ClipProfileGetPayload<S extends boolean | null | undefined | ClipProfileDefaultArgs> = $Result.GetResult<Prisma.$ClipProfilePayload, S>

  type ClipProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClipProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClipProfileCountAggregateInputType | true
    }

  export interface ClipProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClipProfile'], meta: { name: 'ClipProfile' } }
    /**
     * Find zero or one ClipProfile that matches the filter.
     * @param {ClipProfileFindUniqueArgs} args - Arguments to find a ClipProfile
     * @example
     * // Get one ClipProfile
     * const clipProfile = await prisma.clipProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClipProfileFindUniqueArgs>(args: SelectSubset<T, ClipProfileFindUniqueArgs<ExtArgs>>): Prisma__ClipProfileClient<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClipProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClipProfileFindUniqueOrThrowArgs} args - Arguments to find a ClipProfile
     * @example
     * // Get one ClipProfile
     * const clipProfile = await prisma.clipProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClipProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ClipProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClipProfileClient<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClipProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipProfileFindFirstArgs} args - Arguments to find a ClipProfile
     * @example
     * // Get one ClipProfile
     * const clipProfile = await prisma.clipProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClipProfileFindFirstArgs>(args?: SelectSubset<T, ClipProfileFindFirstArgs<ExtArgs>>): Prisma__ClipProfileClient<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClipProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipProfileFindFirstOrThrowArgs} args - Arguments to find a ClipProfile
     * @example
     * // Get one ClipProfile
     * const clipProfile = await prisma.clipProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClipProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ClipProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClipProfileClient<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClipProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClipProfiles
     * const clipProfiles = await prisma.clipProfile.findMany()
     * 
     * // Get first 10 ClipProfiles
     * const clipProfiles = await prisma.clipProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clipProfileWithIdOnly = await prisma.clipProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClipProfileFindManyArgs>(args?: SelectSubset<T, ClipProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClipProfile.
     * @param {ClipProfileCreateArgs} args - Arguments to create a ClipProfile.
     * @example
     * // Create one ClipProfile
     * const ClipProfile = await prisma.clipProfile.create({
     *   data: {
     *     // ... data to create a ClipProfile
     *   }
     * })
     * 
     */
    create<T extends ClipProfileCreateArgs>(args: SelectSubset<T, ClipProfileCreateArgs<ExtArgs>>): Prisma__ClipProfileClient<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClipProfiles.
     * @param {ClipProfileCreateManyArgs} args - Arguments to create many ClipProfiles.
     * @example
     * // Create many ClipProfiles
     * const clipProfile = await prisma.clipProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClipProfileCreateManyArgs>(args?: SelectSubset<T, ClipProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClipProfiles and returns the data saved in the database.
     * @param {ClipProfileCreateManyAndReturnArgs} args - Arguments to create many ClipProfiles.
     * @example
     * // Create many ClipProfiles
     * const clipProfile = await prisma.clipProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClipProfiles and only return the `id`
     * const clipProfileWithIdOnly = await prisma.clipProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClipProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ClipProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClipProfile.
     * @param {ClipProfileDeleteArgs} args - Arguments to delete one ClipProfile.
     * @example
     * // Delete one ClipProfile
     * const ClipProfile = await prisma.clipProfile.delete({
     *   where: {
     *     // ... filter to delete one ClipProfile
     *   }
     * })
     * 
     */
    delete<T extends ClipProfileDeleteArgs>(args: SelectSubset<T, ClipProfileDeleteArgs<ExtArgs>>): Prisma__ClipProfileClient<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClipProfile.
     * @param {ClipProfileUpdateArgs} args - Arguments to update one ClipProfile.
     * @example
     * // Update one ClipProfile
     * const clipProfile = await prisma.clipProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClipProfileUpdateArgs>(args: SelectSubset<T, ClipProfileUpdateArgs<ExtArgs>>): Prisma__ClipProfileClient<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClipProfiles.
     * @param {ClipProfileDeleteManyArgs} args - Arguments to filter ClipProfiles to delete.
     * @example
     * // Delete a few ClipProfiles
     * const { count } = await prisma.clipProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClipProfileDeleteManyArgs>(args?: SelectSubset<T, ClipProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClipProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClipProfiles
     * const clipProfile = await prisma.clipProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClipProfileUpdateManyArgs>(args: SelectSubset<T, ClipProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClipProfiles and returns the data updated in the database.
     * @param {ClipProfileUpdateManyAndReturnArgs} args - Arguments to update many ClipProfiles.
     * @example
     * // Update many ClipProfiles
     * const clipProfile = await prisma.clipProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClipProfiles and only return the `id`
     * const clipProfileWithIdOnly = await prisma.clipProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClipProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ClipProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClipProfile.
     * @param {ClipProfileUpsertArgs} args - Arguments to update or create a ClipProfile.
     * @example
     * // Update or create a ClipProfile
     * const clipProfile = await prisma.clipProfile.upsert({
     *   create: {
     *     // ... data to create a ClipProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClipProfile we want to update
     *   }
     * })
     */
    upsert<T extends ClipProfileUpsertArgs>(args: SelectSubset<T, ClipProfileUpsertArgs<ExtArgs>>): Prisma__ClipProfileClient<$Result.GetResult<Prisma.$ClipProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClipProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipProfileCountArgs} args - Arguments to filter ClipProfiles to count.
     * @example
     * // Count the number of ClipProfiles
     * const count = await prisma.clipProfile.count({
     *   where: {
     *     // ... the filter for the ClipProfiles we want to count
     *   }
     * })
    **/
    count<T extends ClipProfileCountArgs>(
      args?: Subset<T, ClipProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClipProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClipProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClipProfileAggregateArgs>(args: Subset<T, ClipProfileAggregateArgs>): Prisma.PrismaPromise<GetClipProfileAggregateType<T>>

    /**
     * Group by ClipProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClipProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClipProfileGroupByArgs['orderBy'] }
        : { orderBy?: ClipProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClipProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClipProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClipProfile model
   */
  readonly fields: ClipProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClipProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClipProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClipProfile model
   */
  interface ClipProfileFieldRefs {
    readonly id: FieldRef<"ClipProfile", 'String'>
    readonly name: FieldRef<"ClipProfile", 'String'>
    readonly configJson: FieldRef<"ClipProfile", 'String'>
    readonly createdAt: FieldRef<"ClipProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"ClipProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClipProfile findUnique
   */
  export type ClipProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * Filter, which ClipProfile to fetch.
     */
    where: ClipProfileWhereUniqueInput
  }

  /**
   * ClipProfile findUniqueOrThrow
   */
  export type ClipProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * Filter, which ClipProfile to fetch.
     */
    where: ClipProfileWhereUniqueInput
  }

  /**
   * ClipProfile findFirst
   */
  export type ClipProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * Filter, which ClipProfile to fetch.
     */
    where?: ClipProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipProfiles to fetch.
     */
    orderBy?: ClipProfileOrderByWithRelationInput | ClipProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClipProfiles.
     */
    cursor?: ClipProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClipProfiles.
     */
    distinct?: ClipProfileScalarFieldEnum | ClipProfileScalarFieldEnum[]
  }

  /**
   * ClipProfile findFirstOrThrow
   */
  export type ClipProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * Filter, which ClipProfile to fetch.
     */
    where?: ClipProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipProfiles to fetch.
     */
    orderBy?: ClipProfileOrderByWithRelationInput | ClipProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClipProfiles.
     */
    cursor?: ClipProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClipProfiles.
     */
    distinct?: ClipProfileScalarFieldEnum | ClipProfileScalarFieldEnum[]
  }

  /**
   * ClipProfile findMany
   */
  export type ClipProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * Filter, which ClipProfiles to fetch.
     */
    where?: ClipProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipProfiles to fetch.
     */
    orderBy?: ClipProfileOrderByWithRelationInput | ClipProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClipProfiles.
     */
    cursor?: ClipProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipProfiles.
     */
    skip?: number
    distinct?: ClipProfileScalarFieldEnum | ClipProfileScalarFieldEnum[]
  }

  /**
   * ClipProfile create
   */
  export type ClipProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * The data needed to create a ClipProfile.
     */
    data: XOR<ClipProfileCreateInput, ClipProfileUncheckedCreateInput>
  }

  /**
   * ClipProfile createMany
   */
  export type ClipProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClipProfiles.
     */
    data: ClipProfileCreateManyInput | ClipProfileCreateManyInput[]
  }

  /**
   * ClipProfile createManyAndReturn
   */
  export type ClipProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * The data used to create many ClipProfiles.
     */
    data: ClipProfileCreateManyInput | ClipProfileCreateManyInput[]
  }

  /**
   * ClipProfile update
   */
  export type ClipProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * The data needed to update a ClipProfile.
     */
    data: XOR<ClipProfileUpdateInput, ClipProfileUncheckedUpdateInput>
    /**
     * Choose, which ClipProfile to update.
     */
    where: ClipProfileWhereUniqueInput
  }

  /**
   * ClipProfile updateMany
   */
  export type ClipProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClipProfiles.
     */
    data: XOR<ClipProfileUpdateManyMutationInput, ClipProfileUncheckedUpdateManyInput>
    /**
     * Filter which ClipProfiles to update
     */
    where?: ClipProfileWhereInput
    /**
     * Limit how many ClipProfiles to update.
     */
    limit?: number
  }

  /**
   * ClipProfile updateManyAndReturn
   */
  export type ClipProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * The data used to update ClipProfiles.
     */
    data: XOR<ClipProfileUpdateManyMutationInput, ClipProfileUncheckedUpdateManyInput>
    /**
     * Filter which ClipProfiles to update
     */
    where?: ClipProfileWhereInput
    /**
     * Limit how many ClipProfiles to update.
     */
    limit?: number
  }

  /**
   * ClipProfile upsert
   */
  export type ClipProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * The filter to search for the ClipProfile to update in case it exists.
     */
    where: ClipProfileWhereUniqueInput
    /**
     * In case the ClipProfile found by the `where` argument doesn't exist, create a new ClipProfile with this data.
     */
    create: XOR<ClipProfileCreateInput, ClipProfileUncheckedCreateInput>
    /**
     * In case the ClipProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClipProfileUpdateInput, ClipProfileUncheckedUpdateInput>
  }

  /**
   * ClipProfile delete
   */
  export type ClipProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
    /**
     * Filter which ClipProfile to delete.
     */
    where: ClipProfileWhereUniqueInput
  }

  /**
   * ClipProfile deleteMany
   */
  export type ClipProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClipProfiles to delete
     */
    where?: ClipProfileWhereInput
    /**
     * Limit how many ClipProfiles to delete.
     */
    limit?: number
  }

  /**
   * ClipProfile without action
   */
  export type ClipProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipProfile
     */
    select?: ClipProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipProfile
     */
    omit?: ClipProfileOmit<ExtArgs> | null
  }


  /**
   * Model Transcript
   */

  export type AggregateTranscript = {
    _count: TranscriptCountAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  export type TranscriptMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    provider: string | null
    segmentsJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TranscriptMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    provider: string | null
    segmentsJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TranscriptCountAggregateOutputType = {
    id: number
    projectId: number
    provider: number
    segmentsJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TranscriptMinAggregateInputType = {
    id?: true
    projectId?: true
    provider?: true
    segmentsJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TranscriptMaxAggregateInputType = {
    id?: true
    projectId?: true
    provider?: true
    segmentsJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TranscriptCountAggregateInputType = {
    id?: true
    projectId?: true
    provider?: true
    segmentsJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TranscriptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transcript to aggregate.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transcripts
    **/
    _count?: true | TranscriptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranscriptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranscriptMaxAggregateInputType
  }

  export type GetTranscriptAggregateType<T extends TranscriptAggregateArgs> = {
        [P in keyof T & keyof AggregateTranscript]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranscript[P]>
      : GetScalarType<T[P], AggregateTranscript[P]>
  }




  export type TranscriptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptWhereInput
    orderBy?: TranscriptOrderByWithAggregationInput | TranscriptOrderByWithAggregationInput[]
    by: TranscriptScalarFieldEnum[] | TranscriptScalarFieldEnum
    having?: TranscriptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranscriptCountAggregateInputType | true
    _min?: TranscriptMinAggregateInputType
    _max?: TranscriptMaxAggregateInputType
  }

  export type TranscriptGroupByOutputType = {
    id: string
    projectId: string
    provider: string
    segmentsJson: string
    createdAt: Date
    updatedAt: Date
    _count: TranscriptCountAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  type GetTranscriptGroupByPayload<T extends TranscriptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranscriptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranscriptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
            : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
        }
      >
    >


  export type TranscriptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    provider?: boolean
    segmentsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    provider?: boolean
    segmentsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    provider?: boolean
    segmentsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectScalar = {
    id?: boolean
    projectId?: boolean
    provider?: boolean
    segmentsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TranscriptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "provider" | "segmentsJson" | "createdAt" | "updatedAt", ExtArgs["result"]["transcript"]>
  export type TranscriptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type TranscriptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type TranscriptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $TranscriptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transcript"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      provider: string
      segmentsJson: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transcript"]>
    composites: {}
  }

  type TranscriptGetPayload<S extends boolean | null | undefined | TranscriptDefaultArgs> = $Result.GetResult<Prisma.$TranscriptPayload, S>

  type TranscriptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TranscriptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranscriptCountAggregateInputType | true
    }

  export interface TranscriptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transcript'], meta: { name: 'Transcript' } }
    /**
     * Find zero or one Transcript that matches the filter.
     * @param {TranscriptFindUniqueArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranscriptFindUniqueArgs>(args: SelectSubset<T, TranscriptFindUniqueArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transcript that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TranscriptFindUniqueOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranscriptFindUniqueOrThrowArgs>(args: SelectSubset<T, TranscriptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transcript that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranscriptFindFirstArgs>(args?: SelectSubset<T, TranscriptFindFirstArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transcript that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranscriptFindFirstOrThrowArgs>(args?: SelectSubset<T, TranscriptFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transcripts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transcripts
     * const transcripts = await prisma.transcript.findMany()
     * 
     * // Get first 10 Transcripts
     * const transcripts = await prisma.transcript.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transcriptWithIdOnly = await prisma.transcript.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranscriptFindManyArgs>(args?: SelectSubset<T, TranscriptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transcript.
     * @param {TranscriptCreateArgs} args - Arguments to create a Transcript.
     * @example
     * // Create one Transcript
     * const Transcript = await prisma.transcript.create({
     *   data: {
     *     // ... data to create a Transcript
     *   }
     * })
     * 
     */
    create<T extends TranscriptCreateArgs>(args: SelectSubset<T, TranscriptCreateArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transcripts.
     * @param {TranscriptCreateManyArgs} args - Arguments to create many Transcripts.
     * @example
     * // Create many Transcripts
     * const transcript = await prisma.transcript.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranscriptCreateManyArgs>(args?: SelectSubset<T, TranscriptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transcripts and returns the data saved in the database.
     * @param {TranscriptCreateManyAndReturnArgs} args - Arguments to create many Transcripts.
     * @example
     * // Create many Transcripts
     * const transcript = await prisma.transcript.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transcripts and only return the `id`
     * const transcriptWithIdOnly = await prisma.transcript.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TranscriptCreateManyAndReturnArgs>(args?: SelectSubset<T, TranscriptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transcript.
     * @param {TranscriptDeleteArgs} args - Arguments to delete one Transcript.
     * @example
     * // Delete one Transcript
     * const Transcript = await prisma.transcript.delete({
     *   where: {
     *     // ... filter to delete one Transcript
     *   }
     * })
     * 
     */
    delete<T extends TranscriptDeleteArgs>(args: SelectSubset<T, TranscriptDeleteArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transcript.
     * @param {TranscriptUpdateArgs} args - Arguments to update one Transcript.
     * @example
     * // Update one Transcript
     * const transcript = await prisma.transcript.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranscriptUpdateArgs>(args: SelectSubset<T, TranscriptUpdateArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transcripts.
     * @param {TranscriptDeleteManyArgs} args - Arguments to filter Transcripts to delete.
     * @example
     * // Delete a few Transcripts
     * const { count } = await prisma.transcript.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranscriptDeleteManyArgs>(args?: SelectSubset<T, TranscriptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranscriptUpdateManyArgs>(args: SelectSubset<T, TranscriptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts and returns the data updated in the database.
     * @param {TranscriptUpdateManyAndReturnArgs} args - Arguments to update many Transcripts.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transcripts and only return the `id`
     * const transcriptWithIdOnly = await prisma.transcript.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TranscriptUpdateManyAndReturnArgs>(args: SelectSubset<T, TranscriptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transcript.
     * @param {TranscriptUpsertArgs} args - Arguments to update or create a Transcript.
     * @example
     * // Update or create a Transcript
     * const transcript = await prisma.transcript.upsert({
     *   create: {
     *     // ... data to create a Transcript
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transcript we want to update
     *   }
     * })
     */
    upsert<T extends TranscriptUpsertArgs>(args: SelectSubset<T, TranscriptUpsertArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptCountArgs} args - Arguments to filter Transcripts to count.
     * @example
     * // Count the number of Transcripts
     * const count = await prisma.transcript.count({
     *   where: {
     *     // ... the filter for the Transcripts we want to count
     *   }
     * })
    **/
    count<T extends TranscriptCountArgs>(
      args?: Subset<T, TranscriptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranscriptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranscriptAggregateArgs>(args: Subset<T, TranscriptAggregateArgs>): Prisma.PrismaPromise<GetTranscriptAggregateType<T>>

    /**
     * Group by Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TranscriptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranscriptGroupByArgs['orderBy'] }
        : { orderBy?: TranscriptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TranscriptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranscriptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transcript model
   */
  readonly fields: TranscriptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transcript.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranscriptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transcript model
   */
  interface TranscriptFieldRefs {
    readonly id: FieldRef<"Transcript", 'String'>
    readonly projectId: FieldRef<"Transcript", 'String'>
    readonly provider: FieldRef<"Transcript", 'String'>
    readonly segmentsJson: FieldRef<"Transcript", 'String'>
    readonly createdAt: FieldRef<"Transcript", 'DateTime'>
    readonly updatedAt: FieldRef<"Transcript", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transcript findUnique
   */
  export type TranscriptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findUniqueOrThrow
   */
  export type TranscriptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findFirst
   */
  export type TranscriptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript findFirstOrThrow
   */
  export type TranscriptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript findMany
   */
  export type TranscriptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcripts to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript create
   */
  export type TranscriptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The data needed to create a Transcript.
     */
    data: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
  }

  /**
   * Transcript createMany
   */
  export type TranscriptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transcripts.
     */
    data: TranscriptCreateManyInput | TranscriptCreateManyInput[]
  }

  /**
   * Transcript createManyAndReturn
   */
  export type TranscriptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * The data used to create many Transcripts.
     */
    data: TranscriptCreateManyInput | TranscriptCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transcript update
   */
  export type TranscriptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The data needed to update a Transcript.
     */
    data: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
    /**
     * Choose, which Transcript to update.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript updateMany
   */
  export type TranscriptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to update.
     */
    limit?: number
  }

  /**
   * Transcript updateManyAndReturn
   */
  export type TranscriptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transcript upsert
   */
  export type TranscriptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The filter to search for the Transcript to update in case it exists.
     */
    where: TranscriptWhereUniqueInput
    /**
     * In case the Transcript found by the `where` argument doesn't exist, create a new Transcript with this data.
     */
    create: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
    /**
     * In case the Transcript was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
  }

  /**
   * Transcript delete
   */
  export type TranscriptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter which Transcript to delete.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript deleteMany
   */
  export type TranscriptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transcripts to delete
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to delete.
     */
    limit?: number
  }

  /**
   * Transcript without action
   */
  export type TranscriptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
  }


  /**
   * Model ClipCandidate
   */

  export type AggregateClipCandidate = {
    _count: ClipCandidateCountAggregateOutputType | null
    _avg: ClipCandidateAvgAggregateOutputType | null
    _sum: ClipCandidateSumAggregateOutputType | null
    _min: ClipCandidateMinAggregateOutputType | null
    _max: ClipCandidateMaxAggregateOutputType | null
  }

  export type ClipCandidateAvgAggregateOutputType = {
    startMs: number | null
    endMs: number | null
  }

  export type ClipCandidateSumAggregateOutputType = {
    startMs: number | null
    endMs: number | null
  }

  export type ClipCandidateMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    startMs: number | null
    endMs: number | null
    statsJson: string | null
    createdAt: Date | null
  }

  export type ClipCandidateMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    startMs: number | null
    endMs: number | null
    statsJson: string | null
    createdAt: Date | null
  }

  export type ClipCandidateCountAggregateOutputType = {
    id: number
    projectId: number
    startMs: number
    endMs: number
    statsJson: number
    createdAt: number
    _all: number
  }


  export type ClipCandidateAvgAggregateInputType = {
    startMs?: true
    endMs?: true
  }

  export type ClipCandidateSumAggregateInputType = {
    startMs?: true
    endMs?: true
  }

  export type ClipCandidateMinAggregateInputType = {
    id?: true
    projectId?: true
    startMs?: true
    endMs?: true
    statsJson?: true
    createdAt?: true
  }

  export type ClipCandidateMaxAggregateInputType = {
    id?: true
    projectId?: true
    startMs?: true
    endMs?: true
    statsJson?: true
    createdAt?: true
  }

  export type ClipCandidateCountAggregateInputType = {
    id?: true
    projectId?: true
    startMs?: true
    endMs?: true
    statsJson?: true
    createdAt?: true
    _all?: true
  }

  export type ClipCandidateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClipCandidate to aggregate.
     */
    where?: ClipCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipCandidates to fetch.
     */
    orderBy?: ClipCandidateOrderByWithRelationInput | ClipCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClipCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClipCandidates
    **/
    _count?: true | ClipCandidateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClipCandidateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClipCandidateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClipCandidateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClipCandidateMaxAggregateInputType
  }

  export type GetClipCandidateAggregateType<T extends ClipCandidateAggregateArgs> = {
        [P in keyof T & keyof AggregateClipCandidate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClipCandidate[P]>
      : GetScalarType<T[P], AggregateClipCandidate[P]>
  }




  export type ClipCandidateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClipCandidateWhereInput
    orderBy?: ClipCandidateOrderByWithAggregationInput | ClipCandidateOrderByWithAggregationInput[]
    by: ClipCandidateScalarFieldEnum[] | ClipCandidateScalarFieldEnum
    having?: ClipCandidateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClipCandidateCountAggregateInputType | true
    _avg?: ClipCandidateAvgAggregateInputType
    _sum?: ClipCandidateSumAggregateInputType
    _min?: ClipCandidateMinAggregateInputType
    _max?: ClipCandidateMaxAggregateInputType
  }

  export type ClipCandidateGroupByOutputType = {
    id: string
    projectId: string
    startMs: number
    endMs: number
    statsJson: string
    createdAt: Date
    _count: ClipCandidateCountAggregateOutputType | null
    _avg: ClipCandidateAvgAggregateOutputType | null
    _sum: ClipCandidateSumAggregateOutputType | null
    _min: ClipCandidateMinAggregateOutputType | null
    _max: ClipCandidateMaxAggregateOutputType | null
  }

  type GetClipCandidateGroupByPayload<T extends ClipCandidateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClipCandidateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClipCandidateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClipCandidateGroupByOutputType[P]>
            : GetScalarType<T[P], ClipCandidateGroupByOutputType[P]>
        }
      >
    >


  export type ClipCandidateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    startMs?: boolean
    endMs?: boolean
    statsJson?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clipCandidate"]>

  export type ClipCandidateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    startMs?: boolean
    endMs?: boolean
    statsJson?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clipCandidate"]>

  export type ClipCandidateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    startMs?: boolean
    endMs?: boolean
    statsJson?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clipCandidate"]>

  export type ClipCandidateSelectScalar = {
    id?: boolean
    projectId?: boolean
    startMs?: boolean
    endMs?: boolean
    statsJson?: boolean
    createdAt?: boolean
  }

  export type ClipCandidateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "startMs" | "endMs" | "statsJson" | "createdAt", ExtArgs["result"]["clipCandidate"]>
  export type ClipCandidateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ClipCandidateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ClipCandidateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ClipCandidatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClipCandidate"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      startMs: number
      endMs: number
      statsJson: string
      createdAt: Date
    }, ExtArgs["result"]["clipCandidate"]>
    composites: {}
  }

  type ClipCandidateGetPayload<S extends boolean | null | undefined | ClipCandidateDefaultArgs> = $Result.GetResult<Prisma.$ClipCandidatePayload, S>

  type ClipCandidateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClipCandidateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClipCandidateCountAggregateInputType | true
    }

  export interface ClipCandidateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClipCandidate'], meta: { name: 'ClipCandidate' } }
    /**
     * Find zero or one ClipCandidate that matches the filter.
     * @param {ClipCandidateFindUniqueArgs} args - Arguments to find a ClipCandidate
     * @example
     * // Get one ClipCandidate
     * const clipCandidate = await prisma.clipCandidate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClipCandidateFindUniqueArgs>(args: SelectSubset<T, ClipCandidateFindUniqueArgs<ExtArgs>>): Prisma__ClipCandidateClient<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClipCandidate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClipCandidateFindUniqueOrThrowArgs} args - Arguments to find a ClipCandidate
     * @example
     * // Get one ClipCandidate
     * const clipCandidate = await prisma.clipCandidate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClipCandidateFindUniqueOrThrowArgs>(args: SelectSubset<T, ClipCandidateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClipCandidateClient<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClipCandidate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCandidateFindFirstArgs} args - Arguments to find a ClipCandidate
     * @example
     * // Get one ClipCandidate
     * const clipCandidate = await prisma.clipCandidate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClipCandidateFindFirstArgs>(args?: SelectSubset<T, ClipCandidateFindFirstArgs<ExtArgs>>): Prisma__ClipCandidateClient<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClipCandidate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCandidateFindFirstOrThrowArgs} args - Arguments to find a ClipCandidate
     * @example
     * // Get one ClipCandidate
     * const clipCandidate = await prisma.clipCandidate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClipCandidateFindFirstOrThrowArgs>(args?: SelectSubset<T, ClipCandidateFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClipCandidateClient<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClipCandidates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCandidateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClipCandidates
     * const clipCandidates = await prisma.clipCandidate.findMany()
     * 
     * // Get first 10 ClipCandidates
     * const clipCandidates = await prisma.clipCandidate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clipCandidateWithIdOnly = await prisma.clipCandidate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClipCandidateFindManyArgs>(args?: SelectSubset<T, ClipCandidateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClipCandidate.
     * @param {ClipCandidateCreateArgs} args - Arguments to create a ClipCandidate.
     * @example
     * // Create one ClipCandidate
     * const ClipCandidate = await prisma.clipCandidate.create({
     *   data: {
     *     // ... data to create a ClipCandidate
     *   }
     * })
     * 
     */
    create<T extends ClipCandidateCreateArgs>(args: SelectSubset<T, ClipCandidateCreateArgs<ExtArgs>>): Prisma__ClipCandidateClient<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClipCandidates.
     * @param {ClipCandidateCreateManyArgs} args - Arguments to create many ClipCandidates.
     * @example
     * // Create many ClipCandidates
     * const clipCandidate = await prisma.clipCandidate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClipCandidateCreateManyArgs>(args?: SelectSubset<T, ClipCandidateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClipCandidates and returns the data saved in the database.
     * @param {ClipCandidateCreateManyAndReturnArgs} args - Arguments to create many ClipCandidates.
     * @example
     * // Create many ClipCandidates
     * const clipCandidate = await prisma.clipCandidate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClipCandidates and only return the `id`
     * const clipCandidateWithIdOnly = await prisma.clipCandidate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClipCandidateCreateManyAndReturnArgs>(args?: SelectSubset<T, ClipCandidateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClipCandidate.
     * @param {ClipCandidateDeleteArgs} args - Arguments to delete one ClipCandidate.
     * @example
     * // Delete one ClipCandidate
     * const ClipCandidate = await prisma.clipCandidate.delete({
     *   where: {
     *     // ... filter to delete one ClipCandidate
     *   }
     * })
     * 
     */
    delete<T extends ClipCandidateDeleteArgs>(args: SelectSubset<T, ClipCandidateDeleteArgs<ExtArgs>>): Prisma__ClipCandidateClient<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClipCandidate.
     * @param {ClipCandidateUpdateArgs} args - Arguments to update one ClipCandidate.
     * @example
     * // Update one ClipCandidate
     * const clipCandidate = await prisma.clipCandidate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClipCandidateUpdateArgs>(args: SelectSubset<T, ClipCandidateUpdateArgs<ExtArgs>>): Prisma__ClipCandidateClient<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClipCandidates.
     * @param {ClipCandidateDeleteManyArgs} args - Arguments to filter ClipCandidates to delete.
     * @example
     * // Delete a few ClipCandidates
     * const { count } = await prisma.clipCandidate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClipCandidateDeleteManyArgs>(args?: SelectSubset<T, ClipCandidateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClipCandidates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCandidateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClipCandidates
     * const clipCandidate = await prisma.clipCandidate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClipCandidateUpdateManyArgs>(args: SelectSubset<T, ClipCandidateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClipCandidates and returns the data updated in the database.
     * @param {ClipCandidateUpdateManyAndReturnArgs} args - Arguments to update many ClipCandidates.
     * @example
     * // Update many ClipCandidates
     * const clipCandidate = await prisma.clipCandidate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClipCandidates and only return the `id`
     * const clipCandidateWithIdOnly = await prisma.clipCandidate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClipCandidateUpdateManyAndReturnArgs>(args: SelectSubset<T, ClipCandidateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClipCandidate.
     * @param {ClipCandidateUpsertArgs} args - Arguments to update or create a ClipCandidate.
     * @example
     * // Update or create a ClipCandidate
     * const clipCandidate = await prisma.clipCandidate.upsert({
     *   create: {
     *     // ... data to create a ClipCandidate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClipCandidate we want to update
     *   }
     * })
     */
    upsert<T extends ClipCandidateUpsertArgs>(args: SelectSubset<T, ClipCandidateUpsertArgs<ExtArgs>>): Prisma__ClipCandidateClient<$Result.GetResult<Prisma.$ClipCandidatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClipCandidates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCandidateCountArgs} args - Arguments to filter ClipCandidates to count.
     * @example
     * // Count the number of ClipCandidates
     * const count = await prisma.clipCandidate.count({
     *   where: {
     *     // ... the filter for the ClipCandidates we want to count
     *   }
     * })
    **/
    count<T extends ClipCandidateCountArgs>(
      args?: Subset<T, ClipCandidateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClipCandidateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClipCandidate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCandidateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClipCandidateAggregateArgs>(args: Subset<T, ClipCandidateAggregateArgs>): Prisma.PrismaPromise<GetClipCandidateAggregateType<T>>

    /**
     * Group by ClipCandidate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCandidateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClipCandidateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClipCandidateGroupByArgs['orderBy'] }
        : { orderBy?: ClipCandidateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClipCandidateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClipCandidateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClipCandidate model
   */
  readonly fields: ClipCandidateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClipCandidate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClipCandidateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClipCandidate model
   */
  interface ClipCandidateFieldRefs {
    readonly id: FieldRef<"ClipCandidate", 'String'>
    readonly projectId: FieldRef<"ClipCandidate", 'String'>
    readonly startMs: FieldRef<"ClipCandidate", 'Int'>
    readonly endMs: FieldRef<"ClipCandidate", 'Int'>
    readonly statsJson: FieldRef<"ClipCandidate", 'String'>
    readonly createdAt: FieldRef<"ClipCandidate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClipCandidate findUnique
   */
  export type ClipCandidateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * Filter, which ClipCandidate to fetch.
     */
    where: ClipCandidateWhereUniqueInput
  }

  /**
   * ClipCandidate findUniqueOrThrow
   */
  export type ClipCandidateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * Filter, which ClipCandidate to fetch.
     */
    where: ClipCandidateWhereUniqueInput
  }

  /**
   * ClipCandidate findFirst
   */
  export type ClipCandidateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * Filter, which ClipCandidate to fetch.
     */
    where?: ClipCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipCandidates to fetch.
     */
    orderBy?: ClipCandidateOrderByWithRelationInput | ClipCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClipCandidates.
     */
    cursor?: ClipCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClipCandidates.
     */
    distinct?: ClipCandidateScalarFieldEnum | ClipCandidateScalarFieldEnum[]
  }

  /**
   * ClipCandidate findFirstOrThrow
   */
  export type ClipCandidateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * Filter, which ClipCandidate to fetch.
     */
    where?: ClipCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipCandidates to fetch.
     */
    orderBy?: ClipCandidateOrderByWithRelationInput | ClipCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClipCandidates.
     */
    cursor?: ClipCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClipCandidates.
     */
    distinct?: ClipCandidateScalarFieldEnum | ClipCandidateScalarFieldEnum[]
  }

  /**
   * ClipCandidate findMany
   */
  export type ClipCandidateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * Filter, which ClipCandidates to fetch.
     */
    where?: ClipCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipCandidates to fetch.
     */
    orderBy?: ClipCandidateOrderByWithRelationInput | ClipCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClipCandidates.
     */
    cursor?: ClipCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipCandidates.
     */
    skip?: number
    distinct?: ClipCandidateScalarFieldEnum | ClipCandidateScalarFieldEnum[]
  }

  /**
   * ClipCandidate create
   */
  export type ClipCandidateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * The data needed to create a ClipCandidate.
     */
    data: XOR<ClipCandidateCreateInput, ClipCandidateUncheckedCreateInput>
  }

  /**
   * ClipCandidate createMany
   */
  export type ClipCandidateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClipCandidates.
     */
    data: ClipCandidateCreateManyInput | ClipCandidateCreateManyInput[]
  }

  /**
   * ClipCandidate createManyAndReturn
   */
  export type ClipCandidateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * The data used to create many ClipCandidates.
     */
    data: ClipCandidateCreateManyInput | ClipCandidateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClipCandidate update
   */
  export type ClipCandidateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * The data needed to update a ClipCandidate.
     */
    data: XOR<ClipCandidateUpdateInput, ClipCandidateUncheckedUpdateInput>
    /**
     * Choose, which ClipCandidate to update.
     */
    where: ClipCandidateWhereUniqueInput
  }

  /**
   * ClipCandidate updateMany
   */
  export type ClipCandidateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClipCandidates.
     */
    data: XOR<ClipCandidateUpdateManyMutationInput, ClipCandidateUncheckedUpdateManyInput>
    /**
     * Filter which ClipCandidates to update
     */
    where?: ClipCandidateWhereInput
    /**
     * Limit how many ClipCandidates to update.
     */
    limit?: number
  }

  /**
   * ClipCandidate updateManyAndReturn
   */
  export type ClipCandidateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * The data used to update ClipCandidates.
     */
    data: XOR<ClipCandidateUpdateManyMutationInput, ClipCandidateUncheckedUpdateManyInput>
    /**
     * Filter which ClipCandidates to update
     */
    where?: ClipCandidateWhereInput
    /**
     * Limit how many ClipCandidates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClipCandidate upsert
   */
  export type ClipCandidateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * The filter to search for the ClipCandidate to update in case it exists.
     */
    where: ClipCandidateWhereUniqueInput
    /**
     * In case the ClipCandidate found by the `where` argument doesn't exist, create a new ClipCandidate with this data.
     */
    create: XOR<ClipCandidateCreateInput, ClipCandidateUncheckedCreateInput>
    /**
     * In case the ClipCandidate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClipCandidateUpdateInput, ClipCandidateUncheckedUpdateInput>
  }

  /**
   * ClipCandidate delete
   */
  export type ClipCandidateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
    /**
     * Filter which ClipCandidate to delete.
     */
    where: ClipCandidateWhereUniqueInput
  }

  /**
   * ClipCandidate deleteMany
   */
  export type ClipCandidateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClipCandidates to delete
     */
    where?: ClipCandidateWhereInput
    /**
     * Limit how many ClipCandidates to delete.
     */
    limit?: number
  }

  /**
   * ClipCandidate without action
   */
  export type ClipCandidateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClipCandidate
     */
    select?: ClipCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClipCandidate
     */
    omit?: ClipCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipCandidateInclude<ExtArgs> | null
  }


  /**
   * Model Clip
   */

  export type AggregateClip = {
    _count: ClipCountAggregateOutputType | null
    _avg: ClipAvgAggregateOutputType | null
    _sum: ClipSumAggregateOutputType | null
    _min: ClipMinAggregateOutputType | null
    _max: ClipMaxAggregateOutputType | null
  }

  export type ClipAvgAggregateOutputType = {
    startMs: number | null
    endMs: number | null
  }

  export type ClipSumAggregateOutputType = {
    startMs: number | null
    endMs: number | null
  }

  export type ClipMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    startMs: number | null
    endMs: number | null
    scores: string | null
    caption: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClipMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    startMs: number | null
    endMs: number | null
    scores: string | null
    caption: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClipCountAggregateOutputType = {
    id: number
    projectId: number
    startMs: number
    endMs: number
    scores: number
    caption: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClipAvgAggregateInputType = {
    startMs?: true
    endMs?: true
  }

  export type ClipSumAggregateInputType = {
    startMs?: true
    endMs?: true
  }

  export type ClipMinAggregateInputType = {
    id?: true
    projectId?: true
    startMs?: true
    endMs?: true
    scores?: true
    caption?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClipMaxAggregateInputType = {
    id?: true
    projectId?: true
    startMs?: true
    endMs?: true
    scores?: true
    caption?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClipCountAggregateInputType = {
    id?: true
    projectId?: true
    startMs?: true
    endMs?: true
    scores?: true
    caption?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clip to aggregate.
     */
    where?: ClipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clips
    **/
    _count?: true | ClipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClipAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClipSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClipMaxAggregateInputType
  }

  export type GetClipAggregateType<T extends ClipAggregateArgs> = {
        [P in keyof T & keyof AggregateClip]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClip[P]>
      : GetScalarType<T[P], AggregateClip[P]>
  }




  export type ClipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClipWhereInput
    orderBy?: ClipOrderByWithAggregationInput | ClipOrderByWithAggregationInput[]
    by: ClipScalarFieldEnum[] | ClipScalarFieldEnum
    having?: ClipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClipCountAggregateInputType | true
    _avg?: ClipAvgAggregateInputType
    _sum?: ClipSumAggregateInputType
    _min?: ClipMinAggregateInputType
    _max?: ClipMaxAggregateInputType
  }

  export type ClipGroupByOutputType = {
    id: string
    projectId: string
    startMs: number
    endMs: number
    scores: string
    caption: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: ClipCountAggregateOutputType | null
    _avg: ClipAvgAggregateOutputType | null
    _sum: ClipSumAggregateOutputType | null
    _min: ClipMinAggregateOutputType | null
    _max: ClipMaxAggregateOutputType | null
  }

  type GetClipGroupByPayload<T extends ClipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClipGroupByOutputType[P]>
            : GetScalarType<T[P], ClipGroupByOutputType[P]>
        }
      >
    >


  export type ClipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    startMs?: boolean
    endMs?: boolean
    scores?: boolean
    caption?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    assets?: boolean | Clip$assetsArgs<ExtArgs>
    analytics?: boolean | Clip$analyticsArgs<ExtArgs>
    _count?: boolean | ClipCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clip"]>

  export type ClipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    startMs?: boolean
    endMs?: boolean
    scores?: boolean
    caption?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clip"]>

  export type ClipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    startMs?: boolean
    endMs?: boolean
    scores?: boolean
    caption?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clip"]>

  export type ClipSelectScalar = {
    id?: boolean
    projectId?: boolean
    startMs?: boolean
    endMs?: boolean
    scores?: boolean
    caption?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "startMs" | "endMs" | "scores" | "caption" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["clip"]>
  export type ClipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    assets?: boolean | Clip$assetsArgs<ExtArgs>
    analytics?: boolean | Clip$analyticsArgs<ExtArgs>
    _count?: boolean | ClipCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ClipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ClipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Clip"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      assets: Prisma.$AssetPayload<ExtArgs>[]
      analytics: Prisma.$AnalyticsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      startMs: number
      endMs: number
      scores: string
      caption: string | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clip"]>
    composites: {}
  }

  type ClipGetPayload<S extends boolean | null | undefined | ClipDefaultArgs> = $Result.GetResult<Prisma.$ClipPayload, S>

  type ClipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClipCountAggregateInputType | true
    }

  export interface ClipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Clip'], meta: { name: 'Clip' } }
    /**
     * Find zero or one Clip that matches the filter.
     * @param {ClipFindUniqueArgs} args - Arguments to find a Clip
     * @example
     * // Get one Clip
     * const clip = await prisma.clip.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClipFindUniqueArgs>(args: SelectSubset<T, ClipFindUniqueArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Clip that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClipFindUniqueOrThrowArgs} args - Arguments to find a Clip
     * @example
     * // Get one Clip
     * const clip = await prisma.clip.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClipFindUniqueOrThrowArgs>(args: SelectSubset<T, ClipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Clip that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipFindFirstArgs} args - Arguments to find a Clip
     * @example
     * // Get one Clip
     * const clip = await prisma.clip.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClipFindFirstArgs>(args?: SelectSubset<T, ClipFindFirstArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Clip that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipFindFirstOrThrowArgs} args - Arguments to find a Clip
     * @example
     * // Get one Clip
     * const clip = await prisma.clip.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClipFindFirstOrThrowArgs>(args?: SelectSubset<T, ClipFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clips that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clips
     * const clips = await prisma.clip.findMany()
     * 
     * // Get first 10 Clips
     * const clips = await prisma.clip.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clipWithIdOnly = await prisma.clip.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClipFindManyArgs>(args?: SelectSubset<T, ClipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Clip.
     * @param {ClipCreateArgs} args - Arguments to create a Clip.
     * @example
     * // Create one Clip
     * const Clip = await prisma.clip.create({
     *   data: {
     *     // ... data to create a Clip
     *   }
     * })
     * 
     */
    create<T extends ClipCreateArgs>(args: SelectSubset<T, ClipCreateArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clips.
     * @param {ClipCreateManyArgs} args - Arguments to create many Clips.
     * @example
     * // Create many Clips
     * const clip = await prisma.clip.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClipCreateManyArgs>(args?: SelectSubset<T, ClipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clips and returns the data saved in the database.
     * @param {ClipCreateManyAndReturnArgs} args - Arguments to create many Clips.
     * @example
     * // Create many Clips
     * const clip = await prisma.clip.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clips and only return the `id`
     * const clipWithIdOnly = await prisma.clip.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClipCreateManyAndReturnArgs>(args?: SelectSubset<T, ClipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Clip.
     * @param {ClipDeleteArgs} args - Arguments to delete one Clip.
     * @example
     * // Delete one Clip
     * const Clip = await prisma.clip.delete({
     *   where: {
     *     // ... filter to delete one Clip
     *   }
     * })
     * 
     */
    delete<T extends ClipDeleteArgs>(args: SelectSubset<T, ClipDeleteArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Clip.
     * @param {ClipUpdateArgs} args - Arguments to update one Clip.
     * @example
     * // Update one Clip
     * const clip = await prisma.clip.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClipUpdateArgs>(args: SelectSubset<T, ClipUpdateArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clips.
     * @param {ClipDeleteManyArgs} args - Arguments to filter Clips to delete.
     * @example
     * // Delete a few Clips
     * const { count } = await prisma.clip.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClipDeleteManyArgs>(args?: SelectSubset<T, ClipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clips
     * const clip = await prisma.clip.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClipUpdateManyArgs>(args: SelectSubset<T, ClipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clips and returns the data updated in the database.
     * @param {ClipUpdateManyAndReturnArgs} args - Arguments to update many Clips.
     * @example
     * // Update many Clips
     * const clip = await prisma.clip.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clips and only return the `id`
     * const clipWithIdOnly = await prisma.clip.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClipUpdateManyAndReturnArgs>(args: SelectSubset<T, ClipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Clip.
     * @param {ClipUpsertArgs} args - Arguments to update or create a Clip.
     * @example
     * // Update or create a Clip
     * const clip = await prisma.clip.upsert({
     *   create: {
     *     // ... data to create a Clip
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Clip we want to update
     *   }
     * })
     */
    upsert<T extends ClipUpsertArgs>(args: SelectSubset<T, ClipUpsertArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCountArgs} args - Arguments to filter Clips to count.
     * @example
     * // Count the number of Clips
     * const count = await prisma.clip.count({
     *   where: {
     *     // ... the filter for the Clips we want to count
     *   }
     * })
    **/
    count<T extends ClipCountArgs>(
      args?: Subset<T, ClipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Clip.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClipAggregateArgs>(args: Subset<T, ClipAggregateArgs>): Prisma.PrismaPromise<GetClipAggregateType<T>>

    /**
     * Group by Clip.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClipGroupByArgs['orderBy'] }
        : { orderBy?: ClipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Clip model
   */
  readonly fields: ClipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Clip.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assets<T extends Clip$assetsArgs<ExtArgs> = {}>(args?: Subset<T, Clip$assetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analytics<T extends Clip$analyticsArgs<ExtArgs> = {}>(args?: Subset<T, Clip$analyticsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Clip model
   */
  interface ClipFieldRefs {
    readonly id: FieldRef<"Clip", 'String'>
    readonly projectId: FieldRef<"Clip", 'String'>
    readonly startMs: FieldRef<"Clip", 'Int'>
    readonly endMs: FieldRef<"Clip", 'Int'>
    readonly scores: FieldRef<"Clip", 'String'>
    readonly caption: FieldRef<"Clip", 'String'>
    readonly status: FieldRef<"Clip", 'String'>
    readonly createdAt: FieldRef<"Clip", 'DateTime'>
    readonly updatedAt: FieldRef<"Clip", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Clip findUnique
   */
  export type ClipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clip to fetch.
     */
    where: ClipWhereUniqueInput
  }

  /**
   * Clip findUniqueOrThrow
   */
  export type ClipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clip to fetch.
     */
    where: ClipWhereUniqueInput
  }

  /**
   * Clip findFirst
   */
  export type ClipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clip to fetch.
     */
    where?: ClipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clips.
     */
    cursor?: ClipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clips.
     */
    distinct?: ClipScalarFieldEnum | ClipScalarFieldEnum[]
  }

  /**
   * Clip findFirstOrThrow
   */
  export type ClipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clip to fetch.
     */
    where?: ClipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clips.
     */
    cursor?: ClipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clips.
     */
    distinct?: ClipScalarFieldEnum | ClipScalarFieldEnum[]
  }

  /**
   * Clip findMany
   */
  export type ClipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clips to fetch.
     */
    where?: ClipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clips.
     */
    cursor?: ClipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    distinct?: ClipScalarFieldEnum | ClipScalarFieldEnum[]
  }

  /**
   * Clip create
   */
  export type ClipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * The data needed to create a Clip.
     */
    data: XOR<ClipCreateInput, ClipUncheckedCreateInput>
  }

  /**
   * Clip createMany
   */
  export type ClipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clips.
     */
    data: ClipCreateManyInput | ClipCreateManyInput[]
  }

  /**
   * Clip createManyAndReturn
   */
  export type ClipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * The data used to create many Clips.
     */
    data: ClipCreateManyInput | ClipCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Clip update
   */
  export type ClipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * The data needed to update a Clip.
     */
    data: XOR<ClipUpdateInput, ClipUncheckedUpdateInput>
    /**
     * Choose, which Clip to update.
     */
    where: ClipWhereUniqueInput
  }

  /**
   * Clip updateMany
   */
  export type ClipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clips.
     */
    data: XOR<ClipUpdateManyMutationInput, ClipUncheckedUpdateManyInput>
    /**
     * Filter which Clips to update
     */
    where?: ClipWhereInput
    /**
     * Limit how many Clips to update.
     */
    limit?: number
  }

  /**
   * Clip updateManyAndReturn
   */
  export type ClipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * The data used to update Clips.
     */
    data: XOR<ClipUpdateManyMutationInput, ClipUncheckedUpdateManyInput>
    /**
     * Filter which Clips to update
     */
    where?: ClipWhereInput
    /**
     * Limit how many Clips to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Clip upsert
   */
  export type ClipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * The filter to search for the Clip to update in case it exists.
     */
    where: ClipWhereUniqueInput
    /**
     * In case the Clip found by the `where` argument doesn't exist, create a new Clip with this data.
     */
    create: XOR<ClipCreateInput, ClipUncheckedCreateInput>
    /**
     * In case the Clip was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClipUpdateInput, ClipUncheckedUpdateInput>
  }

  /**
   * Clip delete
   */
  export type ClipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter which Clip to delete.
     */
    where: ClipWhereUniqueInput
  }

  /**
   * Clip deleteMany
   */
  export type ClipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clips to delete
     */
    where?: ClipWhereInput
    /**
     * Limit how many Clips to delete.
     */
    limit?: number
  }

  /**
   * Clip.assets
   */
  export type Clip$assetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    cursor?: AssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Clip.analytics
   */
  export type Clip$analyticsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    where?: AnalyticsWhereInput
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    cursor?: AnalyticsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Clip without action
   */
  export type ClipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
  }


  /**
   * Model Asset
   */

  export type AggregateAsset = {
    _count: AssetCountAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  export type AssetMinAggregateOutputType = {
    id: string | null
    clipId: string | null
    kind: string | null
    storagePath: string | null
    createdAt: Date | null
  }

  export type AssetMaxAggregateOutputType = {
    id: string | null
    clipId: string | null
    kind: string | null
    storagePath: string | null
    createdAt: Date | null
  }

  export type AssetCountAggregateOutputType = {
    id: number
    clipId: number
    kind: number
    storagePath: number
    createdAt: number
    _all: number
  }


  export type AssetMinAggregateInputType = {
    id?: true
    clipId?: true
    kind?: true
    storagePath?: true
    createdAt?: true
  }

  export type AssetMaxAggregateInputType = {
    id?: true
    clipId?: true
    kind?: true
    storagePath?: true
    createdAt?: true
  }

  export type AssetCountAggregateInputType = {
    id?: true
    clipId?: true
    kind?: true
    storagePath?: true
    createdAt?: true
    _all?: true
  }

  export type AssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asset to aggregate.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Assets
    **/
    _count?: true | AssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetMaxAggregateInputType
  }

  export type GetAssetAggregateType<T extends AssetAggregateArgs> = {
        [P in keyof T & keyof AggregateAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsset[P]>
      : GetScalarType<T[P], AggregateAsset[P]>
  }




  export type AssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithAggregationInput | AssetOrderByWithAggregationInput[]
    by: AssetScalarFieldEnum[] | AssetScalarFieldEnum
    having?: AssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetCountAggregateInputType | true
    _min?: AssetMinAggregateInputType
    _max?: AssetMaxAggregateInputType
  }

  export type AssetGroupByOutputType = {
    id: string
    clipId: string
    kind: string
    storagePath: string
    createdAt: Date
    _count: AssetCountAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  type GetAssetGroupByPayload<T extends AssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetGroupByOutputType[P]>
            : GetScalarType<T[P], AssetGroupByOutputType[P]>
        }
      >
    >


  export type AssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clipId?: boolean
    kind?: boolean
    storagePath?: boolean
    createdAt?: boolean
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clipId?: boolean
    kind?: boolean
    storagePath?: boolean
    createdAt?: boolean
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clipId?: boolean
    kind?: boolean
    storagePath?: boolean
    createdAt?: boolean
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectScalar = {
    id?: boolean
    clipId?: boolean
    kind?: boolean
    storagePath?: boolean
    createdAt?: boolean
  }

  export type AssetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clipId" | "kind" | "storagePath" | "createdAt", ExtArgs["result"]["asset"]>
  export type AssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }
  export type AssetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }
  export type AssetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }

  export type $AssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Asset"
    objects: {
      clip: Prisma.$ClipPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clipId: string
      kind: string
      storagePath: string
      createdAt: Date
    }, ExtArgs["result"]["asset"]>
    composites: {}
  }

  type AssetGetPayload<S extends boolean | null | undefined | AssetDefaultArgs> = $Result.GetResult<Prisma.$AssetPayload, S>

  type AssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetCountAggregateInputType | true
    }

  export interface AssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asset'], meta: { name: 'Asset' } }
    /**
     * Find zero or one Asset that matches the filter.
     * @param {AssetFindUniqueArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetFindUniqueArgs>(args: SelectSubset<T, AssetFindUniqueArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Asset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetFindUniqueOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Asset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetFindFirstArgs>(args?: SelectSubset<T, AssetFindFirstArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Asset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Assets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assets
     * const assets = await prisma.asset.findMany()
     * 
     * // Get first 10 Assets
     * const assets = await prisma.asset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetWithIdOnly = await prisma.asset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetFindManyArgs>(args?: SelectSubset<T, AssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Asset.
     * @param {AssetCreateArgs} args - Arguments to create a Asset.
     * @example
     * // Create one Asset
     * const Asset = await prisma.asset.create({
     *   data: {
     *     // ... data to create a Asset
     *   }
     * })
     * 
     */
    create<T extends AssetCreateArgs>(args: SelectSubset<T, AssetCreateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Assets.
     * @param {AssetCreateManyArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetCreateManyArgs>(args?: SelectSubset<T, AssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assets and returns the data saved in the database.
     * @param {AssetCreateManyAndReturnArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Asset.
     * @param {AssetDeleteArgs} args - Arguments to delete one Asset.
     * @example
     * // Delete one Asset
     * const Asset = await prisma.asset.delete({
     *   where: {
     *     // ... filter to delete one Asset
     *   }
     * })
     * 
     */
    delete<T extends AssetDeleteArgs>(args: SelectSubset<T, AssetDeleteArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Asset.
     * @param {AssetUpdateArgs} args - Arguments to update one Asset.
     * @example
     * // Update one Asset
     * const asset = await prisma.asset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetUpdateArgs>(args: SelectSubset<T, AssetUpdateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Assets.
     * @param {AssetDeleteManyArgs} args - Arguments to filter Assets to delete.
     * @example
     * // Delete a few Assets
     * const { count } = await prisma.asset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetDeleteManyArgs>(args?: SelectSubset<T, AssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetUpdateManyArgs>(args: SelectSubset<T, AssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assets and returns the data updated in the database.
     * @param {AssetUpdateManyAndReturnArgs} args - Arguments to update many Assets.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssetUpdateManyAndReturnArgs>(args: SelectSubset<T, AssetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Asset.
     * @param {AssetUpsertArgs} args - Arguments to update or create a Asset.
     * @example
     * // Update or create a Asset
     * const asset = await prisma.asset.upsert({
     *   create: {
     *     // ... data to create a Asset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asset we want to update
     *   }
     * })
     */
    upsert<T extends AssetUpsertArgs>(args: SelectSubset<T, AssetUpsertArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCountArgs} args - Arguments to filter Assets to count.
     * @example
     * // Count the number of Assets
     * const count = await prisma.asset.count({
     *   where: {
     *     // ... the filter for the Assets we want to count
     *   }
     * })
    **/
    count<T extends AssetCountArgs>(
      args?: Subset<T, AssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetAggregateArgs>(args: Subset<T, AssetAggregateArgs>): Prisma.PrismaPromise<GetAssetAggregateType<T>>

    /**
     * Group by Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetGroupByArgs['orderBy'] }
        : { orderBy?: AssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Asset model
   */
  readonly fields: AssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clip<T extends ClipDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClipDefaultArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Asset model
   */
  interface AssetFieldRefs {
    readonly id: FieldRef<"Asset", 'String'>
    readonly clipId: FieldRef<"Asset", 'String'>
    readonly kind: FieldRef<"Asset", 'String'>
    readonly storagePath: FieldRef<"Asset", 'String'>
    readonly createdAt: FieldRef<"Asset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Asset findUnique
   */
  export type AssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findUniqueOrThrow
   */
  export type AssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findFirst
   */
  export type AssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findFirstOrThrow
   */
  export type AssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findMany
   */
  export type AssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Assets to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset create
   */
  export type AssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to create a Asset.
     */
    data: XOR<AssetCreateInput, AssetUncheckedCreateInput>
  }

  /**
   * Asset createMany
   */
  export type AssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
  }

  /**
   * Asset createManyAndReturn
   */
  export type AssetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asset update
   */
  export type AssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to update a Asset.
     */
    data: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
    /**
     * Choose, which Asset to update.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset updateMany
   */
  export type AssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to update.
     */
    limit?: number
  }

  /**
   * Asset updateManyAndReturn
   */
  export type AssetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asset upsert
   */
  export type AssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The filter to search for the Asset to update in case it exists.
     */
    where: AssetWhereUniqueInput
    /**
     * In case the Asset found by the `where` argument doesn't exist, create a new Asset with this data.
     */
    create: XOR<AssetCreateInput, AssetUncheckedCreateInput>
    /**
     * In case the Asset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
  }

  /**
   * Asset delete
   */
  export type AssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter which Asset to delete.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset deleteMany
   */
  export type AssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assets to delete
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to delete.
     */
    limit?: number
  }

  /**
   * Asset without action
   */
  export type AssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
  }


  /**
   * Model Job
   */

  export type AggregateJob = {
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  export type JobAvgAggregateOutputType = {
    attempts: number | null
  }

  export type JobSumAggregateOutputType = {
    attempts: number | null
  }

  export type JobMinAggregateOutputType = {
    id: string | null
    type: string | null
    payloadJson: string | null
    status: string | null
    attempts: number | null
    error: string | null
    nextRetryAt: Date | null
    scheduledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JobMaxAggregateOutputType = {
    id: string | null
    type: string | null
    payloadJson: string | null
    status: string | null
    attempts: number | null
    error: string | null
    nextRetryAt: Date | null
    scheduledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JobCountAggregateOutputType = {
    id: number
    type: number
    payloadJson: number
    status: number
    attempts: number
    error: number
    nextRetryAt: number
    scheduledAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JobAvgAggregateInputType = {
    attempts?: true
  }

  export type JobSumAggregateInputType = {
    attempts?: true
  }

  export type JobMinAggregateInputType = {
    id?: true
    type?: true
    payloadJson?: true
    status?: true
    attempts?: true
    error?: true
    nextRetryAt?: true
    scheduledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JobMaxAggregateInputType = {
    id?: true
    type?: true
    payloadJson?: true
    status?: true
    attempts?: true
    error?: true
    nextRetryAt?: true
    scheduledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JobCountAggregateInputType = {
    id?: true
    type?: true
    payloadJson?: true
    status?: true
    attempts?: true
    error?: true
    nextRetryAt?: true
    scheduledAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Job to aggregate.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jobs
    **/
    _count?: true | JobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobMaxAggregateInputType
  }

  export type GetJobAggregateType<T extends JobAggregateArgs> = {
        [P in keyof T & keyof AggregateJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob[P]>
      : GetScalarType<T[P], AggregateJob[P]>
  }




  export type JobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
    orderBy?: JobOrderByWithAggregationInput | JobOrderByWithAggregationInput[]
    by: JobScalarFieldEnum[] | JobScalarFieldEnum
    having?: JobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobCountAggregateInputType | true
    _avg?: JobAvgAggregateInputType
    _sum?: JobSumAggregateInputType
    _min?: JobMinAggregateInputType
    _max?: JobMaxAggregateInputType
  }

  export type JobGroupByOutputType = {
    id: string
    type: string
    payloadJson: string
    status: string
    attempts: number
    error: string | null
    nextRetryAt: Date | null
    scheduledAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  type GetJobGroupByPayload<T extends JobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobGroupByOutputType[P]>
            : GetScalarType<T[P], JobGroupByOutputType[P]>
        }
      >
    >


  export type JobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    payloadJson?: boolean
    status?: boolean
    attempts?: boolean
    error?: boolean
    nextRetryAt?: boolean
    scheduledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["job"]>

  export type JobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    payloadJson?: boolean
    status?: boolean
    attempts?: boolean
    error?: boolean
    nextRetryAt?: boolean
    scheduledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["job"]>

  export type JobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    payloadJson?: boolean
    status?: boolean
    attempts?: boolean
    error?: boolean
    nextRetryAt?: boolean
    scheduledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["job"]>

  export type JobSelectScalar = {
    id?: boolean
    type?: boolean
    payloadJson?: boolean
    status?: boolean
    attempts?: boolean
    error?: boolean
    nextRetryAt?: boolean
    scheduledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "payloadJson" | "status" | "attempts" | "error" | "nextRetryAt" | "scheduledAt" | "createdAt" | "updatedAt", ExtArgs["result"]["job"]>

  export type $JobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Job"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      payloadJson: string
      status: string
      attempts: number
      error: string | null
      nextRetryAt: Date | null
      scheduledAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["job"]>
    composites: {}
  }

  type JobGetPayload<S extends boolean | null | undefined | JobDefaultArgs> = $Result.GetResult<Prisma.$JobPayload, S>

  type JobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JobCountAggregateInputType | true
    }

  export interface JobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Job'], meta: { name: 'Job' } }
    /**
     * Find zero or one Job that matches the filter.
     * @param {JobFindUniqueArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobFindUniqueArgs>(args: SelectSubset<T, JobFindUniqueArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Job that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JobFindUniqueOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobFindUniqueOrThrowArgs>(args: SelectSubset<T, JobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobFindFirstArgs>(args?: SelectSubset<T, JobFindFirstArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobFindFirstOrThrowArgs>(args?: SelectSubset<T, JobFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jobs
     * const jobs = await prisma.job.findMany()
     * 
     * // Get first 10 Jobs
     * const jobs = await prisma.job.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobWithIdOnly = await prisma.job.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobFindManyArgs>(args?: SelectSubset<T, JobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Job.
     * @param {JobCreateArgs} args - Arguments to create a Job.
     * @example
     * // Create one Job
     * const Job = await prisma.job.create({
     *   data: {
     *     // ... data to create a Job
     *   }
     * })
     * 
     */
    create<T extends JobCreateArgs>(args: SelectSubset<T, JobCreateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jobs.
     * @param {JobCreateManyArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobCreateManyArgs>(args?: SelectSubset<T, JobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jobs and returns the data saved in the database.
     * @param {JobCreateManyAndReturnArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jobs and only return the `id`
     * const jobWithIdOnly = await prisma.job.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobCreateManyAndReturnArgs>(args?: SelectSubset<T, JobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Job.
     * @param {JobDeleteArgs} args - Arguments to delete one Job.
     * @example
     * // Delete one Job
     * const Job = await prisma.job.delete({
     *   where: {
     *     // ... filter to delete one Job
     *   }
     * })
     * 
     */
    delete<T extends JobDeleteArgs>(args: SelectSubset<T, JobDeleteArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Job.
     * @param {JobUpdateArgs} args - Arguments to update one Job.
     * @example
     * // Update one Job
     * const job = await prisma.job.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobUpdateArgs>(args: SelectSubset<T, JobUpdateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jobs.
     * @param {JobDeleteManyArgs} args - Arguments to filter Jobs to delete.
     * @example
     * // Delete a few Jobs
     * const { count } = await prisma.job.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobDeleteManyArgs>(args?: SelectSubset<T, JobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobUpdateManyArgs>(args: SelectSubset<T, JobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs and returns the data updated in the database.
     * @param {JobUpdateManyAndReturnArgs} args - Arguments to update many Jobs.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jobs and only return the `id`
     * const jobWithIdOnly = await prisma.job.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JobUpdateManyAndReturnArgs>(args: SelectSubset<T, JobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Job.
     * @param {JobUpsertArgs} args - Arguments to update or create a Job.
     * @example
     * // Update or create a Job
     * const job = await prisma.job.upsert({
     *   create: {
     *     // ... data to create a Job
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job we want to update
     *   }
     * })
     */
    upsert<T extends JobUpsertArgs>(args: SelectSubset<T, JobUpsertArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobCountArgs} args - Arguments to filter Jobs to count.
     * @example
     * // Count the number of Jobs
     * const count = await prisma.job.count({
     *   where: {
     *     // ... the filter for the Jobs we want to count
     *   }
     * })
    **/
    count<T extends JobCountArgs>(
      args?: Subset<T, JobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobAggregateArgs>(args: Subset<T, JobAggregateArgs>): Prisma.PrismaPromise<GetJobAggregateType<T>>

    /**
     * Group by Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobGroupByArgs['orderBy'] }
        : { orderBy?: JobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Job model
   */
  readonly fields: JobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Job.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Job model
   */
  interface JobFieldRefs {
    readonly id: FieldRef<"Job", 'String'>
    readonly type: FieldRef<"Job", 'String'>
    readonly payloadJson: FieldRef<"Job", 'String'>
    readonly status: FieldRef<"Job", 'String'>
    readonly attempts: FieldRef<"Job", 'Int'>
    readonly error: FieldRef<"Job", 'String'>
    readonly nextRetryAt: FieldRef<"Job", 'DateTime'>
    readonly scheduledAt: FieldRef<"Job", 'DateTime'>
    readonly createdAt: FieldRef<"Job", 'DateTime'>
    readonly updatedAt: FieldRef<"Job", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Job findUnique
   */
  export type JobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findUniqueOrThrow
   */
  export type JobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findFirst
   */
  export type JobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findFirstOrThrow
   */
  export type JobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findMany
   */
  export type JobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Filter, which Jobs to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job create
   */
  export type JobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data needed to create a Job.
     */
    data: XOR<JobCreateInput, JobUncheckedCreateInput>
  }

  /**
   * Job createMany
   */
  export type JobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
  }

  /**
   * Job createManyAndReturn
   */
  export type JobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
  }

  /**
   * Job update
   */
  export type JobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data needed to update a Job.
     */
    data: XOR<JobUpdateInput, JobUncheckedUpdateInput>
    /**
     * Choose, which Job to update.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job updateMany
   */
  export type JobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
  }

  /**
   * Job updateManyAndReturn
   */
  export type JobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
  }

  /**
   * Job upsert
   */
  export type JobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The filter to search for the Job to update in case it exists.
     */
    where: JobWhereUniqueInput
    /**
     * In case the Job found by the `where` argument doesn't exist, create a new Job with this data.
     */
    create: XOR<JobCreateInput, JobUncheckedCreateInput>
    /**
     * In case the Job was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobUpdateInput, JobUncheckedUpdateInput>
  }

  /**
   * Job delete
   */
  export type JobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Filter which Job to delete.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job deleteMany
   */
  export type JobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jobs to delete
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to delete.
     */
    limit?: number
  }

  /**
   * Job without action
   */
  export type JobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
  }


  /**
   * Model ThemePreset
   */

  export type AggregateThemePreset = {
    _count: ThemePresetCountAggregateOutputType | null
    _min: ThemePresetMinAggregateOutputType | null
    _max: ThemePresetMaxAggregateOutputType | null
  }

  export type ThemePresetMinAggregateOutputType = {
    id: string | null
    name: string | null
    fontFamily: string | null
    primaryColor: string | null
    outlineColor: string | null
    alignment: string | null
    marginV: string | null
    createdAt: Date | null
  }

  export type ThemePresetMaxAggregateOutputType = {
    id: string | null
    name: string | null
    fontFamily: string | null
    primaryColor: string | null
    outlineColor: string | null
    alignment: string | null
    marginV: string | null
    createdAt: Date | null
  }

  export type ThemePresetCountAggregateOutputType = {
    id: number
    name: number
    fontFamily: number
    primaryColor: number
    outlineColor: number
    alignment: number
    marginV: number
    createdAt: number
    _all: number
  }


  export type ThemePresetMinAggregateInputType = {
    id?: true
    name?: true
    fontFamily?: true
    primaryColor?: true
    outlineColor?: true
    alignment?: true
    marginV?: true
    createdAt?: true
  }

  export type ThemePresetMaxAggregateInputType = {
    id?: true
    name?: true
    fontFamily?: true
    primaryColor?: true
    outlineColor?: true
    alignment?: true
    marginV?: true
    createdAt?: true
  }

  export type ThemePresetCountAggregateInputType = {
    id?: true
    name?: true
    fontFamily?: true
    primaryColor?: true
    outlineColor?: true
    alignment?: true
    marginV?: true
    createdAt?: true
    _all?: true
  }

  export type ThemePresetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ThemePreset to aggregate.
     */
    where?: ThemePresetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThemePresets to fetch.
     */
    orderBy?: ThemePresetOrderByWithRelationInput | ThemePresetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ThemePresetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThemePresets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThemePresets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ThemePresets
    **/
    _count?: true | ThemePresetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ThemePresetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ThemePresetMaxAggregateInputType
  }

  export type GetThemePresetAggregateType<T extends ThemePresetAggregateArgs> = {
        [P in keyof T & keyof AggregateThemePreset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateThemePreset[P]>
      : GetScalarType<T[P], AggregateThemePreset[P]>
  }




  export type ThemePresetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThemePresetWhereInput
    orderBy?: ThemePresetOrderByWithAggregationInput | ThemePresetOrderByWithAggregationInput[]
    by: ThemePresetScalarFieldEnum[] | ThemePresetScalarFieldEnum
    having?: ThemePresetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ThemePresetCountAggregateInputType | true
    _min?: ThemePresetMinAggregateInputType
    _max?: ThemePresetMaxAggregateInputType
  }

  export type ThemePresetGroupByOutputType = {
    id: string
    name: string
    fontFamily: string
    primaryColor: string
    outlineColor: string
    alignment: string
    marginV: string
    createdAt: Date
    _count: ThemePresetCountAggregateOutputType | null
    _min: ThemePresetMinAggregateOutputType | null
    _max: ThemePresetMaxAggregateOutputType | null
  }

  type GetThemePresetGroupByPayload<T extends ThemePresetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ThemePresetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ThemePresetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ThemePresetGroupByOutputType[P]>
            : GetScalarType<T[P], ThemePresetGroupByOutputType[P]>
        }
      >
    >


  export type ThemePresetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    fontFamily?: boolean
    primaryColor?: boolean
    outlineColor?: boolean
    alignment?: boolean
    marginV?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["themePreset"]>

  export type ThemePresetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    fontFamily?: boolean
    primaryColor?: boolean
    outlineColor?: boolean
    alignment?: boolean
    marginV?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["themePreset"]>

  export type ThemePresetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    fontFamily?: boolean
    primaryColor?: boolean
    outlineColor?: boolean
    alignment?: boolean
    marginV?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["themePreset"]>

  export type ThemePresetSelectScalar = {
    id?: boolean
    name?: boolean
    fontFamily?: boolean
    primaryColor?: boolean
    outlineColor?: boolean
    alignment?: boolean
    marginV?: boolean
    createdAt?: boolean
  }

  export type ThemePresetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "fontFamily" | "primaryColor" | "outlineColor" | "alignment" | "marginV" | "createdAt", ExtArgs["result"]["themePreset"]>

  export type $ThemePresetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ThemePreset"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      fontFamily: string
      primaryColor: string
      outlineColor: string
      alignment: string
      marginV: string
      createdAt: Date
    }, ExtArgs["result"]["themePreset"]>
    composites: {}
  }

  type ThemePresetGetPayload<S extends boolean | null | undefined | ThemePresetDefaultArgs> = $Result.GetResult<Prisma.$ThemePresetPayload, S>

  type ThemePresetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ThemePresetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ThemePresetCountAggregateInputType | true
    }

  export interface ThemePresetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ThemePreset'], meta: { name: 'ThemePreset' } }
    /**
     * Find zero or one ThemePreset that matches the filter.
     * @param {ThemePresetFindUniqueArgs} args - Arguments to find a ThemePreset
     * @example
     * // Get one ThemePreset
     * const themePreset = await prisma.themePreset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ThemePresetFindUniqueArgs>(args: SelectSubset<T, ThemePresetFindUniqueArgs<ExtArgs>>): Prisma__ThemePresetClient<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ThemePreset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ThemePresetFindUniqueOrThrowArgs} args - Arguments to find a ThemePreset
     * @example
     * // Get one ThemePreset
     * const themePreset = await prisma.themePreset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ThemePresetFindUniqueOrThrowArgs>(args: SelectSubset<T, ThemePresetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ThemePresetClient<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ThemePreset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemePresetFindFirstArgs} args - Arguments to find a ThemePreset
     * @example
     * // Get one ThemePreset
     * const themePreset = await prisma.themePreset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ThemePresetFindFirstArgs>(args?: SelectSubset<T, ThemePresetFindFirstArgs<ExtArgs>>): Prisma__ThemePresetClient<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ThemePreset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemePresetFindFirstOrThrowArgs} args - Arguments to find a ThemePreset
     * @example
     * // Get one ThemePreset
     * const themePreset = await prisma.themePreset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ThemePresetFindFirstOrThrowArgs>(args?: SelectSubset<T, ThemePresetFindFirstOrThrowArgs<ExtArgs>>): Prisma__ThemePresetClient<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ThemePresets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemePresetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ThemePresets
     * const themePresets = await prisma.themePreset.findMany()
     * 
     * // Get first 10 ThemePresets
     * const themePresets = await prisma.themePreset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const themePresetWithIdOnly = await prisma.themePreset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ThemePresetFindManyArgs>(args?: SelectSubset<T, ThemePresetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ThemePreset.
     * @param {ThemePresetCreateArgs} args - Arguments to create a ThemePreset.
     * @example
     * // Create one ThemePreset
     * const ThemePreset = await prisma.themePreset.create({
     *   data: {
     *     // ... data to create a ThemePreset
     *   }
     * })
     * 
     */
    create<T extends ThemePresetCreateArgs>(args: SelectSubset<T, ThemePresetCreateArgs<ExtArgs>>): Prisma__ThemePresetClient<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ThemePresets.
     * @param {ThemePresetCreateManyArgs} args - Arguments to create many ThemePresets.
     * @example
     * // Create many ThemePresets
     * const themePreset = await prisma.themePreset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ThemePresetCreateManyArgs>(args?: SelectSubset<T, ThemePresetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ThemePresets and returns the data saved in the database.
     * @param {ThemePresetCreateManyAndReturnArgs} args - Arguments to create many ThemePresets.
     * @example
     * // Create many ThemePresets
     * const themePreset = await prisma.themePreset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ThemePresets and only return the `id`
     * const themePresetWithIdOnly = await prisma.themePreset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ThemePresetCreateManyAndReturnArgs>(args?: SelectSubset<T, ThemePresetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ThemePreset.
     * @param {ThemePresetDeleteArgs} args - Arguments to delete one ThemePreset.
     * @example
     * // Delete one ThemePreset
     * const ThemePreset = await prisma.themePreset.delete({
     *   where: {
     *     // ... filter to delete one ThemePreset
     *   }
     * })
     * 
     */
    delete<T extends ThemePresetDeleteArgs>(args: SelectSubset<T, ThemePresetDeleteArgs<ExtArgs>>): Prisma__ThemePresetClient<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ThemePreset.
     * @param {ThemePresetUpdateArgs} args - Arguments to update one ThemePreset.
     * @example
     * // Update one ThemePreset
     * const themePreset = await prisma.themePreset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ThemePresetUpdateArgs>(args: SelectSubset<T, ThemePresetUpdateArgs<ExtArgs>>): Prisma__ThemePresetClient<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ThemePresets.
     * @param {ThemePresetDeleteManyArgs} args - Arguments to filter ThemePresets to delete.
     * @example
     * // Delete a few ThemePresets
     * const { count } = await prisma.themePreset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ThemePresetDeleteManyArgs>(args?: SelectSubset<T, ThemePresetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ThemePresets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemePresetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ThemePresets
     * const themePreset = await prisma.themePreset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ThemePresetUpdateManyArgs>(args: SelectSubset<T, ThemePresetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ThemePresets and returns the data updated in the database.
     * @param {ThemePresetUpdateManyAndReturnArgs} args - Arguments to update many ThemePresets.
     * @example
     * // Update many ThemePresets
     * const themePreset = await prisma.themePreset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ThemePresets and only return the `id`
     * const themePresetWithIdOnly = await prisma.themePreset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ThemePresetUpdateManyAndReturnArgs>(args: SelectSubset<T, ThemePresetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ThemePreset.
     * @param {ThemePresetUpsertArgs} args - Arguments to update or create a ThemePreset.
     * @example
     * // Update or create a ThemePreset
     * const themePreset = await prisma.themePreset.upsert({
     *   create: {
     *     // ... data to create a ThemePreset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ThemePreset we want to update
     *   }
     * })
     */
    upsert<T extends ThemePresetUpsertArgs>(args: SelectSubset<T, ThemePresetUpsertArgs<ExtArgs>>): Prisma__ThemePresetClient<$Result.GetResult<Prisma.$ThemePresetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ThemePresets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemePresetCountArgs} args - Arguments to filter ThemePresets to count.
     * @example
     * // Count the number of ThemePresets
     * const count = await prisma.themePreset.count({
     *   where: {
     *     // ... the filter for the ThemePresets we want to count
     *   }
     * })
    **/
    count<T extends ThemePresetCountArgs>(
      args?: Subset<T, ThemePresetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThemePresetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ThemePreset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemePresetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThemePresetAggregateArgs>(args: Subset<T, ThemePresetAggregateArgs>): Prisma.PrismaPromise<GetThemePresetAggregateType<T>>

    /**
     * Group by ThemePreset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemePresetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ThemePresetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ThemePresetGroupByArgs['orderBy'] }
        : { orderBy?: ThemePresetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ThemePresetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThemePresetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ThemePreset model
   */
  readonly fields: ThemePresetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ThemePreset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ThemePresetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ThemePreset model
   */
  interface ThemePresetFieldRefs {
    readonly id: FieldRef<"ThemePreset", 'String'>
    readonly name: FieldRef<"ThemePreset", 'String'>
    readonly fontFamily: FieldRef<"ThemePreset", 'String'>
    readonly primaryColor: FieldRef<"ThemePreset", 'String'>
    readonly outlineColor: FieldRef<"ThemePreset", 'String'>
    readonly alignment: FieldRef<"ThemePreset", 'String'>
    readonly marginV: FieldRef<"ThemePreset", 'String'>
    readonly createdAt: FieldRef<"ThemePreset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ThemePreset findUnique
   */
  export type ThemePresetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * Filter, which ThemePreset to fetch.
     */
    where: ThemePresetWhereUniqueInput
  }

  /**
   * ThemePreset findUniqueOrThrow
   */
  export type ThemePresetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * Filter, which ThemePreset to fetch.
     */
    where: ThemePresetWhereUniqueInput
  }

  /**
   * ThemePreset findFirst
   */
  export type ThemePresetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * Filter, which ThemePreset to fetch.
     */
    where?: ThemePresetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThemePresets to fetch.
     */
    orderBy?: ThemePresetOrderByWithRelationInput | ThemePresetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ThemePresets.
     */
    cursor?: ThemePresetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThemePresets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThemePresets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ThemePresets.
     */
    distinct?: ThemePresetScalarFieldEnum | ThemePresetScalarFieldEnum[]
  }

  /**
   * ThemePreset findFirstOrThrow
   */
  export type ThemePresetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * Filter, which ThemePreset to fetch.
     */
    where?: ThemePresetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThemePresets to fetch.
     */
    orderBy?: ThemePresetOrderByWithRelationInput | ThemePresetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ThemePresets.
     */
    cursor?: ThemePresetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThemePresets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThemePresets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ThemePresets.
     */
    distinct?: ThemePresetScalarFieldEnum | ThemePresetScalarFieldEnum[]
  }

  /**
   * ThemePreset findMany
   */
  export type ThemePresetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * Filter, which ThemePresets to fetch.
     */
    where?: ThemePresetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThemePresets to fetch.
     */
    orderBy?: ThemePresetOrderByWithRelationInput | ThemePresetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ThemePresets.
     */
    cursor?: ThemePresetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThemePresets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThemePresets.
     */
    skip?: number
    distinct?: ThemePresetScalarFieldEnum | ThemePresetScalarFieldEnum[]
  }

  /**
   * ThemePreset create
   */
  export type ThemePresetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * The data needed to create a ThemePreset.
     */
    data: XOR<ThemePresetCreateInput, ThemePresetUncheckedCreateInput>
  }

  /**
   * ThemePreset createMany
   */
  export type ThemePresetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ThemePresets.
     */
    data: ThemePresetCreateManyInput | ThemePresetCreateManyInput[]
  }

  /**
   * ThemePreset createManyAndReturn
   */
  export type ThemePresetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * The data used to create many ThemePresets.
     */
    data: ThemePresetCreateManyInput | ThemePresetCreateManyInput[]
  }

  /**
   * ThemePreset update
   */
  export type ThemePresetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * The data needed to update a ThemePreset.
     */
    data: XOR<ThemePresetUpdateInput, ThemePresetUncheckedUpdateInput>
    /**
     * Choose, which ThemePreset to update.
     */
    where: ThemePresetWhereUniqueInput
  }

  /**
   * ThemePreset updateMany
   */
  export type ThemePresetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ThemePresets.
     */
    data: XOR<ThemePresetUpdateManyMutationInput, ThemePresetUncheckedUpdateManyInput>
    /**
     * Filter which ThemePresets to update
     */
    where?: ThemePresetWhereInput
    /**
     * Limit how many ThemePresets to update.
     */
    limit?: number
  }

  /**
   * ThemePreset updateManyAndReturn
   */
  export type ThemePresetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * The data used to update ThemePresets.
     */
    data: XOR<ThemePresetUpdateManyMutationInput, ThemePresetUncheckedUpdateManyInput>
    /**
     * Filter which ThemePresets to update
     */
    where?: ThemePresetWhereInput
    /**
     * Limit how many ThemePresets to update.
     */
    limit?: number
  }

  /**
   * ThemePreset upsert
   */
  export type ThemePresetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * The filter to search for the ThemePreset to update in case it exists.
     */
    where: ThemePresetWhereUniqueInput
    /**
     * In case the ThemePreset found by the `where` argument doesn't exist, create a new ThemePreset with this data.
     */
    create: XOR<ThemePresetCreateInput, ThemePresetUncheckedCreateInput>
    /**
     * In case the ThemePreset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ThemePresetUpdateInput, ThemePresetUncheckedUpdateInput>
  }

  /**
   * ThemePreset delete
   */
  export type ThemePresetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
    /**
     * Filter which ThemePreset to delete.
     */
    where: ThemePresetWhereUniqueInput
  }

  /**
   * ThemePreset deleteMany
   */
  export type ThemePresetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ThemePresets to delete
     */
    where?: ThemePresetWhereInput
    /**
     * Limit how many ThemePresets to delete.
     */
    limit?: number
  }

  /**
   * ThemePreset without action
   */
  export type ThemePresetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemePreset
     */
    select?: ThemePresetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThemePreset
     */
    omit?: ThemePresetOmit<ExtArgs> | null
  }


  /**
   * Model Analytics
   */

  export type AggregateAnalytics = {
    _count: AnalyticsCountAggregateOutputType | null
    _avg: AnalyticsAvgAggregateOutputType | null
    _sum: AnalyticsSumAggregateOutputType | null
    _min: AnalyticsMinAggregateOutputType | null
    _max: AnalyticsMaxAggregateOutputType | null
  }

  export type AnalyticsAvgAggregateOutputType = {
    views: number | null
    likes: number | null
    comments: number | null
    shares: number | null
  }

  export type AnalyticsSumAggregateOutputType = {
    views: number | null
    likes: number | null
    comments: number | null
    shares: number | null
  }

  export type AnalyticsMinAggregateOutputType = {
    id: string | null
    clipId: string | null
    platform: string | null
    views: number | null
    likes: number | null
    comments: number | null
    shares: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnalyticsMaxAggregateOutputType = {
    id: string | null
    clipId: string | null
    platform: string | null
    views: number | null
    likes: number | null
    comments: number | null
    shares: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnalyticsCountAggregateOutputType = {
    id: number
    clipId: number
    platform: number
    views: number
    likes: number
    comments: number
    shares: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AnalyticsAvgAggregateInputType = {
    views?: true
    likes?: true
    comments?: true
    shares?: true
  }

  export type AnalyticsSumAggregateInputType = {
    views?: true
    likes?: true
    comments?: true
    shares?: true
  }

  export type AnalyticsMinAggregateInputType = {
    id?: true
    clipId?: true
    platform?: true
    views?: true
    likes?: true
    comments?: true
    shares?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnalyticsMaxAggregateInputType = {
    id?: true
    clipId?: true
    platform?: true
    views?: true
    likes?: true
    comments?: true
    shares?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnalyticsCountAggregateInputType = {
    id?: true
    clipId?: true
    platform?: true
    views?: true
    likes?: true
    comments?: true
    shares?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analytics to aggregate.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Analytics
    **/
    _count?: true | AnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalyticsMaxAggregateInputType
  }

  export type GetAnalyticsAggregateType<T extends AnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalytics[P]>
      : GetScalarType<T[P], AggregateAnalytics[P]>
  }




  export type AnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsWhereInput
    orderBy?: AnalyticsOrderByWithAggregationInput | AnalyticsOrderByWithAggregationInput[]
    by: AnalyticsScalarFieldEnum[] | AnalyticsScalarFieldEnum
    having?: AnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalyticsCountAggregateInputType | true
    _avg?: AnalyticsAvgAggregateInputType
    _sum?: AnalyticsSumAggregateInputType
    _min?: AnalyticsMinAggregateInputType
    _max?: AnalyticsMaxAggregateInputType
  }

  export type AnalyticsGroupByOutputType = {
    id: string
    clipId: string
    platform: string
    views: number
    likes: number
    comments: number
    shares: number
    createdAt: Date
    updatedAt: Date
    _count: AnalyticsCountAggregateOutputType | null
    _avg: AnalyticsAvgAggregateOutputType | null
    _sum: AnalyticsSumAggregateOutputType | null
    _min: AnalyticsMinAggregateOutputType | null
    _max: AnalyticsMaxAggregateOutputType | null
  }

  type GetAnalyticsGroupByPayload<T extends AnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], AnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type AnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clipId?: boolean
    platform?: boolean
    views?: boolean
    likes?: boolean
    comments?: boolean
    shares?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analytics"]>

  export type AnalyticsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clipId?: boolean
    platform?: boolean
    views?: boolean
    likes?: boolean
    comments?: boolean
    shares?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analytics"]>

  export type AnalyticsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clipId?: boolean
    platform?: boolean
    views?: boolean
    likes?: boolean
    comments?: boolean
    shares?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analytics"]>

  export type AnalyticsSelectScalar = {
    id?: boolean
    clipId?: boolean
    platform?: boolean
    views?: boolean
    likes?: boolean
    comments?: boolean
    shares?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clipId" | "platform" | "views" | "likes" | "comments" | "shares" | "createdAt" | "updatedAt", ExtArgs["result"]["analytics"]>
  export type AnalyticsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }
  export type AnalyticsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }
  export type AnalyticsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clip?: boolean | ClipDefaultArgs<ExtArgs>
  }

  export type $AnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Analytics"
    objects: {
      clip: Prisma.$ClipPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clipId: string
      platform: string
      views: number
      likes: number
      comments: number
      shares: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["analytics"]>
    composites: {}
  }

  type AnalyticsGetPayload<S extends boolean | null | undefined | AnalyticsDefaultArgs> = $Result.GetResult<Prisma.$AnalyticsPayload, S>

  type AnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalyticsCountAggregateInputType | true
    }

  export interface AnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Analytics'], meta: { name: 'Analytics' } }
    /**
     * Find zero or one Analytics that matches the filter.
     * @param {AnalyticsFindUniqueArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalyticsFindUniqueArgs>(args: SelectSubset<T, AnalyticsFindUniqueArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Analytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalyticsFindUniqueOrThrowArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindFirstArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalyticsFindFirstArgs>(args?: SelectSubset<T, AnalyticsFindFirstArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindFirstOrThrowArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Analytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Analytics
     * const analytics = await prisma.analytics.findMany()
     * 
     * // Get first 10 Analytics
     * const analytics = await prisma.analytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analyticsWithIdOnly = await prisma.analytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalyticsFindManyArgs>(args?: SelectSubset<T, AnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Analytics.
     * @param {AnalyticsCreateArgs} args - Arguments to create a Analytics.
     * @example
     * // Create one Analytics
     * const Analytics = await prisma.analytics.create({
     *   data: {
     *     // ... data to create a Analytics
     *   }
     * })
     * 
     */
    create<T extends AnalyticsCreateArgs>(args: SelectSubset<T, AnalyticsCreateArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Analytics.
     * @param {AnalyticsCreateManyArgs} args - Arguments to create many Analytics.
     * @example
     * // Create many Analytics
     * const analytics = await prisma.analytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalyticsCreateManyArgs>(args?: SelectSubset<T, AnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Analytics and returns the data saved in the database.
     * @param {AnalyticsCreateManyAndReturnArgs} args - Arguments to create many Analytics.
     * @example
     * // Create many Analytics
     * const analytics = await prisma.analytics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Analytics and only return the `id`
     * const analyticsWithIdOnly = await prisma.analytics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalyticsCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalyticsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Analytics.
     * @param {AnalyticsDeleteArgs} args - Arguments to delete one Analytics.
     * @example
     * // Delete one Analytics
     * const Analytics = await prisma.analytics.delete({
     *   where: {
     *     // ... filter to delete one Analytics
     *   }
     * })
     * 
     */
    delete<T extends AnalyticsDeleteArgs>(args: SelectSubset<T, AnalyticsDeleteArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Analytics.
     * @param {AnalyticsUpdateArgs} args - Arguments to update one Analytics.
     * @example
     * // Update one Analytics
     * const analytics = await prisma.analytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalyticsUpdateArgs>(args: SelectSubset<T, AnalyticsUpdateArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Analytics.
     * @param {AnalyticsDeleteManyArgs} args - Arguments to filter Analytics to delete.
     * @example
     * // Delete a few Analytics
     * const { count } = await prisma.analytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalyticsDeleteManyArgs>(args?: SelectSubset<T, AnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Analytics
     * const analytics = await prisma.analytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalyticsUpdateManyArgs>(args: SelectSubset<T, AnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analytics and returns the data updated in the database.
     * @param {AnalyticsUpdateManyAndReturnArgs} args - Arguments to update many Analytics.
     * @example
     * // Update many Analytics
     * const analytics = await prisma.analytics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Analytics and only return the `id`
     * const analyticsWithIdOnly = await prisma.analytics.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalyticsUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalyticsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Analytics.
     * @param {AnalyticsUpsertArgs} args - Arguments to update or create a Analytics.
     * @example
     * // Update or create a Analytics
     * const analytics = await prisma.analytics.upsert({
     *   create: {
     *     // ... data to create a Analytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Analytics we want to update
     *   }
     * })
     */
    upsert<T extends AnalyticsUpsertArgs>(args: SelectSubset<T, AnalyticsUpsertArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsCountArgs} args - Arguments to filter Analytics to count.
     * @example
     * // Count the number of Analytics
     * const count = await prisma.analytics.count({
     *   where: {
     *     // ... the filter for the Analytics we want to count
     *   }
     * })
    **/
    count<T extends AnalyticsCountArgs>(
      args?: Subset<T, AnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalyticsAggregateArgs>(args: Subset<T, AnalyticsAggregateArgs>): Prisma.PrismaPromise<GetAnalyticsAggregateType<T>>

    /**
     * Group by Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: AnalyticsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Analytics model
   */
  readonly fields: AnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Analytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clip<T extends ClipDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClipDefaultArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Analytics model
   */
  interface AnalyticsFieldRefs {
    readonly id: FieldRef<"Analytics", 'String'>
    readonly clipId: FieldRef<"Analytics", 'String'>
    readonly platform: FieldRef<"Analytics", 'String'>
    readonly views: FieldRef<"Analytics", 'Int'>
    readonly likes: FieldRef<"Analytics", 'Int'>
    readonly comments: FieldRef<"Analytics", 'Int'>
    readonly shares: FieldRef<"Analytics", 'Int'>
    readonly createdAt: FieldRef<"Analytics", 'DateTime'>
    readonly updatedAt: FieldRef<"Analytics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Analytics findUnique
   */
  export type AnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics findUniqueOrThrow
   */
  export type AnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics findFirst
   */
  export type AnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analytics.
     */
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics findFirstOrThrow
   */
  export type AnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analytics.
     */
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics findMany
   */
  export type AnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics create
   */
  export type AnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * The data needed to create a Analytics.
     */
    data: XOR<AnalyticsCreateInput, AnalyticsUncheckedCreateInput>
  }

  /**
   * Analytics createMany
   */
  export type AnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Analytics.
     */
    data: AnalyticsCreateManyInput | AnalyticsCreateManyInput[]
  }

  /**
   * Analytics createManyAndReturn
   */
  export type AnalyticsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * The data used to create many Analytics.
     */
    data: AnalyticsCreateManyInput | AnalyticsCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Analytics update
   */
  export type AnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * The data needed to update a Analytics.
     */
    data: XOR<AnalyticsUpdateInput, AnalyticsUncheckedUpdateInput>
    /**
     * Choose, which Analytics to update.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics updateMany
   */
  export type AnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Analytics.
     */
    data: XOR<AnalyticsUpdateManyMutationInput, AnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which Analytics to update
     */
    where?: AnalyticsWhereInput
    /**
     * Limit how many Analytics to update.
     */
    limit?: number
  }

  /**
   * Analytics updateManyAndReturn
   */
  export type AnalyticsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * The data used to update Analytics.
     */
    data: XOR<AnalyticsUpdateManyMutationInput, AnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which Analytics to update
     */
    where?: AnalyticsWhereInput
    /**
     * Limit how many Analytics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Analytics upsert
   */
  export type AnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * The filter to search for the Analytics to update in case it exists.
     */
    where: AnalyticsWhereUniqueInput
    /**
     * In case the Analytics found by the `where` argument doesn't exist, create a new Analytics with this data.
     */
    create: XOR<AnalyticsCreateInput, AnalyticsUncheckedCreateInput>
    /**
     * In case the Analytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalyticsUpdateInput, AnalyticsUncheckedUpdateInput>
  }

  /**
   * Analytics delete
   */
  export type AnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
    /**
     * Filter which Analytics to delete.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics deleteMany
   */
  export type AnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analytics to delete
     */
    where?: AnalyticsWhereInput
    /**
     * Limit how many Analytics to delete.
     */
    limit?: number
  }

  /**
   * Analytics without action
   */
  export type AnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsInclude<ExtArgs> | null
  }


  /**
   * Model Settings
   */

  export type AggregateSettings = {
    _count: SettingsCountAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  export type SettingsMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
  }

  export type SettingsMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
  }

  export type SettingsCountAggregateOutputType = {
    id: number
    key: number
    value: number
    _all: number
  }


  export type SettingsMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
  }

  export type SettingsMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
  }

  export type SettingsCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    _all?: true
  }

  export type SettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to aggregate.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingsMaxAggregateInputType
  }

  export type GetSettingsAggregateType<T extends SettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSettings[P]>
      : GetScalarType<T[P], AggregateSettings[P]>
  }




  export type SettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingsWhereInput
    orderBy?: SettingsOrderByWithAggregationInput | SettingsOrderByWithAggregationInput[]
    by: SettingsScalarFieldEnum[] | SettingsScalarFieldEnum
    having?: SettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingsCountAggregateInputType | true
    _min?: SettingsMinAggregateInputType
    _max?: SettingsMaxAggregateInputType
  }

  export type SettingsGroupByOutputType = {
    id: string
    key: string
    value: string
    _count: SettingsCountAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  type GetSettingsGroupByPayload<T extends SettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingsGroupByOutputType[P]>
            : GetScalarType<T[P], SettingsGroupByOutputType[P]>
        }
      >
    >


  export type SettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
  }

  export type SettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value", ExtArgs["result"]["settings"]>

  export type $SettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Settings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
    }, ExtArgs["result"]["settings"]>
    composites: {}
  }

  type SettingsGetPayload<S extends boolean | null | undefined | SettingsDefaultArgs> = $Result.GetResult<Prisma.$SettingsPayload, S>

  type SettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SettingsCountAggregateInputType | true
    }

  export interface SettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Settings'], meta: { name: 'Settings' } }
    /**
     * Find zero or one Settings that matches the filter.
     * @param {SettingsFindUniqueArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingsFindUniqueArgs>(args: SelectSubset<T, SettingsFindUniqueArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Settings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettingsFindUniqueOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingsFindFirstArgs>(args?: SelectSubset<T, SettingsFindFirstArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Settings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.settings.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.settings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingsWithIdOnly = await prisma.settings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingsFindManyArgs>(args?: SelectSubset<T, SettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Settings.
     * @param {SettingsCreateArgs} args - Arguments to create a Settings.
     * @example
     * // Create one Settings
     * const Settings = await prisma.settings.create({
     *   data: {
     *     // ... data to create a Settings
     *   }
     * })
     * 
     */
    create<T extends SettingsCreateArgs>(args: SelectSubset<T, SettingsCreateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Settings.
     * @param {SettingsCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingsCreateManyArgs>(args?: SelectSubset<T, SettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingsCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `id`
     * const settingsWithIdOnly = await prisma.settings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Settings.
     * @param {SettingsDeleteArgs} args - Arguments to delete one Settings.
     * @example
     * // Delete one Settings
     * const Settings = await prisma.settings.delete({
     *   where: {
     *     // ... filter to delete one Settings
     *   }
     * })
     * 
     */
    delete<T extends SettingsDeleteArgs>(args: SelectSubset<T, SettingsDeleteArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Settings.
     * @param {SettingsUpdateArgs} args - Arguments to update one Settings.
     * @example
     * // Update one Settings
     * const settings = await prisma.settings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingsUpdateArgs>(args: SelectSubset<T, SettingsUpdateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Settings.
     * @param {SettingsDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.settings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingsDeleteManyArgs>(args?: SelectSubset<T, SettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const settings = await prisma.settings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingsUpdateManyArgs>(args: SelectSubset<T, SettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings and returns the data updated in the database.
     * @param {SettingsUpdateManyAndReturnArgs} args - Arguments to update many Settings.
     * @example
     * // Update many Settings
     * const settings = await prisma.settings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Settings and only return the `id`
     * const settingsWithIdOnly = await prisma.settings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, SettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Settings.
     * @param {SettingsUpsertArgs} args - Arguments to update or create a Settings.
     * @example
     * // Update or create a Settings
     * const settings = await prisma.settings.upsert({
     *   create: {
     *     // ... data to create a Settings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Settings we want to update
     *   }
     * })
     */
    upsert<T extends SettingsUpsertArgs>(args: SelectSubset<T, SettingsUpsertArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.settings.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingsCountArgs>(
      args?: Subset<T, SettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SettingsAggregateArgs>(args: Subset<T, SettingsAggregateArgs>): Prisma.PrismaPromise<GetSettingsAggregateType<T>>

    /**
     * Group by Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingsGroupByArgs['orderBy'] }
        : { orderBy?: SettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Settings model
   */
  readonly fields: SettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Settings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Settings model
   */
  interface SettingsFieldRefs {
    readonly id: FieldRef<"Settings", 'String'>
    readonly key: FieldRef<"Settings", 'String'>
    readonly value: FieldRef<"Settings", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Settings findUnique
   */
  export type SettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findUniqueOrThrow
   */
  export type SettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findFirst
   */
  export type SettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findFirstOrThrow
   */
  export type SettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findMany
   */
  export type SettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings create
   */
  export type SettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a Settings.
     */
    data: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
  }

  /**
   * Settings createMany
   */
  export type SettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
  }

  /**
   * Settings createManyAndReturn
   */
  export type SettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
  }

  /**
   * Settings update
   */
  export type SettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a Settings.
     */
    data: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
    /**
     * Choose, which Settings to update.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings updateMany
   */
  export type SettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingsUpdateManyMutationInput, SettingsUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingsWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Settings updateManyAndReturn
   */
  export type SettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingsUpdateManyMutationInput, SettingsUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingsWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Settings upsert
   */
  export type SettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the Settings to update in case it exists.
     */
    where: SettingsWhereUniqueInput
    /**
     * In case the Settings found by the `where` argument doesn't exist, create a new Settings with this data.
     */
    create: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
    /**
     * In case the Settings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
  }

  /**
   * Settings delete
   */
  export type SettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Filter which Settings to delete.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings deleteMany
   */
  export type SettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingsWhereInput
    /**
     * Limit how many Settings to delete.
     */
    limit?: number
  }

  /**
   * Settings without action
   */
  export type SettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
  }


  /**
   * Model AutopilotConfig
   */

  export type AggregateAutopilotConfig = {
    _count: AutopilotConfigCountAggregateOutputType | null
    _avg: AutopilotConfigAvgAggregateOutputType | null
    _sum: AutopilotConfigSumAggregateOutputType | null
    _min: AutopilotConfigMinAggregateOutputType | null
    _max: AutopilotConfigMaxAggregateOutputType | null
  }

  export type AutopilotConfigAvgAggregateOutputType = {
    maxDailyDownloads: number | null
  }

  export type AutopilotConfigSumAggregateOutputType = {
    maxDailyDownloads: number | null
  }

  export type AutopilotConfigMinAggregateOutputType = {
    id: string | null
    keywords: string | null
    targetPlatform: string | null
    maxDailyDownloads: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AutopilotConfigMaxAggregateOutputType = {
    id: string | null
    keywords: string | null
    targetPlatform: string | null
    maxDailyDownloads: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AutopilotConfigCountAggregateOutputType = {
    id: number
    keywords: number
    targetPlatform: number
    maxDailyDownloads: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AutopilotConfigAvgAggregateInputType = {
    maxDailyDownloads?: true
  }

  export type AutopilotConfigSumAggregateInputType = {
    maxDailyDownloads?: true
  }

  export type AutopilotConfigMinAggregateInputType = {
    id?: true
    keywords?: true
    targetPlatform?: true
    maxDailyDownloads?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AutopilotConfigMaxAggregateInputType = {
    id?: true
    keywords?: true
    targetPlatform?: true
    maxDailyDownloads?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AutopilotConfigCountAggregateInputType = {
    id?: true
    keywords?: true
    targetPlatform?: true
    maxDailyDownloads?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AutopilotConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AutopilotConfig to aggregate.
     */
    where?: AutopilotConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutopilotConfigs to fetch.
     */
    orderBy?: AutopilotConfigOrderByWithRelationInput | AutopilotConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AutopilotConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutopilotConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutopilotConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AutopilotConfigs
    **/
    _count?: true | AutopilotConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AutopilotConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AutopilotConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AutopilotConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AutopilotConfigMaxAggregateInputType
  }

  export type GetAutopilotConfigAggregateType<T extends AutopilotConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateAutopilotConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAutopilotConfig[P]>
      : GetScalarType<T[P], AggregateAutopilotConfig[P]>
  }




  export type AutopilotConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AutopilotConfigWhereInput
    orderBy?: AutopilotConfigOrderByWithAggregationInput | AutopilotConfigOrderByWithAggregationInput[]
    by: AutopilotConfigScalarFieldEnum[] | AutopilotConfigScalarFieldEnum
    having?: AutopilotConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AutopilotConfigCountAggregateInputType | true
    _avg?: AutopilotConfigAvgAggregateInputType
    _sum?: AutopilotConfigSumAggregateInputType
    _min?: AutopilotConfigMinAggregateInputType
    _max?: AutopilotConfigMaxAggregateInputType
  }

  export type AutopilotConfigGroupByOutputType = {
    id: string
    keywords: string
    targetPlatform: string
    maxDailyDownloads: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: AutopilotConfigCountAggregateOutputType | null
    _avg: AutopilotConfigAvgAggregateOutputType | null
    _sum: AutopilotConfigSumAggregateOutputType | null
    _min: AutopilotConfigMinAggregateOutputType | null
    _max: AutopilotConfigMaxAggregateOutputType | null
  }

  type GetAutopilotConfigGroupByPayload<T extends AutopilotConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AutopilotConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AutopilotConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AutopilotConfigGroupByOutputType[P]>
            : GetScalarType<T[P], AutopilotConfigGroupByOutputType[P]>
        }
      >
    >


  export type AutopilotConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keywords?: boolean
    targetPlatform?: boolean
    maxDailyDownloads?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["autopilotConfig"]>

  export type AutopilotConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keywords?: boolean
    targetPlatform?: boolean
    maxDailyDownloads?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["autopilotConfig"]>

  export type AutopilotConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keywords?: boolean
    targetPlatform?: boolean
    maxDailyDownloads?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["autopilotConfig"]>

  export type AutopilotConfigSelectScalar = {
    id?: boolean
    keywords?: boolean
    targetPlatform?: boolean
    maxDailyDownloads?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AutopilotConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "keywords" | "targetPlatform" | "maxDailyDownloads" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["autopilotConfig"]>

  export type $AutopilotConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AutopilotConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      keywords: string
      targetPlatform: string
      maxDailyDownloads: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["autopilotConfig"]>
    composites: {}
  }

  type AutopilotConfigGetPayload<S extends boolean | null | undefined | AutopilotConfigDefaultArgs> = $Result.GetResult<Prisma.$AutopilotConfigPayload, S>

  type AutopilotConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AutopilotConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AutopilotConfigCountAggregateInputType | true
    }

  export interface AutopilotConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AutopilotConfig'], meta: { name: 'AutopilotConfig' } }
    /**
     * Find zero or one AutopilotConfig that matches the filter.
     * @param {AutopilotConfigFindUniqueArgs} args - Arguments to find a AutopilotConfig
     * @example
     * // Get one AutopilotConfig
     * const autopilotConfig = await prisma.autopilotConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AutopilotConfigFindUniqueArgs>(args: SelectSubset<T, AutopilotConfigFindUniqueArgs<ExtArgs>>): Prisma__AutopilotConfigClient<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AutopilotConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AutopilotConfigFindUniqueOrThrowArgs} args - Arguments to find a AutopilotConfig
     * @example
     * // Get one AutopilotConfig
     * const autopilotConfig = await prisma.autopilotConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AutopilotConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, AutopilotConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AutopilotConfigClient<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AutopilotConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotConfigFindFirstArgs} args - Arguments to find a AutopilotConfig
     * @example
     * // Get one AutopilotConfig
     * const autopilotConfig = await prisma.autopilotConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AutopilotConfigFindFirstArgs>(args?: SelectSubset<T, AutopilotConfigFindFirstArgs<ExtArgs>>): Prisma__AutopilotConfigClient<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AutopilotConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotConfigFindFirstOrThrowArgs} args - Arguments to find a AutopilotConfig
     * @example
     * // Get one AutopilotConfig
     * const autopilotConfig = await prisma.autopilotConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AutopilotConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, AutopilotConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__AutopilotConfigClient<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AutopilotConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AutopilotConfigs
     * const autopilotConfigs = await prisma.autopilotConfig.findMany()
     * 
     * // Get first 10 AutopilotConfigs
     * const autopilotConfigs = await prisma.autopilotConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const autopilotConfigWithIdOnly = await prisma.autopilotConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AutopilotConfigFindManyArgs>(args?: SelectSubset<T, AutopilotConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AutopilotConfig.
     * @param {AutopilotConfigCreateArgs} args - Arguments to create a AutopilotConfig.
     * @example
     * // Create one AutopilotConfig
     * const AutopilotConfig = await prisma.autopilotConfig.create({
     *   data: {
     *     // ... data to create a AutopilotConfig
     *   }
     * })
     * 
     */
    create<T extends AutopilotConfigCreateArgs>(args: SelectSubset<T, AutopilotConfigCreateArgs<ExtArgs>>): Prisma__AutopilotConfigClient<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AutopilotConfigs.
     * @param {AutopilotConfigCreateManyArgs} args - Arguments to create many AutopilotConfigs.
     * @example
     * // Create many AutopilotConfigs
     * const autopilotConfig = await prisma.autopilotConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AutopilotConfigCreateManyArgs>(args?: SelectSubset<T, AutopilotConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AutopilotConfigs and returns the data saved in the database.
     * @param {AutopilotConfigCreateManyAndReturnArgs} args - Arguments to create many AutopilotConfigs.
     * @example
     * // Create many AutopilotConfigs
     * const autopilotConfig = await prisma.autopilotConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AutopilotConfigs and only return the `id`
     * const autopilotConfigWithIdOnly = await prisma.autopilotConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AutopilotConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, AutopilotConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AutopilotConfig.
     * @param {AutopilotConfigDeleteArgs} args - Arguments to delete one AutopilotConfig.
     * @example
     * // Delete one AutopilotConfig
     * const AutopilotConfig = await prisma.autopilotConfig.delete({
     *   where: {
     *     // ... filter to delete one AutopilotConfig
     *   }
     * })
     * 
     */
    delete<T extends AutopilotConfigDeleteArgs>(args: SelectSubset<T, AutopilotConfigDeleteArgs<ExtArgs>>): Prisma__AutopilotConfigClient<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AutopilotConfig.
     * @param {AutopilotConfigUpdateArgs} args - Arguments to update one AutopilotConfig.
     * @example
     * // Update one AutopilotConfig
     * const autopilotConfig = await prisma.autopilotConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AutopilotConfigUpdateArgs>(args: SelectSubset<T, AutopilotConfigUpdateArgs<ExtArgs>>): Prisma__AutopilotConfigClient<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AutopilotConfigs.
     * @param {AutopilotConfigDeleteManyArgs} args - Arguments to filter AutopilotConfigs to delete.
     * @example
     * // Delete a few AutopilotConfigs
     * const { count } = await prisma.autopilotConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AutopilotConfigDeleteManyArgs>(args?: SelectSubset<T, AutopilotConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AutopilotConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AutopilotConfigs
     * const autopilotConfig = await prisma.autopilotConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AutopilotConfigUpdateManyArgs>(args: SelectSubset<T, AutopilotConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AutopilotConfigs and returns the data updated in the database.
     * @param {AutopilotConfigUpdateManyAndReturnArgs} args - Arguments to update many AutopilotConfigs.
     * @example
     * // Update many AutopilotConfigs
     * const autopilotConfig = await prisma.autopilotConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AutopilotConfigs and only return the `id`
     * const autopilotConfigWithIdOnly = await prisma.autopilotConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AutopilotConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, AutopilotConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AutopilotConfig.
     * @param {AutopilotConfigUpsertArgs} args - Arguments to update or create a AutopilotConfig.
     * @example
     * // Update or create a AutopilotConfig
     * const autopilotConfig = await prisma.autopilotConfig.upsert({
     *   create: {
     *     // ... data to create a AutopilotConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AutopilotConfig we want to update
     *   }
     * })
     */
    upsert<T extends AutopilotConfigUpsertArgs>(args: SelectSubset<T, AutopilotConfigUpsertArgs<ExtArgs>>): Prisma__AutopilotConfigClient<$Result.GetResult<Prisma.$AutopilotConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AutopilotConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotConfigCountArgs} args - Arguments to filter AutopilotConfigs to count.
     * @example
     * // Count the number of AutopilotConfigs
     * const count = await prisma.autopilotConfig.count({
     *   where: {
     *     // ... the filter for the AutopilotConfigs we want to count
     *   }
     * })
    **/
    count<T extends AutopilotConfigCountArgs>(
      args?: Subset<T, AutopilotConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AutopilotConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AutopilotConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AutopilotConfigAggregateArgs>(args: Subset<T, AutopilotConfigAggregateArgs>): Prisma.PrismaPromise<GetAutopilotConfigAggregateType<T>>

    /**
     * Group by AutopilotConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AutopilotConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AutopilotConfigGroupByArgs['orderBy'] }
        : { orderBy?: AutopilotConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AutopilotConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAutopilotConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AutopilotConfig model
   */
  readonly fields: AutopilotConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AutopilotConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AutopilotConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AutopilotConfig model
   */
  interface AutopilotConfigFieldRefs {
    readonly id: FieldRef<"AutopilotConfig", 'String'>
    readonly keywords: FieldRef<"AutopilotConfig", 'String'>
    readonly targetPlatform: FieldRef<"AutopilotConfig", 'String'>
    readonly maxDailyDownloads: FieldRef<"AutopilotConfig", 'Int'>
    readonly isActive: FieldRef<"AutopilotConfig", 'Boolean'>
    readonly createdAt: FieldRef<"AutopilotConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"AutopilotConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AutopilotConfig findUnique
   */
  export type AutopilotConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * Filter, which AutopilotConfig to fetch.
     */
    where: AutopilotConfigWhereUniqueInput
  }

  /**
   * AutopilotConfig findUniqueOrThrow
   */
  export type AutopilotConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * Filter, which AutopilotConfig to fetch.
     */
    where: AutopilotConfigWhereUniqueInput
  }

  /**
   * AutopilotConfig findFirst
   */
  export type AutopilotConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * Filter, which AutopilotConfig to fetch.
     */
    where?: AutopilotConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutopilotConfigs to fetch.
     */
    orderBy?: AutopilotConfigOrderByWithRelationInput | AutopilotConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AutopilotConfigs.
     */
    cursor?: AutopilotConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutopilotConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutopilotConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AutopilotConfigs.
     */
    distinct?: AutopilotConfigScalarFieldEnum | AutopilotConfigScalarFieldEnum[]
  }

  /**
   * AutopilotConfig findFirstOrThrow
   */
  export type AutopilotConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * Filter, which AutopilotConfig to fetch.
     */
    where?: AutopilotConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutopilotConfigs to fetch.
     */
    orderBy?: AutopilotConfigOrderByWithRelationInput | AutopilotConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AutopilotConfigs.
     */
    cursor?: AutopilotConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutopilotConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutopilotConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AutopilotConfigs.
     */
    distinct?: AutopilotConfigScalarFieldEnum | AutopilotConfigScalarFieldEnum[]
  }

  /**
   * AutopilotConfig findMany
   */
  export type AutopilotConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * Filter, which AutopilotConfigs to fetch.
     */
    where?: AutopilotConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutopilotConfigs to fetch.
     */
    orderBy?: AutopilotConfigOrderByWithRelationInput | AutopilotConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AutopilotConfigs.
     */
    cursor?: AutopilotConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutopilotConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutopilotConfigs.
     */
    skip?: number
    distinct?: AutopilotConfigScalarFieldEnum | AutopilotConfigScalarFieldEnum[]
  }

  /**
   * AutopilotConfig create
   */
  export type AutopilotConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a AutopilotConfig.
     */
    data: XOR<AutopilotConfigCreateInput, AutopilotConfigUncheckedCreateInput>
  }

  /**
   * AutopilotConfig createMany
   */
  export type AutopilotConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AutopilotConfigs.
     */
    data: AutopilotConfigCreateManyInput | AutopilotConfigCreateManyInput[]
  }

  /**
   * AutopilotConfig createManyAndReturn
   */
  export type AutopilotConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * The data used to create many AutopilotConfigs.
     */
    data: AutopilotConfigCreateManyInput | AutopilotConfigCreateManyInput[]
  }

  /**
   * AutopilotConfig update
   */
  export type AutopilotConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a AutopilotConfig.
     */
    data: XOR<AutopilotConfigUpdateInput, AutopilotConfigUncheckedUpdateInput>
    /**
     * Choose, which AutopilotConfig to update.
     */
    where: AutopilotConfigWhereUniqueInput
  }

  /**
   * AutopilotConfig updateMany
   */
  export type AutopilotConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AutopilotConfigs.
     */
    data: XOR<AutopilotConfigUpdateManyMutationInput, AutopilotConfigUncheckedUpdateManyInput>
    /**
     * Filter which AutopilotConfigs to update
     */
    where?: AutopilotConfigWhereInput
    /**
     * Limit how many AutopilotConfigs to update.
     */
    limit?: number
  }

  /**
   * AutopilotConfig updateManyAndReturn
   */
  export type AutopilotConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * The data used to update AutopilotConfigs.
     */
    data: XOR<AutopilotConfigUpdateManyMutationInput, AutopilotConfigUncheckedUpdateManyInput>
    /**
     * Filter which AutopilotConfigs to update
     */
    where?: AutopilotConfigWhereInput
    /**
     * Limit how many AutopilotConfigs to update.
     */
    limit?: number
  }

  /**
   * AutopilotConfig upsert
   */
  export type AutopilotConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the AutopilotConfig to update in case it exists.
     */
    where: AutopilotConfigWhereUniqueInput
    /**
     * In case the AutopilotConfig found by the `where` argument doesn't exist, create a new AutopilotConfig with this data.
     */
    create: XOR<AutopilotConfigCreateInput, AutopilotConfigUncheckedCreateInput>
    /**
     * In case the AutopilotConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AutopilotConfigUpdateInput, AutopilotConfigUncheckedUpdateInput>
  }

  /**
   * AutopilotConfig delete
   */
  export type AutopilotConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
    /**
     * Filter which AutopilotConfig to delete.
     */
    where: AutopilotConfigWhereUniqueInput
  }

  /**
   * AutopilotConfig deleteMany
   */
  export type AutopilotConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AutopilotConfigs to delete
     */
    where?: AutopilotConfigWhereInput
    /**
     * Limit how many AutopilotConfigs to delete.
     */
    limit?: number
  }

  /**
   * AutopilotConfig without action
   */
  export type AutopilotConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotConfig
     */
    select?: AutopilotConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutopilotConfig
     */
    omit?: AutopilotConfigOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    title: 'title',
    sourcePath: 'sourcePath',
    durationMs: 'durationMs',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const ClipProfileScalarFieldEnum: {
    id: 'id',
    name: 'name',
    configJson: 'configJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClipProfileScalarFieldEnum = (typeof ClipProfileScalarFieldEnum)[keyof typeof ClipProfileScalarFieldEnum]


  export const TranscriptScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    provider: 'provider',
    segmentsJson: 'segmentsJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TranscriptScalarFieldEnum = (typeof TranscriptScalarFieldEnum)[keyof typeof TranscriptScalarFieldEnum]


  export const ClipCandidateScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    startMs: 'startMs',
    endMs: 'endMs',
    statsJson: 'statsJson',
    createdAt: 'createdAt'
  };

  export type ClipCandidateScalarFieldEnum = (typeof ClipCandidateScalarFieldEnum)[keyof typeof ClipCandidateScalarFieldEnum]


  export const ClipScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    startMs: 'startMs',
    endMs: 'endMs',
    scores: 'scores',
    caption: 'caption',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClipScalarFieldEnum = (typeof ClipScalarFieldEnum)[keyof typeof ClipScalarFieldEnum]


  export const AssetScalarFieldEnum: {
    id: 'id',
    clipId: 'clipId',
    kind: 'kind',
    storagePath: 'storagePath',
    createdAt: 'createdAt'
  };

  export type AssetScalarFieldEnum = (typeof AssetScalarFieldEnum)[keyof typeof AssetScalarFieldEnum]


  export const JobScalarFieldEnum: {
    id: 'id',
    type: 'type',
    payloadJson: 'payloadJson',
    status: 'status',
    attempts: 'attempts',
    error: 'error',
    nextRetryAt: 'nextRetryAt',
    scheduledAt: 'scheduledAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum]


  export const ThemePresetScalarFieldEnum: {
    id: 'id',
    name: 'name',
    fontFamily: 'fontFamily',
    primaryColor: 'primaryColor',
    outlineColor: 'outlineColor',
    alignment: 'alignment',
    marginV: 'marginV',
    createdAt: 'createdAt'
  };

  export type ThemePresetScalarFieldEnum = (typeof ThemePresetScalarFieldEnum)[keyof typeof ThemePresetScalarFieldEnum]


  export const AnalyticsScalarFieldEnum: {
    id: 'id',
    clipId: 'clipId',
    platform: 'platform',
    views: 'views',
    likes: 'likes',
    comments: 'comments',
    shares: 'shares',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AnalyticsScalarFieldEnum = (typeof AnalyticsScalarFieldEnum)[keyof typeof AnalyticsScalarFieldEnum]


  export const SettingsScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value'
  };

  export type SettingsScalarFieldEnum = (typeof SettingsScalarFieldEnum)[keyof typeof SettingsScalarFieldEnum]


  export const AutopilotConfigScalarFieldEnum: {
    id: 'id',
    keywords: 'keywords',
    targetPlatform: 'targetPlatform',
    maxDailyDownloads: 'maxDailyDownloads',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AutopilotConfigScalarFieldEnum = (typeof AutopilotConfigScalarFieldEnum)[keyof typeof AutopilotConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    title?: StringFilter<"Project"> | string
    sourcePath?: StringFilter<"Project"> | string
    durationMs?: IntNullableFilter<"Project"> | number | null
    status?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    transcripts?: TranscriptListRelationFilter
    candidates?: ClipCandidateListRelationFilter
    clips?: ClipListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    sourcePath?: SortOrder
    durationMs?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transcripts?: TranscriptOrderByRelationAggregateInput
    candidates?: ClipCandidateOrderByRelationAggregateInput
    clips?: ClipOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    title?: StringFilter<"Project"> | string
    sourcePath?: StringFilter<"Project"> | string
    durationMs?: IntNullableFilter<"Project"> | number | null
    status?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    transcripts?: TranscriptListRelationFilter
    candidates?: ClipCandidateListRelationFilter
    clips?: ClipListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    sourcePath?: SortOrder
    durationMs?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    title?: StringWithAggregatesFilter<"Project"> | string
    sourcePath?: StringWithAggregatesFilter<"Project"> | string
    durationMs?: IntNullableWithAggregatesFilter<"Project"> | number | null
    status?: StringWithAggregatesFilter<"Project"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type ClipProfileWhereInput = {
    AND?: ClipProfileWhereInput | ClipProfileWhereInput[]
    OR?: ClipProfileWhereInput[]
    NOT?: ClipProfileWhereInput | ClipProfileWhereInput[]
    id?: StringFilter<"ClipProfile"> | string
    name?: StringFilter<"ClipProfile"> | string
    configJson?: StringFilter<"ClipProfile"> | string
    createdAt?: DateTimeFilter<"ClipProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ClipProfile"> | Date | string
  }

  export type ClipProfileOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    configJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClipProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClipProfileWhereInput | ClipProfileWhereInput[]
    OR?: ClipProfileWhereInput[]
    NOT?: ClipProfileWhereInput | ClipProfileWhereInput[]
    name?: StringFilter<"ClipProfile"> | string
    configJson?: StringFilter<"ClipProfile"> | string
    createdAt?: DateTimeFilter<"ClipProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ClipProfile"> | Date | string
  }, "id">

  export type ClipProfileOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    configJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClipProfileCountOrderByAggregateInput
    _max?: ClipProfileMaxOrderByAggregateInput
    _min?: ClipProfileMinOrderByAggregateInput
  }

  export type ClipProfileScalarWhereWithAggregatesInput = {
    AND?: ClipProfileScalarWhereWithAggregatesInput | ClipProfileScalarWhereWithAggregatesInput[]
    OR?: ClipProfileScalarWhereWithAggregatesInput[]
    NOT?: ClipProfileScalarWhereWithAggregatesInput | ClipProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClipProfile"> | string
    name?: StringWithAggregatesFilter<"ClipProfile"> | string
    configJson?: StringWithAggregatesFilter<"ClipProfile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ClipProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClipProfile"> | Date | string
  }

  export type TranscriptWhereInput = {
    AND?: TranscriptWhereInput | TranscriptWhereInput[]
    OR?: TranscriptWhereInput[]
    NOT?: TranscriptWhereInput | TranscriptWhereInput[]
    id?: StringFilter<"Transcript"> | string
    projectId?: StringFilter<"Transcript"> | string
    provider?: StringFilter<"Transcript"> | string
    segmentsJson?: StringFilter<"Transcript"> | string
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeFilter<"Transcript"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type TranscriptOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    provider?: SortOrder
    segmentsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type TranscriptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TranscriptWhereInput | TranscriptWhereInput[]
    OR?: TranscriptWhereInput[]
    NOT?: TranscriptWhereInput | TranscriptWhereInput[]
    projectId?: StringFilter<"Transcript"> | string
    provider?: StringFilter<"Transcript"> | string
    segmentsJson?: StringFilter<"Transcript"> | string
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeFilter<"Transcript"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type TranscriptOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    provider?: SortOrder
    segmentsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TranscriptCountOrderByAggregateInput
    _max?: TranscriptMaxOrderByAggregateInput
    _min?: TranscriptMinOrderByAggregateInput
  }

  export type TranscriptScalarWhereWithAggregatesInput = {
    AND?: TranscriptScalarWhereWithAggregatesInput | TranscriptScalarWhereWithAggregatesInput[]
    OR?: TranscriptScalarWhereWithAggregatesInput[]
    NOT?: TranscriptScalarWhereWithAggregatesInput | TranscriptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transcript"> | string
    projectId?: StringWithAggregatesFilter<"Transcript"> | string
    provider?: StringWithAggregatesFilter<"Transcript"> | string
    segmentsJson?: StringWithAggregatesFilter<"Transcript"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transcript"> | Date | string
  }

  export type ClipCandidateWhereInput = {
    AND?: ClipCandidateWhereInput | ClipCandidateWhereInput[]
    OR?: ClipCandidateWhereInput[]
    NOT?: ClipCandidateWhereInput | ClipCandidateWhereInput[]
    id?: StringFilter<"ClipCandidate"> | string
    projectId?: StringFilter<"ClipCandidate"> | string
    startMs?: IntFilter<"ClipCandidate"> | number
    endMs?: IntFilter<"ClipCandidate"> | number
    statsJson?: StringFilter<"ClipCandidate"> | string
    createdAt?: DateTimeFilter<"ClipCandidate"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ClipCandidateOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    statsJson?: SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ClipCandidateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClipCandidateWhereInput | ClipCandidateWhereInput[]
    OR?: ClipCandidateWhereInput[]
    NOT?: ClipCandidateWhereInput | ClipCandidateWhereInput[]
    projectId?: StringFilter<"ClipCandidate"> | string
    startMs?: IntFilter<"ClipCandidate"> | number
    endMs?: IntFilter<"ClipCandidate"> | number
    statsJson?: StringFilter<"ClipCandidate"> | string
    createdAt?: DateTimeFilter<"ClipCandidate"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type ClipCandidateOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    statsJson?: SortOrder
    createdAt?: SortOrder
    _count?: ClipCandidateCountOrderByAggregateInput
    _avg?: ClipCandidateAvgOrderByAggregateInput
    _max?: ClipCandidateMaxOrderByAggregateInput
    _min?: ClipCandidateMinOrderByAggregateInput
    _sum?: ClipCandidateSumOrderByAggregateInput
  }

  export type ClipCandidateScalarWhereWithAggregatesInput = {
    AND?: ClipCandidateScalarWhereWithAggregatesInput | ClipCandidateScalarWhereWithAggregatesInput[]
    OR?: ClipCandidateScalarWhereWithAggregatesInput[]
    NOT?: ClipCandidateScalarWhereWithAggregatesInput | ClipCandidateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClipCandidate"> | string
    projectId?: StringWithAggregatesFilter<"ClipCandidate"> | string
    startMs?: IntWithAggregatesFilter<"ClipCandidate"> | number
    endMs?: IntWithAggregatesFilter<"ClipCandidate"> | number
    statsJson?: StringWithAggregatesFilter<"ClipCandidate"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ClipCandidate"> | Date | string
  }

  export type ClipWhereInput = {
    AND?: ClipWhereInput | ClipWhereInput[]
    OR?: ClipWhereInput[]
    NOT?: ClipWhereInput | ClipWhereInput[]
    id?: StringFilter<"Clip"> | string
    projectId?: StringFilter<"Clip"> | string
    startMs?: IntFilter<"Clip"> | number
    endMs?: IntFilter<"Clip"> | number
    scores?: StringFilter<"Clip"> | string
    caption?: StringNullableFilter<"Clip"> | string | null
    status?: StringFilter<"Clip"> | string
    createdAt?: DateTimeFilter<"Clip"> | Date | string
    updatedAt?: DateTimeFilter<"Clip"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    assets?: AssetListRelationFilter
    analytics?: AnalyticsListRelationFilter
  }

  export type ClipOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    scores?: SortOrder
    caption?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    assets?: AssetOrderByRelationAggregateInput
    analytics?: AnalyticsOrderByRelationAggregateInput
  }

  export type ClipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClipWhereInput | ClipWhereInput[]
    OR?: ClipWhereInput[]
    NOT?: ClipWhereInput | ClipWhereInput[]
    projectId?: StringFilter<"Clip"> | string
    startMs?: IntFilter<"Clip"> | number
    endMs?: IntFilter<"Clip"> | number
    scores?: StringFilter<"Clip"> | string
    caption?: StringNullableFilter<"Clip"> | string | null
    status?: StringFilter<"Clip"> | string
    createdAt?: DateTimeFilter<"Clip"> | Date | string
    updatedAt?: DateTimeFilter<"Clip"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    assets?: AssetListRelationFilter
    analytics?: AnalyticsListRelationFilter
  }, "id">

  export type ClipOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    scores?: SortOrder
    caption?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClipCountOrderByAggregateInput
    _avg?: ClipAvgOrderByAggregateInput
    _max?: ClipMaxOrderByAggregateInput
    _min?: ClipMinOrderByAggregateInput
    _sum?: ClipSumOrderByAggregateInput
  }

  export type ClipScalarWhereWithAggregatesInput = {
    AND?: ClipScalarWhereWithAggregatesInput | ClipScalarWhereWithAggregatesInput[]
    OR?: ClipScalarWhereWithAggregatesInput[]
    NOT?: ClipScalarWhereWithAggregatesInput | ClipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Clip"> | string
    projectId?: StringWithAggregatesFilter<"Clip"> | string
    startMs?: IntWithAggregatesFilter<"Clip"> | number
    endMs?: IntWithAggregatesFilter<"Clip"> | number
    scores?: StringWithAggregatesFilter<"Clip"> | string
    caption?: StringNullableWithAggregatesFilter<"Clip"> | string | null
    status?: StringWithAggregatesFilter<"Clip"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Clip"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Clip"> | Date | string
  }

  export type AssetWhereInput = {
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    id?: StringFilter<"Asset"> | string
    clipId?: StringFilter<"Asset"> | string
    kind?: StringFilter<"Asset"> | string
    storagePath?: StringFilter<"Asset"> | string
    createdAt?: DateTimeFilter<"Asset"> | Date | string
    clip?: XOR<ClipScalarRelationFilter, ClipWhereInput>
  }

  export type AssetOrderByWithRelationInput = {
    id?: SortOrder
    clipId?: SortOrder
    kind?: SortOrder
    storagePath?: SortOrder
    createdAt?: SortOrder
    clip?: ClipOrderByWithRelationInput
  }

  export type AssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    clipId?: StringFilter<"Asset"> | string
    kind?: StringFilter<"Asset"> | string
    storagePath?: StringFilter<"Asset"> | string
    createdAt?: DateTimeFilter<"Asset"> | Date | string
    clip?: XOR<ClipScalarRelationFilter, ClipWhereInput>
  }, "id">

  export type AssetOrderByWithAggregationInput = {
    id?: SortOrder
    clipId?: SortOrder
    kind?: SortOrder
    storagePath?: SortOrder
    createdAt?: SortOrder
    _count?: AssetCountOrderByAggregateInput
    _max?: AssetMaxOrderByAggregateInput
    _min?: AssetMinOrderByAggregateInput
  }

  export type AssetScalarWhereWithAggregatesInput = {
    AND?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    OR?: AssetScalarWhereWithAggregatesInput[]
    NOT?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Asset"> | string
    clipId?: StringWithAggregatesFilter<"Asset"> | string
    kind?: StringWithAggregatesFilter<"Asset"> | string
    storagePath?: StringWithAggregatesFilter<"Asset"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Asset"> | Date | string
  }

  export type JobWhereInput = {
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    id?: StringFilter<"Job"> | string
    type?: StringFilter<"Job"> | string
    payloadJson?: StringFilter<"Job"> | string
    status?: StringFilter<"Job"> | string
    attempts?: IntFilter<"Job"> | number
    error?: StringNullableFilter<"Job"> | string | null
    nextRetryAt?: DateTimeNullableFilter<"Job"> | Date | string | null
    scheduledAt?: DateTimeNullableFilter<"Job"> | Date | string | null
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
  }

  export type JobOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    error?: SortOrderInput | SortOrder
    nextRetryAt?: SortOrderInput | SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    type?: StringFilter<"Job"> | string
    payloadJson?: StringFilter<"Job"> | string
    status?: StringFilter<"Job"> | string
    attempts?: IntFilter<"Job"> | number
    error?: StringNullableFilter<"Job"> | string | null
    nextRetryAt?: DateTimeNullableFilter<"Job"> | Date | string | null
    scheduledAt?: DateTimeNullableFilter<"Job"> | Date | string | null
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
  }, "id">

  export type JobOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    error?: SortOrderInput | SortOrder
    nextRetryAt?: SortOrderInput | SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JobCountOrderByAggregateInput
    _avg?: JobAvgOrderByAggregateInput
    _max?: JobMaxOrderByAggregateInput
    _min?: JobMinOrderByAggregateInput
    _sum?: JobSumOrderByAggregateInput
  }

  export type JobScalarWhereWithAggregatesInput = {
    AND?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    OR?: JobScalarWhereWithAggregatesInput[]
    NOT?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Job"> | string
    type?: StringWithAggregatesFilter<"Job"> | string
    payloadJson?: StringWithAggregatesFilter<"Job"> | string
    status?: StringWithAggregatesFilter<"Job"> | string
    attempts?: IntWithAggregatesFilter<"Job"> | number
    error?: StringNullableWithAggregatesFilter<"Job"> | string | null
    nextRetryAt?: DateTimeNullableWithAggregatesFilter<"Job"> | Date | string | null
    scheduledAt?: DateTimeNullableWithAggregatesFilter<"Job"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
  }

  export type ThemePresetWhereInput = {
    AND?: ThemePresetWhereInput | ThemePresetWhereInput[]
    OR?: ThemePresetWhereInput[]
    NOT?: ThemePresetWhereInput | ThemePresetWhereInput[]
    id?: StringFilter<"ThemePreset"> | string
    name?: StringFilter<"ThemePreset"> | string
    fontFamily?: StringFilter<"ThemePreset"> | string
    primaryColor?: StringFilter<"ThemePreset"> | string
    outlineColor?: StringFilter<"ThemePreset"> | string
    alignment?: StringFilter<"ThemePreset"> | string
    marginV?: StringFilter<"ThemePreset"> | string
    createdAt?: DateTimeFilter<"ThemePreset"> | Date | string
  }

  export type ThemePresetOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    fontFamily?: SortOrder
    primaryColor?: SortOrder
    outlineColor?: SortOrder
    alignment?: SortOrder
    marginV?: SortOrder
    createdAt?: SortOrder
  }

  export type ThemePresetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ThemePresetWhereInput | ThemePresetWhereInput[]
    OR?: ThemePresetWhereInput[]
    NOT?: ThemePresetWhereInput | ThemePresetWhereInput[]
    name?: StringFilter<"ThemePreset"> | string
    fontFamily?: StringFilter<"ThemePreset"> | string
    primaryColor?: StringFilter<"ThemePreset"> | string
    outlineColor?: StringFilter<"ThemePreset"> | string
    alignment?: StringFilter<"ThemePreset"> | string
    marginV?: StringFilter<"ThemePreset"> | string
    createdAt?: DateTimeFilter<"ThemePreset"> | Date | string
  }, "id">

  export type ThemePresetOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    fontFamily?: SortOrder
    primaryColor?: SortOrder
    outlineColor?: SortOrder
    alignment?: SortOrder
    marginV?: SortOrder
    createdAt?: SortOrder
    _count?: ThemePresetCountOrderByAggregateInput
    _max?: ThemePresetMaxOrderByAggregateInput
    _min?: ThemePresetMinOrderByAggregateInput
  }

  export type ThemePresetScalarWhereWithAggregatesInput = {
    AND?: ThemePresetScalarWhereWithAggregatesInput | ThemePresetScalarWhereWithAggregatesInput[]
    OR?: ThemePresetScalarWhereWithAggregatesInput[]
    NOT?: ThemePresetScalarWhereWithAggregatesInput | ThemePresetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ThemePreset"> | string
    name?: StringWithAggregatesFilter<"ThemePreset"> | string
    fontFamily?: StringWithAggregatesFilter<"ThemePreset"> | string
    primaryColor?: StringWithAggregatesFilter<"ThemePreset"> | string
    outlineColor?: StringWithAggregatesFilter<"ThemePreset"> | string
    alignment?: StringWithAggregatesFilter<"ThemePreset"> | string
    marginV?: StringWithAggregatesFilter<"ThemePreset"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ThemePreset"> | Date | string
  }

  export type AnalyticsWhereInput = {
    AND?: AnalyticsWhereInput | AnalyticsWhereInput[]
    OR?: AnalyticsWhereInput[]
    NOT?: AnalyticsWhereInput | AnalyticsWhereInput[]
    id?: StringFilter<"Analytics"> | string
    clipId?: StringFilter<"Analytics"> | string
    platform?: StringFilter<"Analytics"> | string
    views?: IntFilter<"Analytics"> | number
    likes?: IntFilter<"Analytics"> | number
    comments?: IntFilter<"Analytics"> | number
    shares?: IntFilter<"Analytics"> | number
    createdAt?: DateTimeFilter<"Analytics"> | Date | string
    updatedAt?: DateTimeFilter<"Analytics"> | Date | string
    clip?: XOR<ClipScalarRelationFilter, ClipWhereInput>
  }

  export type AnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    clipId?: SortOrder
    platform?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clip?: ClipOrderByWithRelationInput
  }

  export type AnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clipId_platform?: AnalyticsClipIdPlatformCompoundUniqueInput
    AND?: AnalyticsWhereInput | AnalyticsWhereInput[]
    OR?: AnalyticsWhereInput[]
    NOT?: AnalyticsWhereInput | AnalyticsWhereInput[]
    clipId?: StringFilter<"Analytics"> | string
    platform?: StringFilter<"Analytics"> | string
    views?: IntFilter<"Analytics"> | number
    likes?: IntFilter<"Analytics"> | number
    comments?: IntFilter<"Analytics"> | number
    shares?: IntFilter<"Analytics"> | number
    createdAt?: DateTimeFilter<"Analytics"> | Date | string
    updatedAt?: DateTimeFilter<"Analytics"> | Date | string
    clip?: XOR<ClipScalarRelationFilter, ClipWhereInput>
  }, "id" | "clipId_platform">

  export type AnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    clipId?: SortOrder
    platform?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AnalyticsCountOrderByAggregateInput
    _avg?: AnalyticsAvgOrderByAggregateInput
    _max?: AnalyticsMaxOrderByAggregateInput
    _min?: AnalyticsMinOrderByAggregateInput
    _sum?: AnalyticsSumOrderByAggregateInput
  }

  export type AnalyticsScalarWhereWithAggregatesInput = {
    AND?: AnalyticsScalarWhereWithAggregatesInput | AnalyticsScalarWhereWithAggregatesInput[]
    OR?: AnalyticsScalarWhereWithAggregatesInput[]
    NOT?: AnalyticsScalarWhereWithAggregatesInput | AnalyticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Analytics"> | string
    clipId?: StringWithAggregatesFilter<"Analytics"> | string
    platform?: StringWithAggregatesFilter<"Analytics"> | string
    views?: IntWithAggregatesFilter<"Analytics"> | number
    likes?: IntWithAggregatesFilter<"Analytics"> | number
    comments?: IntWithAggregatesFilter<"Analytics"> | number
    shares?: IntWithAggregatesFilter<"Analytics"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Analytics"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Analytics"> | Date | string
  }

  export type SettingsWhereInput = {
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    id?: StringFilter<"Settings"> | string
    key?: StringFilter<"Settings"> | string
    value?: StringFilter<"Settings"> | string
  }

  export type SettingsOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    value?: StringFilter<"Settings"> | string
  }, "id" | "key">

  export type SettingsOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    _count?: SettingsCountOrderByAggregateInput
    _max?: SettingsMaxOrderByAggregateInput
    _min?: SettingsMinOrderByAggregateInput
  }

  export type SettingsScalarWhereWithAggregatesInput = {
    AND?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    OR?: SettingsScalarWhereWithAggregatesInput[]
    NOT?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Settings"> | string
    key?: StringWithAggregatesFilter<"Settings"> | string
    value?: StringWithAggregatesFilter<"Settings"> | string
  }

  export type AutopilotConfigWhereInput = {
    AND?: AutopilotConfigWhereInput | AutopilotConfigWhereInput[]
    OR?: AutopilotConfigWhereInput[]
    NOT?: AutopilotConfigWhereInput | AutopilotConfigWhereInput[]
    id?: StringFilter<"AutopilotConfig"> | string
    keywords?: StringFilter<"AutopilotConfig"> | string
    targetPlatform?: StringFilter<"AutopilotConfig"> | string
    maxDailyDownloads?: IntFilter<"AutopilotConfig"> | number
    isActive?: BoolFilter<"AutopilotConfig"> | boolean
    createdAt?: DateTimeFilter<"AutopilotConfig"> | Date | string
    updatedAt?: DateTimeFilter<"AutopilotConfig"> | Date | string
  }

  export type AutopilotConfigOrderByWithRelationInput = {
    id?: SortOrder
    keywords?: SortOrder
    targetPlatform?: SortOrder
    maxDailyDownloads?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AutopilotConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AutopilotConfigWhereInput | AutopilotConfigWhereInput[]
    OR?: AutopilotConfigWhereInput[]
    NOT?: AutopilotConfigWhereInput | AutopilotConfigWhereInput[]
    keywords?: StringFilter<"AutopilotConfig"> | string
    targetPlatform?: StringFilter<"AutopilotConfig"> | string
    maxDailyDownloads?: IntFilter<"AutopilotConfig"> | number
    isActive?: BoolFilter<"AutopilotConfig"> | boolean
    createdAt?: DateTimeFilter<"AutopilotConfig"> | Date | string
    updatedAt?: DateTimeFilter<"AutopilotConfig"> | Date | string
  }, "id">

  export type AutopilotConfigOrderByWithAggregationInput = {
    id?: SortOrder
    keywords?: SortOrder
    targetPlatform?: SortOrder
    maxDailyDownloads?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AutopilotConfigCountOrderByAggregateInput
    _avg?: AutopilotConfigAvgOrderByAggregateInput
    _max?: AutopilotConfigMaxOrderByAggregateInput
    _min?: AutopilotConfigMinOrderByAggregateInput
    _sum?: AutopilotConfigSumOrderByAggregateInput
  }

  export type AutopilotConfigScalarWhereWithAggregatesInput = {
    AND?: AutopilotConfigScalarWhereWithAggregatesInput | AutopilotConfigScalarWhereWithAggregatesInput[]
    OR?: AutopilotConfigScalarWhereWithAggregatesInput[]
    NOT?: AutopilotConfigScalarWhereWithAggregatesInput | AutopilotConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AutopilotConfig"> | string
    keywords?: StringWithAggregatesFilter<"AutopilotConfig"> | string
    targetPlatform?: StringWithAggregatesFilter<"AutopilotConfig"> | string
    maxDailyDownloads?: IntWithAggregatesFilter<"AutopilotConfig"> | number
    isActive?: BoolWithAggregatesFilter<"AutopilotConfig"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AutopilotConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AutopilotConfig"> | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
    candidates?: ClipCandidateCreateNestedManyWithoutProjectInput
    clips?: ClipCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
    candidates?: ClipCandidateUncheckedCreateNestedManyWithoutProjectInput
    clips?: ClipUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
    candidates?: ClipCandidateUpdateManyWithoutProjectNestedInput
    clips?: ClipUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
    candidates?: ClipCandidateUncheckedUpdateManyWithoutProjectNestedInput
    clips?: ClipUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipProfileCreateInput = {
    id?: string
    name: string
    configJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClipProfileUncheckedCreateInput = {
    id?: string
    name: string
    configJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClipProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    configJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    configJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipProfileCreateManyInput = {
    id?: string
    name: string
    configJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClipProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    configJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    configJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptCreateInput = {
    id?: string
    provider: string
    segmentsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutTranscriptsInput
  }

  export type TranscriptUncheckedCreateInput = {
    id?: string
    projectId: string
    provider: string
    segmentsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    segmentsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTranscriptsNestedInput
  }

  export type TranscriptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    segmentsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptCreateManyInput = {
    id?: string
    projectId: string
    provider: string
    segmentsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    segmentsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    segmentsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipCandidateCreateInput = {
    id?: string
    startMs: number
    endMs: number
    statsJson: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutCandidatesInput
  }

  export type ClipCandidateUncheckedCreateInput = {
    id?: string
    projectId: string
    startMs: number
    endMs: number
    statsJson: string
    createdAt?: Date | string
  }

  export type ClipCandidateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    statsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutCandidatesNestedInput
  }

  export type ClipCandidateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    statsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipCandidateCreateManyInput = {
    id?: string
    projectId: string
    startMs: number
    endMs: number
    statsJson: string
    createdAt?: Date | string
  }

  export type ClipCandidateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    statsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipCandidateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    statsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipCreateInput = {
    id?: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutClipsInput
    assets?: AssetCreateNestedManyWithoutClipInput
    analytics?: AnalyticsCreateNestedManyWithoutClipInput
  }

  export type ClipUncheckedCreateInput = {
    id?: string
    projectId: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assets?: AssetUncheckedCreateNestedManyWithoutClipInput
    analytics?: AnalyticsUncheckedCreateNestedManyWithoutClipInput
  }

  export type ClipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutClipsNestedInput
    assets?: AssetUpdateManyWithoutClipNestedInput
    analytics?: AnalyticsUpdateManyWithoutClipNestedInput
  }

  export type ClipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assets?: AssetUncheckedUpdateManyWithoutClipNestedInput
    analytics?: AnalyticsUncheckedUpdateManyWithoutClipNestedInput
  }

  export type ClipCreateManyInput = {
    id?: string
    projectId: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetCreateInput = {
    id?: string
    kind: string
    storagePath: string
    createdAt?: Date | string
    clip: ClipCreateNestedOneWithoutAssetsInput
  }

  export type AssetUncheckedCreateInput = {
    id?: string
    clipId: string
    kind: string
    storagePath: string
    createdAt?: Date | string
  }

  export type AssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clip?: ClipUpdateOneRequiredWithoutAssetsNestedInput
  }

  export type AssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clipId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetCreateManyInput = {
    id?: string
    clipId: string
    kind: string
    storagePath: string
    createdAt?: Date | string
  }

  export type AssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clipId?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobCreateInput = {
    id?: string
    type: string
    payloadJson: string
    status?: string
    attempts?: number
    error?: string | null
    nextRetryAt?: Date | string | null
    scheduledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobUncheckedCreateInput = {
    id?: string
    type: string
    payloadJson: string
    status?: string
    attempts?: number
    error?: string | null
    nextRetryAt?: Date | string | null
    scheduledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobCreateManyInput = {
    id?: string
    type: string
    payloadJson: string
    status?: string
    attempts?: number
    error?: string | null
    nextRetryAt?: Date | string | null
    scheduledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemePresetCreateInput = {
    id?: string
    name: string
    fontFamily?: string
    primaryColor?: string
    outlineColor?: string
    alignment?: string
    marginV?: string
    createdAt?: Date | string
  }

  export type ThemePresetUncheckedCreateInput = {
    id?: string
    name: string
    fontFamily?: string
    primaryColor?: string
    outlineColor?: string
    alignment?: string
    marginV?: string
    createdAt?: Date | string
  }

  export type ThemePresetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    primaryColor?: StringFieldUpdateOperationsInput | string
    outlineColor?: StringFieldUpdateOperationsInput | string
    alignment?: StringFieldUpdateOperationsInput | string
    marginV?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemePresetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    primaryColor?: StringFieldUpdateOperationsInput | string
    outlineColor?: StringFieldUpdateOperationsInput | string
    alignment?: StringFieldUpdateOperationsInput | string
    marginV?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemePresetCreateManyInput = {
    id?: string
    name: string
    fontFamily?: string
    primaryColor?: string
    outlineColor?: string
    alignment?: string
    marginV?: string
    createdAt?: Date | string
  }

  export type ThemePresetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    primaryColor?: StringFieldUpdateOperationsInput | string
    outlineColor?: StringFieldUpdateOperationsInput | string
    alignment?: StringFieldUpdateOperationsInput | string
    marginV?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemePresetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    primaryColor?: StringFieldUpdateOperationsInput | string
    outlineColor?: StringFieldUpdateOperationsInput | string
    alignment?: StringFieldUpdateOperationsInput | string
    marginV?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsCreateInput = {
    id?: string
    platform: string
    views?: number
    likes?: number
    comments?: number
    shares?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clip: ClipCreateNestedOneWithoutAnalyticsInput
  }

  export type AnalyticsUncheckedCreateInput = {
    id?: string
    clipId: string
    platform: string
    views?: number
    likes?: number
    comments?: number
    shares?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clip?: ClipUpdateOneRequiredWithoutAnalyticsNestedInput
  }

  export type AnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clipId?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsCreateManyInput = {
    id?: string
    clipId: string
    platform: string
    views?: number
    likes?: number
    comments?: number
    shares?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clipId?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsCreateInput = {
    id?: string
    key: string
    value: string
  }

  export type SettingsUncheckedCreateInput = {
    id?: string
    key: string
    value: string
  }

  export type SettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingsCreateManyInput = {
    id?: string
    key: string
    value: string
  }

  export type SettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type AutopilotConfigCreateInput = {
    id?: string
    keywords: string
    targetPlatform?: string
    maxDailyDownloads?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AutopilotConfigUncheckedCreateInput = {
    id?: string
    keywords: string
    targetPlatform?: string
    maxDailyDownloads?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AutopilotConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    targetPlatform?: StringFieldUpdateOperationsInput | string
    maxDailyDownloads?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutopilotConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    targetPlatform?: StringFieldUpdateOperationsInput | string
    maxDailyDownloads?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutopilotConfigCreateManyInput = {
    id?: string
    keywords: string
    targetPlatform?: string
    maxDailyDownloads?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AutopilotConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    targetPlatform?: StringFieldUpdateOperationsInput | string
    maxDailyDownloads?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutopilotConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    targetPlatform?: StringFieldUpdateOperationsInput | string
    maxDailyDownloads?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TranscriptListRelationFilter = {
    every?: TranscriptWhereInput
    some?: TranscriptWhereInput
    none?: TranscriptWhereInput
  }

  export type ClipCandidateListRelationFilter = {
    every?: ClipCandidateWhereInput
    some?: ClipCandidateWhereInput
    none?: ClipCandidateWhereInput
  }

  export type ClipListRelationFilter = {
    every?: ClipWhereInput
    some?: ClipWhereInput
    none?: ClipWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TranscriptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClipCandidateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    sourcePath?: SortOrder
    durationMs?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    durationMs?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    sourcePath?: SortOrder
    durationMs?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    sourcePath?: SortOrder
    durationMs?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    durationMs?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ClipProfileCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    configJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClipProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    configJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClipProfileMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    configJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type TranscriptCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    provider?: SortOrder
    segmentsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TranscriptMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    provider?: SortOrder
    segmentsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TranscriptMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    provider?: SortOrder
    segmentsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ClipCandidateCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    statsJson?: SortOrder
    createdAt?: SortOrder
  }

  export type ClipCandidateAvgOrderByAggregateInput = {
    startMs?: SortOrder
    endMs?: SortOrder
  }

  export type ClipCandidateMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    statsJson?: SortOrder
    createdAt?: SortOrder
  }

  export type ClipCandidateMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    statsJson?: SortOrder
    createdAt?: SortOrder
  }

  export type ClipCandidateSumOrderByAggregateInput = {
    startMs?: SortOrder
    endMs?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type AssetListRelationFilter = {
    every?: AssetWhereInput
    some?: AssetWhereInput
    none?: AssetWhereInput
  }

  export type AnalyticsListRelationFilter = {
    every?: AnalyticsWhereInput
    some?: AnalyticsWhereInput
    none?: AnalyticsWhereInput
  }

  export type AssetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnalyticsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClipCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    scores?: SortOrder
    caption?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClipAvgOrderByAggregateInput = {
    startMs?: SortOrder
    endMs?: SortOrder
  }

  export type ClipMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    scores?: SortOrder
    caption?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClipMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    startMs?: SortOrder
    endMs?: SortOrder
    scores?: SortOrder
    caption?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClipSumOrderByAggregateInput = {
    startMs?: SortOrder
    endMs?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ClipScalarRelationFilter = {
    is?: ClipWhereInput
    isNot?: ClipWhereInput
  }

  export type AssetCountOrderByAggregateInput = {
    id?: SortOrder
    clipId?: SortOrder
    kind?: SortOrder
    storagePath?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetMaxOrderByAggregateInput = {
    id?: SortOrder
    clipId?: SortOrder
    kind?: SortOrder
    storagePath?: SortOrder
    createdAt?: SortOrder
  }

  export type AssetMinOrderByAggregateInput = {
    id?: SortOrder
    clipId?: SortOrder
    kind?: SortOrder
    storagePath?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type JobCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    error?: SortOrder
    nextRetryAt?: SortOrder
    scheduledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobAvgOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type JobMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    error?: SortOrder
    nextRetryAt?: SortOrder
    scheduledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    payloadJson?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    error?: SortOrder
    nextRetryAt?: SortOrder
    scheduledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobSumOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ThemePresetCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    fontFamily?: SortOrder
    primaryColor?: SortOrder
    outlineColor?: SortOrder
    alignment?: SortOrder
    marginV?: SortOrder
    createdAt?: SortOrder
  }

  export type ThemePresetMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    fontFamily?: SortOrder
    primaryColor?: SortOrder
    outlineColor?: SortOrder
    alignment?: SortOrder
    marginV?: SortOrder
    createdAt?: SortOrder
  }

  export type ThemePresetMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    fontFamily?: SortOrder
    primaryColor?: SortOrder
    outlineColor?: SortOrder
    alignment?: SortOrder
    marginV?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalyticsClipIdPlatformCompoundUniqueInput = {
    clipId: string
    platform: string
  }

  export type AnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    clipId?: SortOrder
    platform?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalyticsAvgOrderByAggregateInput = {
    views?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
  }

  export type AnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    clipId?: SortOrder
    platform?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    clipId?: SortOrder
    platform?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalyticsSumOrderByAggregateInput = {
    views?: SortOrder
    likes?: SortOrder
    comments?: SortOrder
    shares?: SortOrder
  }

  export type SettingsCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingsMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AutopilotConfigCountOrderByAggregateInput = {
    id?: SortOrder
    keywords?: SortOrder
    targetPlatform?: SortOrder
    maxDailyDownloads?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AutopilotConfigAvgOrderByAggregateInput = {
    maxDailyDownloads?: SortOrder
  }

  export type AutopilotConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    keywords?: SortOrder
    targetPlatform?: SortOrder
    maxDailyDownloads?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AutopilotConfigMinOrderByAggregateInput = {
    id?: SortOrder
    keywords?: SortOrder
    targetPlatform?: SortOrder
    maxDailyDownloads?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AutopilotConfigSumOrderByAggregateInput = {
    maxDailyDownloads?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TranscriptCreateNestedManyWithoutProjectInput = {
    create?: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput> | TranscriptCreateWithoutProjectInput[] | TranscriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TranscriptCreateOrConnectWithoutProjectInput | TranscriptCreateOrConnectWithoutProjectInput[]
    createMany?: TranscriptCreateManyProjectInputEnvelope
    connect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
  }

  export type ClipCandidateCreateNestedManyWithoutProjectInput = {
    create?: XOR<ClipCandidateCreateWithoutProjectInput, ClipCandidateUncheckedCreateWithoutProjectInput> | ClipCandidateCreateWithoutProjectInput[] | ClipCandidateUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ClipCandidateCreateOrConnectWithoutProjectInput | ClipCandidateCreateOrConnectWithoutProjectInput[]
    createMany?: ClipCandidateCreateManyProjectInputEnvelope
    connect?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
  }

  export type ClipCreateNestedManyWithoutProjectInput = {
    create?: XOR<ClipCreateWithoutProjectInput, ClipUncheckedCreateWithoutProjectInput> | ClipCreateWithoutProjectInput[] | ClipUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ClipCreateOrConnectWithoutProjectInput | ClipCreateOrConnectWithoutProjectInput[]
    createMany?: ClipCreateManyProjectInputEnvelope
    connect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
  }

  export type TranscriptUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput> | TranscriptCreateWithoutProjectInput[] | TranscriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TranscriptCreateOrConnectWithoutProjectInput | TranscriptCreateOrConnectWithoutProjectInput[]
    createMany?: TranscriptCreateManyProjectInputEnvelope
    connect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
  }

  export type ClipCandidateUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ClipCandidateCreateWithoutProjectInput, ClipCandidateUncheckedCreateWithoutProjectInput> | ClipCandidateCreateWithoutProjectInput[] | ClipCandidateUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ClipCandidateCreateOrConnectWithoutProjectInput | ClipCandidateCreateOrConnectWithoutProjectInput[]
    createMany?: ClipCandidateCreateManyProjectInputEnvelope
    connect?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
  }

  export type ClipUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ClipCreateWithoutProjectInput, ClipUncheckedCreateWithoutProjectInput> | ClipCreateWithoutProjectInput[] | ClipUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ClipCreateOrConnectWithoutProjectInput | ClipCreateOrConnectWithoutProjectInput[]
    createMany?: ClipCreateManyProjectInputEnvelope
    connect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TranscriptUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput> | TranscriptCreateWithoutProjectInput[] | TranscriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TranscriptCreateOrConnectWithoutProjectInput | TranscriptCreateOrConnectWithoutProjectInput[]
    upsert?: TranscriptUpsertWithWhereUniqueWithoutProjectInput | TranscriptUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TranscriptCreateManyProjectInputEnvelope
    set?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    disconnect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    delete?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    connect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    update?: TranscriptUpdateWithWhereUniqueWithoutProjectInput | TranscriptUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TranscriptUpdateManyWithWhereWithoutProjectInput | TranscriptUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TranscriptScalarWhereInput | TranscriptScalarWhereInput[]
  }

  export type ClipCandidateUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ClipCandidateCreateWithoutProjectInput, ClipCandidateUncheckedCreateWithoutProjectInput> | ClipCandidateCreateWithoutProjectInput[] | ClipCandidateUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ClipCandidateCreateOrConnectWithoutProjectInput | ClipCandidateCreateOrConnectWithoutProjectInput[]
    upsert?: ClipCandidateUpsertWithWhereUniqueWithoutProjectInput | ClipCandidateUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ClipCandidateCreateManyProjectInputEnvelope
    set?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
    disconnect?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
    delete?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
    connect?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
    update?: ClipCandidateUpdateWithWhereUniqueWithoutProjectInput | ClipCandidateUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ClipCandidateUpdateManyWithWhereWithoutProjectInput | ClipCandidateUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ClipCandidateScalarWhereInput | ClipCandidateScalarWhereInput[]
  }

  export type ClipUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ClipCreateWithoutProjectInput, ClipUncheckedCreateWithoutProjectInput> | ClipCreateWithoutProjectInput[] | ClipUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ClipCreateOrConnectWithoutProjectInput | ClipCreateOrConnectWithoutProjectInput[]
    upsert?: ClipUpsertWithWhereUniqueWithoutProjectInput | ClipUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ClipCreateManyProjectInputEnvelope
    set?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    disconnect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    delete?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    connect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    update?: ClipUpdateWithWhereUniqueWithoutProjectInput | ClipUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ClipUpdateManyWithWhereWithoutProjectInput | ClipUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ClipScalarWhereInput | ClipScalarWhereInput[]
  }

  export type TranscriptUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput> | TranscriptCreateWithoutProjectInput[] | TranscriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TranscriptCreateOrConnectWithoutProjectInput | TranscriptCreateOrConnectWithoutProjectInput[]
    upsert?: TranscriptUpsertWithWhereUniqueWithoutProjectInput | TranscriptUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TranscriptCreateManyProjectInputEnvelope
    set?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    disconnect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    delete?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    connect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    update?: TranscriptUpdateWithWhereUniqueWithoutProjectInput | TranscriptUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TranscriptUpdateManyWithWhereWithoutProjectInput | TranscriptUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TranscriptScalarWhereInput | TranscriptScalarWhereInput[]
  }

  export type ClipCandidateUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ClipCandidateCreateWithoutProjectInput, ClipCandidateUncheckedCreateWithoutProjectInput> | ClipCandidateCreateWithoutProjectInput[] | ClipCandidateUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ClipCandidateCreateOrConnectWithoutProjectInput | ClipCandidateCreateOrConnectWithoutProjectInput[]
    upsert?: ClipCandidateUpsertWithWhereUniqueWithoutProjectInput | ClipCandidateUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ClipCandidateCreateManyProjectInputEnvelope
    set?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
    disconnect?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
    delete?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
    connect?: ClipCandidateWhereUniqueInput | ClipCandidateWhereUniqueInput[]
    update?: ClipCandidateUpdateWithWhereUniqueWithoutProjectInput | ClipCandidateUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ClipCandidateUpdateManyWithWhereWithoutProjectInput | ClipCandidateUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ClipCandidateScalarWhereInput | ClipCandidateScalarWhereInput[]
  }

  export type ClipUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ClipCreateWithoutProjectInput, ClipUncheckedCreateWithoutProjectInput> | ClipCreateWithoutProjectInput[] | ClipUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ClipCreateOrConnectWithoutProjectInput | ClipCreateOrConnectWithoutProjectInput[]
    upsert?: ClipUpsertWithWhereUniqueWithoutProjectInput | ClipUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ClipCreateManyProjectInputEnvelope
    set?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    disconnect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    delete?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    connect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    update?: ClipUpdateWithWhereUniqueWithoutProjectInput | ClipUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ClipUpdateManyWithWhereWithoutProjectInput | ClipUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ClipScalarWhereInput | ClipScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutTranscriptsInput = {
    create?: XOR<ProjectCreateWithoutTranscriptsInput, ProjectUncheckedCreateWithoutTranscriptsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTranscriptsInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutTranscriptsNestedInput = {
    create?: XOR<ProjectCreateWithoutTranscriptsInput, ProjectUncheckedCreateWithoutTranscriptsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTranscriptsInput
    upsert?: ProjectUpsertWithoutTranscriptsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutTranscriptsInput, ProjectUpdateWithoutTranscriptsInput>, ProjectUncheckedUpdateWithoutTranscriptsInput>
  }

  export type ProjectCreateNestedOneWithoutCandidatesInput = {
    create?: XOR<ProjectCreateWithoutCandidatesInput, ProjectUncheckedCreateWithoutCandidatesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCandidatesInput
    connect?: ProjectWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutCandidatesNestedInput = {
    create?: XOR<ProjectCreateWithoutCandidatesInput, ProjectUncheckedCreateWithoutCandidatesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCandidatesInput
    upsert?: ProjectUpsertWithoutCandidatesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutCandidatesInput, ProjectUpdateWithoutCandidatesInput>, ProjectUncheckedUpdateWithoutCandidatesInput>
  }

  export type ProjectCreateNestedOneWithoutClipsInput = {
    create?: XOR<ProjectCreateWithoutClipsInput, ProjectUncheckedCreateWithoutClipsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutClipsInput
    connect?: ProjectWhereUniqueInput
  }

  export type AssetCreateNestedManyWithoutClipInput = {
    create?: XOR<AssetCreateWithoutClipInput, AssetUncheckedCreateWithoutClipInput> | AssetCreateWithoutClipInput[] | AssetUncheckedCreateWithoutClipInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutClipInput | AssetCreateOrConnectWithoutClipInput[]
    createMany?: AssetCreateManyClipInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type AnalyticsCreateNestedManyWithoutClipInput = {
    create?: XOR<AnalyticsCreateWithoutClipInput, AnalyticsUncheckedCreateWithoutClipInput> | AnalyticsCreateWithoutClipInput[] | AnalyticsUncheckedCreateWithoutClipInput[]
    connectOrCreate?: AnalyticsCreateOrConnectWithoutClipInput | AnalyticsCreateOrConnectWithoutClipInput[]
    createMany?: AnalyticsCreateManyClipInputEnvelope
    connect?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
  }

  export type AssetUncheckedCreateNestedManyWithoutClipInput = {
    create?: XOR<AssetCreateWithoutClipInput, AssetUncheckedCreateWithoutClipInput> | AssetCreateWithoutClipInput[] | AssetUncheckedCreateWithoutClipInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutClipInput | AssetCreateOrConnectWithoutClipInput[]
    createMany?: AssetCreateManyClipInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type AnalyticsUncheckedCreateNestedManyWithoutClipInput = {
    create?: XOR<AnalyticsCreateWithoutClipInput, AnalyticsUncheckedCreateWithoutClipInput> | AnalyticsCreateWithoutClipInput[] | AnalyticsUncheckedCreateWithoutClipInput[]
    connectOrCreate?: AnalyticsCreateOrConnectWithoutClipInput | AnalyticsCreateOrConnectWithoutClipInput[]
    createMany?: AnalyticsCreateManyClipInputEnvelope
    connect?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ProjectUpdateOneRequiredWithoutClipsNestedInput = {
    create?: XOR<ProjectCreateWithoutClipsInput, ProjectUncheckedCreateWithoutClipsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutClipsInput
    upsert?: ProjectUpsertWithoutClipsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutClipsInput, ProjectUpdateWithoutClipsInput>, ProjectUncheckedUpdateWithoutClipsInput>
  }

  export type AssetUpdateManyWithoutClipNestedInput = {
    create?: XOR<AssetCreateWithoutClipInput, AssetUncheckedCreateWithoutClipInput> | AssetCreateWithoutClipInput[] | AssetUncheckedCreateWithoutClipInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutClipInput | AssetCreateOrConnectWithoutClipInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutClipInput | AssetUpsertWithWhereUniqueWithoutClipInput[]
    createMany?: AssetCreateManyClipInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutClipInput | AssetUpdateWithWhereUniqueWithoutClipInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutClipInput | AssetUpdateManyWithWhereWithoutClipInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AnalyticsUpdateManyWithoutClipNestedInput = {
    create?: XOR<AnalyticsCreateWithoutClipInput, AnalyticsUncheckedCreateWithoutClipInput> | AnalyticsCreateWithoutClipInput[] | AnalyticsUncheckedCreateWithoutClipInput[]
    connectOrCreate?: AnalyticsCreateOrConnectWithoutClipInput | AnalyticsCreateOrConnectWithoutClipInput[]
    upsert?: AnalyticsUpsertWithWhereUniqueWithoutClipInput | AnalyticsUpsertWithWhereUniqueWithoutClipInput[]
    createMany?: AnalyticsCreateManyClipInputEnvelope
    set?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
    disconnect?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
    delete?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
    connect?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
    update?: AnalyticsUpdateWithWhereUniqueWithoutClipInput | AnalyticsUpdateWithWhereUniqueWithoutClipInput[]
    updateMany?: AnalyticsUpdateManyWithWhereWithoutClipInput | AnalyticsUpdateManyWithWhereWithoutClipInput[]
    deleteMany?: AnalyticsScalarWhereInput | AnalyticsScalarWhereInput[]
  }

  export type AssetUncheckedUpdateManyWithoutClipNestedInput = {
    create?: XOR<AssetCreateWithoutClipInput, AssetUncheckedCreateWithoutClipInput> | AssetCreateWithoutClipInput[] | AssetUncheckedCreateWithoutClipInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutClipInput | AssetCreateOrConnectWithoutClipInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutClipInput | AssetUpsertWithWhereUniqueWithoutClipInput[]
    createMany?: AssetCreateManyClipInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutClipInput | AssetUpdateWithWhereUniqueWithoutClipInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutClipInput | AssetUpdateManyWithWhereWithoutClipInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AnalyticsUncheckedUpdateManyWithoutClipNestedInput = {
    create?: XOR<AnalyticsCreateWithoutClipInput, AnalyticsUncheckedCreateWithoutClipInput> | AnalyticsCreateWithoutClipInput[] | AnalyticsUncheckedCreateWithoutClipInput[]
    connectOrCreate?: AnalyticsCreateOrConnectWithoutClipInput | AnalyticsCreateOrConnectWithoutClipInput[]
    upsert?: AnalyticsUpsertWithWhereUniqueWithoutClipInput | AnalyticsUpsertWithWhereUniqueWithoutClipInput[]
    createMany?: AnalyticsCreateManyClipInputEnvelope
    set?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
    disconnect?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
    delete?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
    connect?: AnalyticsWhereUniqueInput | AnalyticsWhereUniqueInput[]
    update?: AnalyticsUpdateWithWhereUniqueWithoutClipInput | AnalyticsUpdateWithWhereUniqueWithoutClipInput[]
    updateMany?: AnalyticsUpdateManyWithWhereWithoutClipInput | AnalyticsUpdateManyWithWhereWithoutClipInput[]
    deleteMany?: AnalyticsScalarWhereInput | AnalyticsScalarWhereInput[]
  }

  export type ClipCreateNestedOneWithoutAssetsInput = {
    create?: XOR<ClipCreateWithoutAssetsInput, ClipUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: ClipCreateOrConnectWithoutAssetsInput
    connect?: ClipWhereUniqueInput
  }

  export type ClipUpdateOneRequiredWithoutAssetsNestedInput = {
    create?: XOR<ClipCreateWithoutAssetsInput, ClipUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: ClipCreateOrConnectWithoutAssetsInput
    upsert?: ClipUpsertWithoutAssetsInput
    connect?: ClipWhereUniqueInput
    update?: XOR<XOR<ClipUpdateToOneWithWhereWithoutAssetsInput, ClipUpdateWithoutAssetsInput>, ClipUncheckedUpdateWithoutAssetsInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ClipCreateNestedOneWithoutAnalyticsInput = {
    create?: XOR<ClipCreateWithoutAnalyticsInput, ClipUncheckedCreateWithoutAnalyticsInput>
    connectOrCreate?: ClipCreateOrConnectWithoutAnalyticsInput
    connect?: ClipWhereUniqueInput
  }

  export type ClipUpdateOneRequiredWithoutAnalyticsNestedInput = {
    create?: XOR<ClipCreateWithoutAnalyticsInput, ClipUncheckedCreateWithoutAnalyticsInput>
    connectOrCreate?: ClipCreateOrConnectWithoutAnalyticsInput
    upsert?: ClipUpsertWithoutAnalyticsInput
    connect?: ClipWhereUniqueInput
    update?: XOR<XOR<ClipUpdateToOneWithWhereWithoutAnalyticsInput, ClipUpdateWithoutAnalyticsInput>, ClipUncheckedUpdateWithoutAnalyticsInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TranscriptCreateWithoutProjectInput = {
    id?: string
    provider: string
    segmentsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptUncheckedCreateWithoutProjectInput = {
    id?: string
    provider: string
    segmentsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptCreateOrConnectWithoutProjectInput = {
    where: TranscriptWhereUniqueInput
    create: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput>
  }

  export type TranscriptCreateManyProjectInputEnvelope = {
    data: TranscriptCreateManyProjectInput | TranscriptCreateManyProjectInput[]
  }

  export type ClipCandidateCreateWithoutProjectInput = {
    id?: string
    startMs: number
    endMs: number
    statsJson: string
    createdAt?: Date | string
  }

  export type ClipCandidateUncheckedCreateWithoutProjectInput = {
    id?: string
    startMs: number
    endMs: number
    statsJson: string
    createdAt?: Date | string
  }

  export type ClipCandidateCreateOrConnectWithoutProjectInput = {
    where: ClipCandidateWhereUniqueInput
    create: XOR<ClipCandidateCreateWithoutProjectInput, ClipCandidateUncheckedCreateWithoutProjectInput>
  }

  export type ClipCandidateCreateManyProjectInputEnvelope = {
    data: ClipCandidateCreateManyProjectInput | ClipCandidateCreateManyProjectInput[]
  }

  export type ClipCreateWithoutProjectInput = {
    id?: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assets?: AssetCreateNestedManyWithoutClipInput
    analytics?: AnalyticsCreateNestedManyWithoutClipInput
  }

  export type ClipUncheckedCreateWithoutProjectInput = {
    id?: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assets?: AssetUncheckedCreateNestedManyWithoutClipInput
    analytics?: AnalyticsUncheckedCreateNestedManyWithoutClipInput
  }

  export type ClipCreateOrConnectWithoutProjectInput = {
    where: ClipWhereUniqueInput
    create: XOR<ClipCreateWithoutProjectInput, ClipUncheckedCreateWithoutProjectInput>
  }

  export type ClipCreateManyProjectInputEnvelope = {
    data: ClipCreateManyProjectInput | ClipCreateManyProjectInput[]
  }

  export type TranscriptUpsertWithWhereUniqueWithoutProjectInput = {
    where: TranscriptWhereUniqueInput
    update: XOR<TranscriptUpdateWithoutProjectInput, TranscriptUncheckedUpdateWithoutProjectInput>
    create: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput>
  }

  export type TranscriptUpdateWithWhereUniqueWithoutProjectInput = {
    where: TranscriptWhereUniqueInput
    data: XOR<TranscriptUpdateWithoutProjectInput, TranscriptUncheckedUpdateWithoutProjectInput>
  }

  export type TranscriptUpdateManyWithWhereWithoutProjectInput = {
    where: TranscriptScalarWhereInput
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyWithoutProjectInput>
  }

  export type TranscriptScalarWhereInput = {
    AND?: TranscriptScalarWhereInput | TranscriptScalarWhereInput[]
    OR?: TranscriptScalarWhereInput[]
    NOT?: TranscriptScalarWhereInput | TranscriptScalarWhereInput[]
    id?: StringFilter<"Transcript"> | string
    projectId?: StringFilter<"Transcript"> | string
    provider?: StringFilter<"Transcript"> | string
    segmentsJson?: StringFilter<"Transcript"> | string
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeFilter<"Transcript"> | Date | string
  }

  export type ClipCandidateUpsertWithWhereUniqueWithoutProjectInput = {
    where: ClipCandidateWhereUniqueInput
    update: XOR<ClipCandidateUpdateWithoutProjectInput, ClipCandidateUncheckedUpdateWithoutProjectInput>
    create: XOR<ClipCandidateCreateWithoutProjectInput, ClipCandidateUncheckedCreateWithoutProjectInput>
  }

  export type ClipCandidateUpdateWithWhereUniqueWithoutProjectInput = {
    where: ClipCandidateWhereUniqueInput
    data: XOR<ClipCandidateUpdateWithoutProjectInput, ClipCandidateUncheckedUpdateWithoutProjectInput>
  }

  export type ClipCandidateUpdateManyWithWhereWithoutProjectInput = {
    where: ClipCandidateScalarWhereInput
    data: XOR<ClipCandidateUpdateManyMutationInput, ClipCandidateUncheckedUpdateManyWithoutProjectInput>
  }

  export type ClipCandidateScalarWhereInput = {
    AND?: ClipCandidateScalarWhereInput | ClipCandidateScalarWhereInput[]
    OR?: ClipCandidateScalarWhereInput[]
    NOT?: ClipCandidateScalarWhereInput | ClipCandidateScalarWhereInput[]
    id?: StringFilter<"ClipCandidate"> | string
    projectId?: StringFilter<"ClipCandidate"> | string
    startMs?: IntFilter<"ClipCandidate"> | number
    endMs?: IntFilter<"ClipCandidate"> | number
    statsJson?: StringFilter<"ClipCandidate"> | string
    createdAt?: DateTimeFilter<"ClipCandidate"> | Date | string
  }

  export type ClipUpsertWithWhereUniqueWithoutProjectInput = {
    where: ClipWhereUniqueInput
    update: XOR<ClipUpdateWithoutProjectInput, ClipUncheckedUpdateWithoutProjectInput>
    create: XOR<ClipCreateWithoutProjectInput, ClipUncheckedCreateWithoutProjectInput>
  }

  export type ClipUpdateWithWhereUniqueWithoutProjectInput = {
    where: ClipWhereUniqueInput
    data: XOR<ClipUpdateWithoutProjectInput, ClipUncheckedUpdateWithoutProjectInput>
  }

  export type ClipUpdateManyWithWhereWithoutProjectInput = {
    where: ClipScalarWhereInput
    data: XOR<ClipUpdateManyMutationInput, ClipUncheckedUpdateManyWithoutProjectInput>
  }

  export type ClipScalarWhereInput = {
    AND?: ClipScalarWhereInput | ClipScalarWhereInput[]
    OR?: ClipScalarWhereInput[]
    NOT?: ClipScalarWhereInput | ClipScalarWhereInput[]
    id?: StringFilter<"Clip"> | string
    projectId?: StringFilter<"Clip"> | string
    startMs?: IntFilter<"Clip"> | number
    endMs?: IntFilter<"Clip"> | number
    scores?: StringFilter<"Clip"> | string
    caption?: StringNullableFilter<"Clip"> | string | null
    status?: StringFilter<"Clip"> | string
    createdAt?: DateTimeFilter<"Clip"> | Date | string
    updatedAt?: DateTimeFilter<"Clip"> | Date | string
  }

  export type ProjectCreateWithoutTranscriptsInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    candidates?: ClipCandidateCreateNestedManyWithoutProjectInput
    clips?: ClipCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTranscriptsInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    candidates?: ClipCandidateUncheckedCreateNestedManyWithoutProjectInput
    clips?: ClipUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTranscriptsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTranscriptsInput, ProjectUncheckedCreateWithoutTranscriptsInput>
  }

  export type ProjectUpsertWithoutTranscriptsInput = {
    update: XOR<ProjectUpdateWithoutTranscriptsInput, ProjectUncheckedUpdateWithoutTranscriptsInput>
    create: XOR<ProjectCreateWithoutTranscriptsInput, ProjectUncheckedCreateWithoutTranscriptsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutTranscriptsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutTranscriptsInput, ProjectUncheckedUpdateWithoutTranscriptsInput>
  }

  export type ProjectUpdateWithoutTranscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidates?: ClipCandidateUpdateManyWithoutProjectNestedInput
    clips?: ClipUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTranscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidates?: ClipCandidateUncheckedUpdateManyWithoutProjectNestedInput
    clips?: ClipUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutCandidatesInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
    clips?: ClipCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutCandidatesInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
    clips?: ClipUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutCandidatesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCandidatesInput, ProjectUncheckedCreateWithoutCandidatesInput>
  }

  export type ProjectUpsertWithoutCandidatesInput = {
    update: XOR<ProjectUpdateWithoutCandidatesInput, ProjectUncheckedUpdateWithoutCandidatesInput>
    create: XOR<ProjectCreateWithoutCandidatesInput, ProjectUncheckedCreateWithoutCandidatesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutCandidatesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutCandidatesInput, ProjectUncheckedUpdateWithoutCandidatesInput>
  }

  export type ProjectUpdateWithoutCandidatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
    clips?: ClipUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutCandidatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
    clips?: ClipUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutClipsInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
    candidates?: ClipCandidateCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutClipsInput = {
    id?: string
    title: string
    sourcePath: string
    durationMs?: number | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
    candidates?: ClipCandidateUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutClipsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutClipsInput, ProjectUncheckedCreateWithoutClipsInput>
  }

  export type AssetCreateWithoutClipInput = {
    id?: string
    kind: string
    storagePath: string
    createdAt?: Date | string
  }

  export type AssetUncheckedCreateWithoutClipInput = {
    id?: string
    kind: string
    storagePath: string
    createdAt?: Date | string
  }

  export type AssetCreateOrConnectWithoutClipInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutClipInput, AssetUncheckedCreateWithoutClipInput>
  }

  export type AssetCreateManyClipInputEnvelope = {
    data: AssetCreateManyClipInput | AssetCreateManyClipInput[]
  }

  export type AnalyticsCreateWithoutClipInput = {
    id?: string
    platform: string
    views?: number
    likes?: number
    comments?: number
    shares?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalyticsUncheckedCreateWithoutClipInput = {
    id?: string
    platform: string
    views?: number
    likes?: number
    comments?: number
    shares?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnalyticsCreateOrConnectWithoutClipInput = {
    where: AnalyticsWhereUniqueInput
    create: XOR<AnalyticsCreateWithoutClipInput, AnalyticsUncheckedCreateWithoutClipInput>
  }

  export type AnalyticsCreateManyClipInputEnvelope = {
    data: AnalyticsCreateManyClipInput | AnalyticsCreateManyClipInput[]
  }

  export type ProjectUpsertWithoutClipsInput = {
    update: XOR<ProjectUpdateWithoutClipsInput, ProjectUncheckedUpdateWithoutClipsInput>
    create: XOR<ProjectCreateWithoutClipsInput, ProjectUncheckedCreateWithoutClipsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutClipsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutClipsInput, ProjectUncheckedUpdateWithoutClipsInput>
  }

  export type ProjectUpdateWithoutClipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
    candidates?: ClipCandidateUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutClipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    sourcePath?: StringFieldUpdateOperationsInput | string
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
    candidates?: ClipCandidateUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type AssetUpsertWithWhereUniqueWithoutClipInput = {
    where: AssetWhereUniqueInput
    update: XOR<AssetUpdateWithoutClipInput, AssetUncheckedUpdateWithoutClipInput>
    create: XOR<AssetCreateWithoutClipInput, AssetUncheckedCreateWithoutClipInput>
  }

  export type AssetUpdateWithWhereUniqueWithoutClipInput = {
    where: AssetWhereUniqueInput
    data: XOR<AssetUpdateWithoutClipInput, AssetUncheckedUpdateWithoutClipInput>
  }

  export type AssetUpdateManyWithWhereWithoutClipInput = {
    where: AssetScalarWhereInput
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyWithoutClipInput>
  }

  export type AssetScalarWhereInput = {
    AND?: AssetScalarWhereInput | AssetScalarWhereInput[]
    OR?: AssetScalarWhereInput[]
    NOT?: AssetScalarWhereInput | AssetScalarWhereInput[]
    id?: StringFilter<"Asset"> | string
    clipId?: StringFilter<"Asset"> | string
    kind?: StringFilter<"Asset"> | string
    storagePath?: StringFilter<"Asset"> | string
    createdAt?: DateTimeFilter<"Asset"> | Date | string
  }

  export type AnalyticsUpsertWithWhereUniqueWithoutClipInput = {
    where: AnalyticsWhereUniqueInput
    update: XOR<AnalyticsUpdateWithoutClipInput, AnalyticsUncheckedUpdateWithoutClipInput>
    create: XOR<AnalyticsCreateWithoutClipInput, AnalyticsUncheckedCreateWithoutClipInput>
  }

  export type AnalyticsUpdateWithWhereUniqueWithoutClipInput = {
    where: AnalyticsWhereUniqueInput
    data: XOR<AnalyticsUpdateWithoutClipInput, AnalyticsUncheckedUpdateWithoutClipInput>
  }

  export type AnalyticsUpdateManyWithWhereWithoutClipInput = {
    where: AnalyticsScalarWhereInput
    data: XOR<AnalyticsUpdateManyMutationInput, AnalyticsUncheckedUpdateManyWithoutClipInput>
  }

  export type AnalyticsScalarWhereInput = {
    AND?: AnalyticsScalarWhereInput | AnalyticsScalarWhereInput[]
    OR?: AnalyticsScalarWhereInput[]
    NOT?: AnalyticsScalarWhereInput | AnalyticsScalarWhereInput[]
    id?: StringFilter<"Analytics"> | string
    clipId?: StringFilter<"Analytics"> | string
    platform?: StringFilter<"Analytics"> | string
    views?: IntFilter<"Analytics"> | number
    likes?: IntFilter<"Analytics"> | number
    comments?: IntFilter<"Analytics"> | number
    shares?: IntFilter<"Analytics"> | number
    createdAt?: DateTimeFilter<"Analytics"> | Date | string
    updatedAt?: DateTimeFilter<"Analytics"> | Date | string
  }

  export type ClipCreateWithoutAssetsInput = {
    id?: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutClipsInput
    analytics?: AnalyticsCreateNestedManyWithoutClipInput
  }

  export type ClipUncheckedCreateWithoutAssetsInput = {
    id?: string
    projectId: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    analytics?: AnalyticsUncheckedCreateNestedManyWithoutClipInput
  }

  export type ClipCreateOrConnectWithoutAssetsInput = {
    where: ClipWhereUniqueInput
    create: XOR<ClipCreateWithoutAssetsInput, ClipUncheckedCreateWithoutAssetsInput>
  }

  export type ClipUpsertWithoutAssetsInput = {
    update: XOR<ClipUpdateWithoutAssetsInput, ClipUncheckedUpdateWithoutAssetsInput>
    create: XOR<ClipCreateWithoutAssetsInput, ClipUncheckedCreateWithoutAssetsInput>
    where?: ClipWhereInput
  }

  export type ClipUpdateToOneWithWhereWithoutAssetsInput = {
    where?: ClipWhereInput
    data: XOR<ClipUpdateWithoutAssetsInput, ClipUncheckedUpdateWithoutAssetsInput>
  }

  export type ClipUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutClipsNestedInput
    analytics?: AnalyticsUpdateManyWithoutClipNestedInput
  }

  export type ClipUncheckedUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analytics?: AnalyticsUncheckedUpdateManyWithoutClipNestedInput
  }

  export type ClipCreateWithoutAnalyticsInput = {
    id?: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutClipsInput
    assets?: AssetCreateNestedManyWithoutClipInput
  }

  export type ClipUncheckedCreateWithoutAnalyticsInput = {
    id?: string
    projectId: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assets?: AssetUncheckedCreateNestedManyWithoutClipInput
  }

  export type ClipCreateOrConnectWithoutAnalyticsInput = {
    where: ClipWhereUniqueInput
    create: XOR<ClipCreateWithoutAnalyticsInput, ClipUncheckedCreateWithoutAnalyticsInput>
  }

  export type ClipUpsertWithoutAnalyticsInput = {
    update: XOR<ClipUpdateWithoutAnalyticsInput, ClipUncheckedUpdateWithoutAnalyticsInput>
    create: XOR<ClipCreateWithoutAnalyticsInput, ClipUncheckedCreateWithoutAnalyticsInput>
    where?: ClipWhereInput
  }

  export type ClipUpdateToOneWithWhereWithoutAnalyticsInput = {
    where?: ClipWhereInput
    data: XOR<ClipUpdateWithoutAnalyticsInput, ClipUncheckedUpdateWithoutAnalyticsInput>
  }

  export type ClipUpdateWithoutAnalyticsInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutClipsNestedInput
    assets?: AssetUpdateManyWithoutClipNestedInput
  }

  export type ClipUncheckedUpdateWithoutAnalyticsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assets?: AssetUncheckedUpdateManyWithoutClipNestedInput
  }

  export type TranscriptCreateManyProjectInput = {
    id?: string
    provider: string
    segmentsJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClipCandidateCreateManyProjectInput = {
    id?: string
    startMs: number
    endMs: number
    statsJson: string
    createdAt?: Date | string
  }

  export type ClipCreateManyProjectInput = {
    id?: string
    startMs: number
    endMs: number
    scores: string
    caption?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    segmentsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    segmentsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    segmentsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipCandidateUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    statsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipCandidateUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    statsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipCandidateUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    statsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assets?: AssetUpdateManyWithoutClipNestedInput
    analytics?: AnalyticsUpdateManyWithoutClipNestedInput
  }

  export type ClipUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assets?: AssetUncheckedUpdateManyWithoutClipNestedInput
    analytics?: AnalyticsUncheckedUpdateManyWithoutClipNestedInput
  }

  export type ClipUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    startMs?: IntFieldUpdateOperationsInput | number
    endMs?: IntFieldUpdateOperationsInput | number
    scores?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetCreateManyClipInput = {
    id?: string
    kind: string
    storagePath: string
    createdAt?: Date | string
  }

  export type AnalyticsCreateManyClipInput = {
    id?: string
    platform: string
    views?: number
    likes?: number
    comments?: number
    shares?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AssetUpdateWithoutClipInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetUncheckedUpdateWithoutClipInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssetUncheckedUpdateManyWithoutClipInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsUpdateWithoutClipInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsUncheckedUpdateWithoutClipInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsUncheckedUpdateManyWithoutClipInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments?: IntFieldUpdateOperationsInput | number
    shares?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}