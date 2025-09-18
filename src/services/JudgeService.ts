import { type ApiResponse } from "../types/ApiResponse";
import { type JudgeResponse } from "../types/response/judge/JudgeResponse";
import { type JudgeSearchRequest } from "../types/request/judge/JudgeSearchRequest";
import { type JudgeRequest } from "../types/request/judge/JudgeRequest";
import { Connect } from "../connect/Connect";

export class JudgeService {
  static api: string = '/judge';
  static async getAll(): Promise<ApiResponse<JudgeResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<JudgeResponse[]>(
      `${this.api}/all`,
      'GET',
      null,
      token
    );
  }

  static async getTop50(): Promise<ApiResponse<JudgeResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<JudgeResponse[]>(
      `${this.api}/limit-50`,
      'GET',
      null,
      token
    );
  }


  static async search(searchData: JudgeSearchRequest): Promise<ApiResponse<JudgeResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<JudgeResponse[]>(
      `${this.api}/search`,
      'POST',
      searchData,
      token
    )
  }

  static async create(createRequest: JudgeRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/`,
      'POST',
      createRequest,
      token
    );
  }

  static async update(id: string, updateRequest: JudgeRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/${id}`,
      'PUT',
      updateRequest,
      token
    );
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/${id}`,
      'DELETE',
      null,
      token
    );
  }

  static async getAssignableJudges(): Promise<ApiResponse<JudgeResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<JudgeResponse[]>(
      `${this.api}/list-assignment`,
      'GET',
      null,
      token
    );
  }

  static async getMyInfo(): Promise<ApiResponse<JudgeResponse>> {
    const token = localStorage.getItem('token');
    return Connect.request<JudgeResponse>(
      `${this.api}/my-info`,
      'GET',
      null,
      token
    );
  }
}
