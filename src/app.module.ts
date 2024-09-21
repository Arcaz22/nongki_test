import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppConfigModule } from './infrastructure/config.module';
import { DatabaseModule } from './infrastructure/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RedisConfigModule } from './infrastructure/redis.module';

@Module({
    imports: [
        AppConfigModule,
        DatabaseModule,
        RedisConfigModule,
        AuthModule,
        UserModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
