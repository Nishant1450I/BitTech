import { prisma } from '../config/database';
import {
  CreateReportInput,
  CreateVerificationInput,
  QueryReportInput,
  UpdateReportInput,
} from '../schemas/reportSchema';
import { Prisma } from '@prisma/client';

export class ReportService {
  /**
   * List citizen reports with pagination and filtering
   */
  async getAll(query: QueryReportInput) {
    const {
      infrastructureId,
      areaId,
      issueType,
      status,
      severity,
      search,
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {};

    if (infrastructureId) where.infrastructureId = infrastructureId;
    if (areaId) where.areaId = areaId;
    if (issueType) where.issueType = issueType;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { reporterName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          infrastructure: {
            select: { id: true, name: true, type: true, status: true },
          },
          area: {
            select: { id: true, name: true },
          },
          verifications: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
    ]);

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
   * Get single report details
   */
  async getById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        infrastructure: true,
        area: true,
        verifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Create a new citizen report and update infrastructure status/metrics
   */
  async create(data: CreateReportInput) {
    return prisma.$transaction(async (tx) => {
      let finalInfraId = data.infrastructureId;
      let finalAreaId = data.areaId;

      // If infrastructureId wasn't passed, look for nearby infrastructure (within 50 meters)
      if (!finalInfraId && data.latitude && data.longitude) {
        const nearbyInfra = await tx.infrastructure.findFirst({
          where: {
            latitude: { gte: data.latitude - 0.0005, lte: data.latitude + 0.0005 },
            longitude: { gte: data.longitude - 0.0005, lte: data.longitude + 0.0005 },
          },
        });
        if (nearbyInfra) {
          finalInfraId = nearbyInfra.id;
          finalAreaId = finalAreaId || nearbyInfra.areaId;
        }
      }

      // If areaId is not set, look for matching area bounding radius
      if (!finalAreaId && data.latitude && data.longitude) {
        const nearbyArea = await tx.area.findFirst({
          where: {
            latitude: { gte: data.latitude - 0.02, lte: data.latitude + 0.02 },
            longitude: { gte: data.longitude - 0.02, lte: data.longitude + 0.02 },
          },
        });
        if (nearbyArea) {
          finalAreaId = nearbyArea.id;
        }
      }

      const report = await tx.report.create({
        data: {
          infrastructureId: finalInfraId || undefined,
          areaId: finalAreaId || undefined,
          issueType: data.issueType,
          description: data.description,
          severity: data.severity || 'MEDIUM',
          latitude: data.latitude,
          longitude: data.longitude,
          imageUrl: data.imageUrl,
          status: 'SUBMITTED',
          reporterName: data.reporterName,
          reporterContact: data.reporterContact,
        },
        include: {
          infrastructure: true,
          area: true,
        },
      });

      // If linked to infrastructure, increment report count and adjust status if broken/critical
      if (finalInfraId) {
        const infra = await tx.infrastructure.findUnique({ where: { id: finalInfraId } });
        if (infra) {
          let updatedStatus = infra.status;
          if (infra.status === 'WORKING' && (data.issueType === 'BROKEN' || data.issueType === 'MISSING' || data.issueType === 'NOT_WORKING')) {
            updatedStatus = 'BROKEN';
          } else if (infra.status === 'WORKING' && (data.issueType === 'INACCESSIBLE' || data.issueType === 'BLOCKED')) {
            updatedStatus = 'WARNING';
          }

          if (updatedStatus !== infra.status) {
            await tx.infrastructureStatusHistory.create({
              data: {
                infrastructureId: infra.id,
                oldStatus: infra.status,
                newStatus: updatedStatus,
                reason: `Citizen report #${report.id.slice(0, 8)} (${data.issueType})`,
              },
            });
          }

          await tx.infrastructure.update({
            where: { id: finalInfraId },
            data: {
              reportCount: { increment: 1 },
              status: updatedStatus,
              severity: data.severity === 'CRITICAL' ? 'CRITICAL' : infra.severity,
            },
          });
        }
      }

      return report;
    });
  }

  /**
   * Update report status or details
   */
  async update(id: string, data: UpdateReportInput) {
    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.report.update({
      where: { id },
      data: {
        status: data.status,
        severity: data.severity,
        description: data.description,
        imageUrl: data.imageUrl,
      },
      include: {
        infrastructure: true,
        area: true,
        verifications: true,
      },
    });
  }

  /**
   * Add verification to a report
   */
  async addVerification(reportId: string, data: CreateVerificationInput) {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { infrastructure: true },
    });

    if (!report) return null;

    return prisma.$transaction(async (tx) => {
      const verification = await tx.verification.create({
        data: {
          reportId,
          verificationType: data.verificationType,
          verifiedBy: data.verifiedBy,
          notes: data.notes,
        },
      });

      // Update report status to VERIFIED
      await tx.report.update({
        where: { id: reportId },
        data: { status: 'VERIFIED' },
      });

      // Update infrastructure verification status if associated
      if (report.infrastructureId) {
        const nextVerifStatus =
          data.verificationType === 'OFFICIAL'
            ? 'OFFICIALLY_VERIFIED'
            : 'COMMUNITY_VERIFIED';

        await tx.infrastructure.update({
          where: { id: report.infrastructureId },
          data: {
            verificationStatus: nextVerifStatus,
            lastVerifiedAt: new Date(),
          },
        });
      }

      return verification;
    });
  }
}

export const reportService = new ReportService();
