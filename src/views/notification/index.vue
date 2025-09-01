<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">消息通知</h1>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4 stat-card">
          <v-icon size="48" color="primary" class="mb-2">mdi-bell</v-icon>
          <div class="text-h4">{{ totalCount }}</div>
          <div>总通知</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4 stat-card">
          <v-icon size="48" color="warning" class="mb-2">mdi-bell-alert</v-icon>
          <div class="text-h4">{{ unreadCount }}</div>
          <div>未读通知</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4 stat-card">
          <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
          <div class="text-h4">{{ readCount }}</div>
          <div>已读通知</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4 stat-card">
          <v-icon size="48" color="info" class="mb-2">mdi-clock</v-icon>
          <div class="text-h4">{{ todayCount }}</div>
          <div>今日通知</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>通知列表</span>
            <div>
              <v-btn color="primary" small @click="markAllAsRead" :disabled="unreadCount === 0">
                全部已读
              </v-btn>
              <v-btn color="error" small text @click="clearAll" class="ml-2" :disabled="notifications.length === 0">
                清空
              </v-btn>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="notifications.length > 0">
              <v-list-item v-for="notification in notifications" :key="notification.id" two-line class="notification-item">
                <v-list-item-avatar>
                  <v-icon :color="getNotificationColor(notification.type)">
                    {{ getNotificationIcon(notification.type) }}
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center">
                    {{ notification.title }}
                    <v-chip v-if="!notification.read" x-small color="primary" class="ml-2">新</v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ notification.content }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="d-flex flex-row align-center" style="min-width: 120px;">
                  <v-btn
                    v-if="!notification.read"
                    color="success"
                    x-small
                    @click="markAsRead(notification)"
                    class="mr-2 action-btn"
                    style="min-width: 50px; font-size: 11px; font-weight: 500;"
                  >
                    已读
                  </v-btn>
                  <v-btn
                    color="error"
                    x-small
                    @click="deleteNotification(notification)"
                    class="action-btn"
                    style="min-width: 50px; font-size: 11px; font-weight: 500;"
                  >
                    删除
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <div v-else class="text-center pa-8">
              <v-icon size="64" color="grey" class="mb-4">mdi-bell-off</v-icon>
              <div>暂无通知</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotificationPage',
  data() {
    return {
      notifications: [
        {
          id: 1,
          title: '系统更新通知',
          content: '系统将于今晚22:00-23:00进行例行维护，请提前做好数据备份工作。',
          type: 'system',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          title: '评分任务提醒',
          content: '您有新的武术套路评分任务，选手：张三，项目：长拳，请及时处理。',
          type: 'score',
          read: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          title: '争议处理完成',
          content: '您提交的争议复核申请已处理完成，处理结果：维持原评分。',
          type: 'dispute',
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          title: '数据备份成功',
          content: '今日数据备份任务已完成，备份时间：2024-01-15 02:00，备份大小：156MB。',
          type: 'backup',
          read: true,
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 5,
          title: '用户反馈回复',
          content: '您提交的用户反馈已收到回复，请查看详情。',
          type: 'user',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ]
    }
  },
  computed: {
    totalCount() {
      return this.notifications.length
    },
    unreadCount() {
      return this.notifications.filter(n => !n.read).length
    },
    readCount() {
      return this.notifications.filter(n => n.read).length
    },
    todayCount() {
      const today = new Date().toDateString()
      return this.notifications.filter(n => 
        new Date(n.createdAt).toDateString() === today
      ).length
    }
  },
  methods: {
      getNotificationColor(type) {
        const colors = {
          system: 'primary',
          score: 'warning',
          dispute: 'error',
          backup: 'success',
          user: 'info'
        }
        return colors[type] || 'grey'
      },
      getNotificationIcon(type) {
        const icons = {
          system: 'mdi-cog',
          score: 'mdi-scoreboard',
          dispute: 'mdi-alert-circle',
          backup: 'mdi-backup-restore',
          user: 'mdi-account'
        }
        return icons[type] || 'mdi-bell'
      },
      markAsRead(notification) {
        const index = this.notifications.findIndex(n => n.id === notification.id)
        if (index > -1) {
          this.notifications[index].read = true
        }
      },
      markAllAsRead() {
        this.notifications.forEach(n => n.read = true)
      },
      deleteNotification(notification) {
        const index = this.notifications.findIndex(n => n.id === notification.id)
        if (index > -1) {
          this.notifications.splice(index, 1)
        }
      },
      clearAll() {
        this.notifications = []
      }
    }
}
</script>
  
  <style scoped>
  /* 通知页面整体卡片样式 - 与其他页面保持一致 */
  .v-card {
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: none;
  }

  /* 统计卡片悬浮效果 - 与首页保持一致 */
  .stat-card {
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  
  .notification-item {
    transition: background-color 0.3s ease, transform 0.3s, box-shadow 0.3s;
    border-radius: 8px;
    margin: 4px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .notification-item:hover {
    background-color: rgba(66, 184, 131, 0.08);
    border-radius: 8px;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .notification-item.unread {
    background-color: rgba(66, 184, 131, 0.05);
    border-left: 3px solid #42b883;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(66, 184, 131, 0.1);
  }
  
  .notification-item.unread:hover {
    background-color: rgba(66, 184, 131, 0.1);
    border-radius: 8px;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 184, 131, 0.15);
  }
  
  .v-list-item-action {
    gap: 8px;
    justify-content: flex-end;
  }
  
  .action-btn {
    padding: 0 8px !important;
    height: 26px !important;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s, transform 0.2s;
  }
  
  .action-btn:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transform: translateY(-1px);
  }
  </style>