export interface PromotionStudent {
  id: string;
  name: string;
  grade: string;
  group: string;

  failedSubjects: number;

  failedAreas: string[];

  promoted: boolean;

  grades: Record<string, string>;
}

export interface GradeMetric {
  grade: string;
  promoted: number;
  notPromoted: number;
  rate: number;
}

export interface FailedSubjectMetric {
  subject: string;
  failedStudents: number;
  percentage: number;
}

export interface LossDistributionMetric {
  label: string;
  count: number;
}

export interface PromotionAnalytics {
  totalStudents: number;
  promotedStudents: number;
  notPromotedStudents: number;
  promotionRate: number;

  gradeMetrics: GradeMetric[];

  failedSubjects: FailedSubjectMetric[];

  lossDistribution: LossDistributionMetric[];

  notPromotedStudentsList: PromotionStudent[];

  promotedWithLossList: PromotionStudent[];
}

export interface PromotionSnapshot {
  uploadedAt: string;
  sourceFileName: string;
  students: PromotionStudent[];
  analytics: PromotionAnalytics;
}