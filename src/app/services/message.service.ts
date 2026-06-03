import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import {
  MessageDto,
  MessageRequestDto,
  MessageUpdateStatusDto,
  MessagesPaginatedResponse,
  MessageStatsDto
} from '../dtos/contact-us/contact-us.dto';

// Filter options for messages
interface MessageFilters {
  page?: number;
  limit?: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private http = inject(HttpClient);

  // ============ Public endpoints (no auth required) ============

  // Create new message - public
  createMessage(model: MessageRequestDto): Observable<ApiResponseDto<{ id: string }>> {
    return this.http.post<ApiResponseDto<{ id: string }>>(ApiAddress.contact, model);
  }

  // ============ Admin endpoints (auth required) ============

  // Get all messages with pagination - admin only
  getMessages(page: number = 1, limit: number = 10, status?: string): Observable<ApiResponseDto<MessagesPaginatedResponse>> {
    const params = this.buildParams({ page, limit, status });
    return this.http.get<ApiResponseDto<MessagesPaginatedResponse>>(ApiAddress.contact, { params });
  }

  // Get message statistics - admin only
  getMessageStats(): Observable<ApiResponseDto<MessageStatsDto>> {
    return this.http.get<ApiResponseDto<MessageStatsDto>>(ApiAddress.contactStats);
  }

  // Get single message by id - admin only
  getMessageById(id: string): Observable<ApiResponseDto<MessageDto>> {
    const url = ApiAddress.getMessageById.replace(':id', id);
    return this.http.get<ApiResponseDto<MessageDto>>(url);
  }

  // Update message status - admin only
  updateMessageStatus(id: string, status: MessageUpdateStatusDto): Observable<ApiResponseDto<{ id: string; status: string }>> {
    const url = ApiAddress.contactUpdateStatus.replace(':id', id);
    return this.http.patch<ApiResponseDto<{ id: string; status: string }>>(url, status);
  }

  // Delete message - admin only
  deleteMessage(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.getMessageById.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }

  // ============ Private helpers ============

  private buildParams(filters: MessageFilters): HttpParams {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '10');

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return params;
  }
}
