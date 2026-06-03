import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import {Address, CreateAddressRequest, UpdateAddressRequest} from '../dtos/address/address.dto';



@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);

  getMyAddresses(): Observable<ApiResponseDto<Address[]>> {
    return this.http.get<ApiResponseDto<Address[]>>(ApiAddress.getAddresses);
  }

  createAddress(data: CreateAddressRequest): Observable<ApiResponseDto<Address>> {
    return this.http.post<ApiResponseDto<Address>>(ApiAddress.createAddress, data);
  }

  updateAddress(id: string, data: UpdateAddressRequest): Observable<ApiResponseDto<Address>> {
    const url = ApiAddress.updateAddress.replace(':id', id);
    return this.http.put<ApiResponseDto<Address>>(url, data);
  }

  deleteAddress(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.deleteAddress.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }

  setDefaultAddress(id: string): Observable<ApiResponseDto<Address>> {
    const url = ApiAddress.setDefaultAddress.replace(':id', id);
    return this.http.patch<ApiResponseDto<Address>>(url, {});
  }
}
