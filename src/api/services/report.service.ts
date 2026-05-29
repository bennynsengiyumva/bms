import prisma from '../models/prisma';

export class ReportService {
  async getBaptismStats(filters: any) {
    const records = await prisma.baptismRecord.findMany({
      where: filters,
      include: {
        event: {
          include: {
            church: {
              include: {
                district: {
                  include: {
                    field: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const byMonth: Record<string, number> = {};
    const byDistrict: Record<string, number> = {};
    const byGender: Record<string, number> = {};

    records.forEach((r) => {
      // Month stats
      const month = r.recordedAt.toISOString().substring(0, 7); // YYYY-MM
      byMonth[month] = (byMonth[month] || 0) + 1;

      // Region stats
      const districtName = r.event.church.district.name;
      byDistrict[districtName] = (byDistrict[districtName] || 0) + 1;

      // Candidate demographic stats could be added here if needed
      // but we need to include candidate in the query
    });

    return {
      total: records.length,
      byMonth,
      byDistrict,
    };
  }

  async getCandidateProgress(filters: any) {
    const candidates = await prisma.candidate.findMany({
      where: filters,
      include: {
        lessons: true,
      },
    });

    const totalCandidates = candidates.length;
    if (totalCandidates === 0) {
      return { total: 0, averageCompletion: 0, byStatus: {} };
    }

    const totalLessonsCount = await prisma.bibleLesson.count();
    let totalCompletionPercentage = 0;
    const byStatus: Record<string, number> = {};

    candidates.forEach((c) => {
      const completedCount = c.lessons.filter((l) => l.completionDate).length;
      const progress = totalLessonsCount > 0 ? (completedCount / totalLessonsCount) * 100 : 0;
      totalCompletionPercentage += progress;

      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    });

    return {
      total: totalCandidates,
      averageCompletion: totalCompletionPercentage / totalCandidates,
      byStatus,
    };
  }

  async getChurchMetrics(churchFilters: any) {
    const churches = await prisma.localChurch.findMany({
      where: churchFilters,
      include: {
        district: true,
      },
    });

    const metrics = await Promise.all(
      churches.map(async (church) => {
        const candidateCount = await prisma.candidate.count({
          where: {
            user: {
              churchId: church.id,
            },
            status: {
              in: ['registered', 'in_progress', 'ready'],
            },
          },
        });

        const baptizedCount = await prisma.baptismRecord.count({
          where: {
            event: {
              churchId: church.id,
            },
          },
        });

        const memberCount = await prisma.member.count({
          where: {
            currentChurchId: church.id,
            status: 'active',
          },
        });

        return {
          churchId: church.id,
          churchName: church.name,
          districtName: church.district.name,
          memberCount,
          candidateCount,
          baptizedCount,
        };
      })
    );

    return metrics;
  }

  async getGrowthAnalytics(memberFilters: any) {
    const members = await prisma.member.findMany({
      where: memberFilters,
    });

    const totalNew = members.length;
    const fromBaptism = members.filter((m) => m.baptismRecordId !== null).length;
    const fromTransfer = totalNew - fromBaptism;

    return {
      totalNew,
      fromBaptism,
      fromTransfer,
      percentageBaptism: totalNew > 0 ? (fromBaptism / totalNew) * 100 : 0,
    };
  }
}
