import { Controller, Get, Header } from "@nestjs/common";
import { HealthCheckService, MemoryHealthIndicator, HealthCheck } from "@nestjs/terminus";
import { register } from "prom-client";
import { ApiExcludeController } from "@nestjs/swagger";

@Controller("healthcheck")
@ApiExcludeController()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.memory.checkHeap("memory_heap", 500 * 1024 * 1024)]);
  }

  @Get("metrics")
  @Header("Content-Type", register.contentType)
  metrics() {
    return register.metrics();
  }
}
