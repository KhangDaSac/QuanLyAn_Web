import { type ApiResponse } from "../types/ApiResponse";
import { type TypeOfLegalCaseResponse } from "../types/response/legal-case/TypeOfLegalCaseResponse";
import { Connect } from "../connect/Connect";
import { type TypeOfLegalCaseRequest } from "../types/request/type-of-legal-case/TypeOfLegalCaseRequest";

export class TypeOfLegalCaseService {
  static api: string = '/type-of-legal-case';

  static async top50(): Promise<ApiResponse<TypeOfLegalCaseResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `${this.api}/top-50`,
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async create(request: TypeOfLegalCaseRequest): Promise<ApiResponse<TypeOfLegalCaseResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `${this.api}/`,
        'POST',
        request,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async update(id: string, request: TypeOfLegalCaseRequest): Promise<ApiResponse<TypeOfLegalCaseResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `${this.api}/${id}`,
        'PUT',
        request,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `${this.api}/${id}`,
        'DELETE',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }


  static async getAll(): Promise<ApiResponse<TypeOfLegalCaseResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `${this.api}/all`,
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}