const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Quotes
export const getQuotes = () => request<any[]>('/quotes');
export const getRandomQuote = () => request<any>('/quotes/random');
export const createQuote = (data: any) => request<any>('/quotes', { method: 'POST', body: JSON.stringify(data) });
export const updateQuote = (id: number, data: any) => request<any>(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteQuote = (id: number) => request<any>(`/quotes/${id}`, { method: 'DELETE' });

// Years
export const getYears = () => request<number[]>('/years');
export const createYear = (year: number) => request<any>('/years', { method: 'POST', body: JSON.stringify({ year }) });

// Daily Logs
export const getDailyLogs = (year?: number) => request<any[]>(`/daily-logs${year ? `?year=${year}` : ''}`);
export const createDailyLog = (data: any) => request<any>('/daily-logs', { method: 'POST', body: JSON.stringify(data) });
export const updateDailyLog = (id: number, data: any) => request<any>(`/daily-logs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDailyLog = (id: number) => request<any>(`/daily-logs/${id}`, { method: 'DELETE' });

// Daily Reflections
export const getDailyReflections = (year?: number) => request<any[]>(`/daily-reflections${year ? `?year=${year}` : ''}`);
export const createDailyReflection = (data: any) => request<any>('/daily-reflections', { method: 'POST', body: JSON.stringify(data) });
export const updateDailyReflection = (id: number, data: any) => request<any>(`/daily-reflections/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDailyReflection = (id: number) => request<any>(`/daily-reflections/${id}`, { method: 'DELETE' });

// Todos
export const getTodos = (year?: number) => request<any[]>(`/todos${year ? `?year=${year}` : ''}`);
export const createTodo = (data: any) => request<any>('/todos', { method: 'POST', body: JSON.stringify(data) });
export const updateTodo = (id: number, data: any) => request<any>(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTodo = (id: number) => request<any>(`/todos/${id}`, { method: 'DELETE' });

// Content pages
const contentAPI = (prefix: string) => ({
  list: () => request<any[]>(`/${prefix}`),
  create: (data: any) => request<any>(`/${prefix}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/${prefix}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/${prefix}/${id}`, { method: 'DELETE' }),
});

export const investmentsApi = contentAPI('investments');
export const readingsApi = contentAPI('readings');
export const reflectionsApi = contentAPI('reflections');
