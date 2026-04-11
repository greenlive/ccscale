import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateSiteSettingDto, UpdateSiteSettingDto, BulkUpdateSiteSettingDto } from './dto/site-setting.dto';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

@Injectable()
export class SiteSettingsService {
  async findAll() {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });

    // Convert to key-value object
    const settingsMap: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value || '';
    });

    return settingsMap;
  }

  async findOne(key: string) {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key '${key}' not found`);
    }

    return setting;
  }

  async upsert(createSettingDto: CreateSiteSettingDto) {
    return prisma.siteSetting.upsert({
      where: { key: createSettingDto.key },
      update: { value: createSettingDto.value },
      create: createSettingDto,
    });
  }

  async update(key: string, updateSettingDto: UpdateSiteSettingDto) {
    await this.findOne(key);

    return prisma.siteSetting.update({
      where: { key },
      data: updateSettingDto,
    });
  }

  async bulkUpdate(settings: BulkUpdateSiteSettingDto[]) {
    const results = await Promise.all(
      settings.map((setting) =>
        prisma.siteSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value },
        })
      )
    );

    return results;
  }

  async remove(key: string) {
    await this.findOne(key);

    return prisma.siteSetting.delete({
      where: { key },
    });
  }

  // Get specific settings by keys
  async getByKeys(keys: string[]) {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value || '';
    });

    return settingsMap;
  }
}
