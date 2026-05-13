import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteSettingDto, UpdateSiteSettingDto, BulkUpdateSiteSettingDto } from './dto/site-setting.dto';

@Injectable()
export class SiteSettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.siteSetting.findMany({
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
    const setting = await this.prisma.siteSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key '${key}' not found`);
    }

    return setting;
  }

  async upsert(createSettingDto: CreateSiteSettingDto) {
    return this.prisma.siteSetting.upsert({
      where: { key: createSettingDto.key },
      update: { value: createSettingDto.value },
      create: createSettingDto,
    });
  }

  async update(key: string, updateSettingDto: UpdateSiteSettingDto) {
    await this.findOne(key);

    return this.prisma.siteSetting.update({
      where: { key },
      data: updateSettingDto,
    });
  }

  async bulkUpdate(settings: BulkUpdateSiteSettingDto[]) {
    const results = await Promise.all(
      settings.map((setting) =>
        this.prisma.siteSetting.upsert({
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

    return this.prisma.siteSetting.delete({
      where: { key },
    });
  }

  // Get specific settings by keys
  async getByKeys(keys: string[]) {
    const settings = await this.prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value || '';
    });

    return settingsMap;
  }
}
