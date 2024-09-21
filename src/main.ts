import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './infrastructure/config/swagger.config'
import { ConfigService } from '@nestjs/config'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalFilters(new AllExceptionsFilter())
    app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    );

    const configService = app.get(ConfigService)
    const port = configService.get<number>('PORT')

    if (process.env.NODE_ENV !== 'production') {
        setupSwagger(app)
    }
    await app.listen(port)
}
bootstrap()
