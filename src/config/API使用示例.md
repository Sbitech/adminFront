# API使用示例

## 直接调用方式（推荐）

### 1. 登录示例
```javascript
import axios from 'axios';
import { LOGIN_APIS } from '@/config/api.js';

// 裁判登录
const response = await axios.post(LOGIN_APIS.REFEREE_LOGIN, {
  username: 'admin',
  password: 'password'
});

// 管理员登录
const response = await axios.post(LOGIN_APIS.ADMIN_LOGIN, {
  username: 'admin',
  password: 'password'
});
```

### 2. 获取选手列表
```javascript
import axios from 'axios';
import { PLAYER_APIS } from '@/config/api.js';

const response = await axios.get(PLAYER_APIS.GET_PLAYERS);
const players = response.data;
```

### 3. 获取单个选手
```javascript
const playerId = 1;
const response = await axios.get(PLAYER_APIS.GET_PLAYER_BY_ID(playerId));
const player = response.data;
```

### 4. 创建新选手
```javascript
const response = await axios.post(PLAYER_APIS.CREATE_PLAYER, {
  name: '张三',
  gender: 'male',
  age: 25,
  team: '北京队',
  region: '北京',
  id_card: '110101199001011234',
  phone: '13800138000'
});
```

### 5. 获取比赛列表
```javascript
import { MATCH_APIS } from '@/config/api.js';

const response = await axios.get(MATCH_APIS.GET_MATCHES);
const matches = response.data;
```

### 6. 获取AI评分
```javascript
import { SCORE_APIS } from '@/config/api.js';

const response = await axios.get(SCORE_APIS.GET_AI_SCORES);
const aiScores = response.data;
```

### 7. 提交人工评分
```javascript
const response = await axios.post(SCORE_APIS.SUBMIT_MANUAL_SCORE, {
  player_match_id: 123,
  technical_score: 8.5,
  artistic_score: 9.0,
  difficulty_score: 8.8,
  total_score: 8.77,
  deduction: 0.0,
  comments: '动作标准，节奏感好'
});
```

### 8. 获取争议列表
```javascript
import { DISPUTE_APIS } from '@/config/api.js';

const response = await axios.get(DISPUTE_APIS.GET_DISPUTES);
const disputes = response.data;
```

### 9. 创建争议
```javascript
const response = await axios.post(DISPUTE_APIS.CREATE_DISPUTE, {
  final_score_id: 456,
  dispute_type: 'score_error',
  reason: '评分计算有误',
  priority: 'high'
});
```

### 10. 文件上传
```javascript
import { FILE_APIS } from '@/config/api.js';

const formData = new FormData();
formData.append('file', file);

const response = await axios.post(FILE_APIS.UPLOAD_VIDEO, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

## 完整使用示例

```javascript
// 在组件中使用
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { PLAYER_APIS, MATCH_APIS, SCORE_APIS } from '@/config/api.js';

export default {
  setup() {
    const players = ref([]);
    const matches = ref([]);
    const scores = ref([]);

    // 获取数据
    const loadData = async () => {
      try {
        const [playersRes, matchesRes, scoresRes] = await Promise.all([
          axios.get(PLAYER_APIS.GET_PLAYERS),
          axios.get(MATCH_APIS.GET_MATCHES),
          axios.get(SCORE_APIS.GET_AI_SCORES)
        ]);

        players.value = playersRes.data;
        matches.value = matchesRes.data;
        scores.value = scoresRes.data;
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };

    // 创建新选手
    const createPlayer = async (playerData) => {
      try {
        const response = await axios.post(PLAYER_APIS.CREATE_PLAYER, playerData);
        players.value.push(response.data);
      } catch (error) {
        console.error('创建选手失败:', error);
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      players,
      matches,
      scores,
      createPlayer
    };
  }
};
```

## 错误处理示例

```javascript
const handleLogin = async (username, password) => {
  try {
    const response = await axios.post(LOGIN_APIS.REFEREE_LOGIN, {
      username,
      password
    });
    
    // 成功处理
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    // 错误处理
    if (error.response) {
      // 服务器响应错误
      console.error('登录失败:', error.response.data.message);
    } else if (error.request) {
      // 网络错误
      console.error('网络错误，请检查服务器连接');
    } else {
      // 其他错误
      console.error('请求错误:', error.message);
    }
    throw error;
  }
};
```