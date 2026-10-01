export type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthCheckResult {
  status: ServiceStatus;
  uptimeSeconds: number;
  timestamp: string;
  version: string;
  services: {
    database: {
      status: ServiceStatus;
      responseTimeMs?: number;
      message?: string;
    };
    redis: {
      status: ServiceStatus;
      responseTimeMs?: number;
      message?: string;
    };
    memory: {
      status: ServiceStatus;
      heapUsedMb: number;
      heapTotalMb: number;
      rssMb: number;
    };
  };
}

export interface JobProgressMessage {
  jobId: string;
  datasetId?: string;
  type: string;
  progressPercent: number; // 0 - 100
  status: 'queued' | 'active' | 'completed' | 'failed';
  currentStepMessage?: string;
  error?: string;
}
