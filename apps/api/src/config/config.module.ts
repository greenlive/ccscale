import { Global, Module } from '@nestjs/common';
import configuration, { CONFIGURATION_KEY } from './configuration';

/**
 * Wraps the validated, environment-aware config factory as a globally-available
 * provider under the CONFIGURATION_KEY token.
 *
 * Use:
 *   constructor(@Inject(CONFIGURATION_KEY) private readonly config: ConfigType<typeof configuration>) {}
 */
@Global()
@Module({
  providers: [
    {
      provide: CONFIGURATION_KEY,
      useFactory: configuration,
    },
  ],
  exports: [CONFIGURATION_KEY],
})
export class AppConfigModule {}