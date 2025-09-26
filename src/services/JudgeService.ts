import { type ApiResponse } from "../types/ApiResponse";
import { type PageResponse } from "../types/response/PageResponse";
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


  static async search(
    searchData: JudgeSearchRequest,
    page: number = 0,
    size: number = 10,
    sort: string = "fullName"
  ): Promise<ApiResponse<PageResponse<JudgeResponse>>> {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort);
    
    return Connect.request<PageResponse<JudgeResponse>>(
      `${this.api}/search?${params.toString()}`,
      'POST',
      searchData,
      token
    );
  }

  static async create(createRequest: JudgeRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}`,
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
