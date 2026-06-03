// ==================== Upload DTOs ====================

export interface UploadResponseDto {
  url: string;
  publicId?: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
}

export interface UploadRequestDto {
  base64?: string;
  file?: File;
}
