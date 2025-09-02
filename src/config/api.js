// API配置中心
// 所有后端API地址统一管理

const API_BASE_URL = 'http://localhost:9091';

// 登录相关API
export const LOGIN_APIS = {
  REFEREE_LOGIN: `${API_BASE_URL}/referee/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  USER_LOGIN: `${API_BASE_URL}/user/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`
};

// 用户管理API
export const USER_APIS = {
  GET_USERS: `${API_BASE_URL}/users`,
  GET_USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  CREATE_USER: `${API_BASE_URL}/users`,
  UPDATE_USER: (id) => `${API_BASE_URL}/users/${id}`,
  DELETE_USER: (id) => `${API_BASE_URL}/users/${id}`
};

// 选手管理API
export const PLAYER_APIS = {
  GET_PLAYERS: `${API_BASE_URL}/players`,
  GET_PLAYER_BY_ID: (id) => `${API_BASE_URL}/players/${id}`,
  CREATE_PLAYER: `${API_BASE_URL}/players`,
  UPDATE_PLAYER: (id) => `${API_BASE_URL}/players/${id}`,
  DELETE_PLAYER: (id) => `${API_BASE_URL}/players/${id}`
};

// 比赛管理API
export const MATCH_APIS = {
  GET_MATCHES: `${API_BASE_URL}/matches`,
  GET_MATCH_BY_ID: (id) => `${API_BASE_URL}/matches/${id}`,
  CREATE_MATCH: `${API_BASE_URL}/matches`,
  UPDATE_MATCH: (id) => `${API_BASE_URL}/matches/${id}`,
  DELETE_MATCH: (id) => `${API_BASE_URL}/matches/${id}`
};

// 评分相关API
export const SCORE_APIS = {
  GET_AI_SCORES: `${API_BASE_URL}/ai-scores`,
  GET_MANUAL_SCORES: `${API_BASE_URL}/manual-scores`,
  SUBMIT_MANUAL_SCORE: `${API_BASE_URL}/manual-scores`,
  GET_FINAL_SCORES: `${API_BASE_URL}/final-scores`
};

// 争议处理API
export const DISPUTE_APIS = {
  GET_DISPUTES: `${API_BASE_URL}/disputes`,
  GET_DISPUTE_BY_ID: (id) => `${API_BASE_URL}/disputes/${id}`,
  CREATE_DISPUTE: `${API_BASE_URL}/disputes`,
  UPDATE_DISPUTE: (id) => `${API_BASE_URL}/disputes/${id}`
};

// 系统配置API
export const SYSTEM_APIS = {
  GET_SETTINGS: `${API_BASE_URL}/settings`,
  UPDATE_SETTINGS: `${API_BASE_URL}/settings`,
  GET_BACKUPS: `${API_BASE_URL}/backups`,
  CREATE_BACKUP: `${API_BASE_URL}/backups`
};

// 文件上传API
export const FILE_APIS = {
  UPLOAD_VIDEO: `${API_BASE_URL}/upload/video`,
  UPLOAD_IMAGE: `${API_BASE_URL}/upload/image`,
  UPLOAD_FILE: `${API_BASE_URL}/upload/file`
};

// 导出基础URL
export { API_BASE_URL };