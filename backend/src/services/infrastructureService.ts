import { prisma } from '../config/database';
import {
  CreateInfrastructureInput,
  QueryInfrastructureInput,
  UpdateInfrastructureInput,
} from '../schemas/infrastructureSchema';
import { InfrastructureMapMarkerDTO } from '../types/infrastructure';
import { Prisma } from '@prisma/client';

export class InfrastructureService {
  /**
   * Fetch infrastructure items with filtering, pagination, and optional map-optimized DTO formatting
   */
  async getAll(query: QueryInfrastructureInput) {
    const {
      type,
      status,
      severity,
      verificationStatus,
      areaId,
      lat,
      lng,
      radiusKm = 10,
      search,
      page = 1,
      limit = 50,
      format = 'full',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.InfrastructureWhereInput = {};

    if (type) where.type = type;
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (verificationStatus) where.verificationStatus = verificationStatus;
    if (areaId) where.areaId = areaId;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Proximity bounding box filter if coordinates are provided
    if (lat !== undefined && lng !== undefined) {
      // 1 degree latitude ~ 111 km, 1 degree longitude ~ 111 * cos(lat) km
      const latDelta = radiusKm / 111;
      const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

      where.latitude = {
        gte: lat - latDelta,
        lte: lat + latDelta,
      };
      where.longitude = {
        gte: lng - lngDelta,
        lte: lng + lngDelta,
      };
    }

    const [total, items] = await Promise.all([
      prisma.infrastructure.count({ where }),
      prisma.infrastructure.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          area: { select: { id: true, name: true } },
          _count: { select: { reports: true } },
        },
      }),
    ]);

    if (format === 'markers') {
      const markers: InfrastructureMapMarkerDTO[] = items.map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        status: item.status,
        severity: item.severity,
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
        reportCount: item.reportCount,
        verificationStatus: item.verificationStatus,
        imageUrl: item.imageUrl,
      }));

      return {
        data: markers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Fetch single infrastructure details with relations and history
   */
  async getById(id: string) {
    return prisma.infrastructure.findUnique({
      where: { id },
      include: {
        area: true,
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            verifications: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
  }

  /**
   * Create a new infrastructure asset
   */
  async create(data: CreateInfrastructureInput) {
    return prisma.infrastructure.create({
      data: {
        name: data.name,
        type: data.type,
        status: data.status || 'WORKING',
        severity: data.severity || 'LOW',
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        imageUrl: data.imageUrl,
        areaId: data.areaId,
      },
      include: {
        area: true,
      },
    });
  }

  /**
   * Update infrastructure with automatic status change auditing
   */
  async update(id: string, data: UpdateInfrastructureInput) {
    const existing = await prisma.infrastructure.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    const isStatusChanged = data.status && data.status !== existing.status;

    return prisma.$transaction(async (tx) => {
      if (isStatusChanged && data.status) {
        await tx.infrastructureStatusHistory.create({
          data: {
            infrastructureId: id,
            oldStatus: existing.status,
            newStatus: data.status,
            reason: data.statusChangeReason || 'Status update via API',
          },
        });
      }

      const updatePayload: Prisma.InfrastructureUpdateInput = {
        name: data.name,
        type: data.type,
        status: data.status,
        severity: data.severity,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        imageUrl: data.imageUrl,
        verificationStatus: data.verificationStatus,
      };

      if (data.verificationStatus === 'OFFICIALLY_VERIFIED' || data.verificationStatus === 'COMMUNITY_VERIFIED') {
        updatePayload.lastVerifiedAt = new Date();
      }

      if (data.areaId !== undefined) {
        updatePayload.area = data.areaId ? { connect: { id: data.areaId } } : { disconnect: true };
      }

      return tx.infrastructure.update({
        where: { id },
        data: updatePayload,
        include: {
          area: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
    });
  }

  /**
   * Delete infrastructure
   */
  async delete(id: string) {
    const existing = await prisma.infrastructure.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.infrastructure.delete({
      where: { id },
    });
  }
}

export const infrastructureService = new InfrastructureService();
