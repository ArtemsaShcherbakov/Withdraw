import { apiClient } from "./api";

import type { TStatusResponse, IWithdrawal } from "@/types/withdraw";

export interface ICreateWithdrawalResponse {
  id: string;
  status: TStatusResponse;
}

class WithdrawalService {
  private readonly baseUrl = "/v1/withdrawals";
  private maxRetries = 2;
  private retryDelay = 1000;

  async createWithdrawal(data: { amount: number; destination: string }) {
    const idempotencyKey = crypto.randomUUID();
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await apiClient.post<ICreateWithdrawalResponse>(
          this.baseUrl,
          {
            amount: data.amount,
            destination: data.destination,
            idempotency_key: idempotencyKey,
          },
          {
            headers: {
              "Idempotency-Key": idempotencyKey,
            },
          },
        );

        return response;
      } catch (error: any) {
        lastError = error;

        // Don't retry on 409 (conflict) or 4xx client errors
        if (error.response?.status === 409) {
          throw new Error(
            "This withdrawal request was already processed. Please check your withdrawals list.",
          );
        }

        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw new Error(error.response?.data?.message || "Invalid request");
        }

        // Only retry on network errors or 5xx
        if (attempt === this.maxRetries || error.response?.status < 500) {
          throw new Error("Network error. Please try again.");
        }

        await this.delay(this.retryDelay * attempt);
      }
    }

    throw lastError!;
  }

  async getWithdrawal(id: string) {
    try {
      const response = await apiClient.get<IWithdrawal>(
        `${this.baseUrl}/${id}`,
      );

      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Withdrawal not found");
      }

      throw new Error("Failed to fetch withdrawal details");
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const withdrawalService = new WithdrawalService();
