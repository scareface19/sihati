import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './modules/seed/seed.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  console.log('--- Initialisation automatique MySQL SIHATI ---');
  const result = await seedService.runSeed();
  console.log('Résultat:', result);
  await app.close();
}
run().catch(console.error);
