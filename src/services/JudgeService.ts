import { type ApiResponse } from "../types/ApiResponse";
import { type JudgeResponse } from "../types/response/judge/JudgeResponse";
import { type JudgeSearchRequest } from "../types/request/judge/JudgeSearchRequest";
import { type JudgeRequest, type JudgeCreateRequest } from "../types/request/judge/JudgeRequest";
import { Connect } from "../connect/Connect";

export class JudgeService {
  static async getAll(): Promise<ApiResponse<JudgeResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/judge/all',
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async search(judgeSearch: JudgeSearchRequest): Promise<ApiResponse<JudgeResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/judge/search',
        'POST',
        judgeSearch,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async create(createRequest: JudgeCreateRequest): Promise<ApiResponse<JudgeResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/judge/',
        'POST',
        createRequest,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async update(judgeId: string, updateRequest: Omit<JudgeRequest, 'email'>): Promise<ApiResponse<JudgeResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/judge/${judgeId}`,
        'PUT',
        updateRequest,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async delete(judgeId: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/judge/${judgeId}`,
        'DELETE',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async getById(judgeId: string): Promise<ApiResponse<JudgeResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/judge/${judgeId}`,
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
