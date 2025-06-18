<template>
  <div class="chicken-box">
    <a-card class="header-section" :bordered="false">
      <div class="title">功能区域</div>
      <h1 class="main-title">鸡乐盒</h1>
      <div class="control-buttons">
        <a-button type="primary" class="start-btn" @click="startFunction" :loading="isPlaying">
          开始
        </a-button>
        <a-button danger class="stop-btn" @click="stopFunction">
          停止
        </a-button>
      </div>
    </a-card>

    <div class="function-grid">
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('j')">鸡</a-button>
        <a-button class="function-btn" @click="playSound('n')">你</a-button>
        <a-button class="function-btn" @click="playSound('t')">太</a-button>
        <a-button class="function-btn" @click="playSound('m')">美</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('唱')">唱</a-button>
        <a-button class="function-btn" @click="playSound('跳')">跳</a-button>
        <a-button class="function-btn" @click="playSound('rp')">rap</a-button>
        <a-button class="function-btn" @click="playSound('lq')">篮球</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('mck')">music</a-button>
        <a-button class="function-btn" @click="playSound('xs')">笑死</a-button>
        <a-button class="function-btn" @click="playSound('哇呵呵')">哇呵呵</a-button>
        <a-button class="function-btn" @click="playSound('喜欢')">喜欢</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('qm')">制作人</a-button>
        <a-button class="function-btn" @click="playSound('djh')">大家好</a-button>
        <a-button class="function-btn" @click="playSound('ws')">我是</a-button>
        <a-button class="function-btn" @click="playSound('坤坤')">鲲鲲</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('ngm')">你干嘛~</a-button>
        <a-button class="function-btn" @click="playSound('hh')">哈哈</a-button>
        <a-button class="function-btn" @click="playSound('ay')">哎哟</a-button>
        <a-button class="function-btn" @click="playSound('nhf')">你好烦~</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn wide-btn" @click="playSound('jntm')">开始吟唱</a-button>
        <a-button class="function-btn" @click="playSound('ngmhhy')">你干嘛哈哈哟</a-button>
        <a-button class="function-btn" @click="playSound('yhhmgn')">哟哈哈嘛干你</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('esj')">二手鸡</a-button>
        <a-button class="function-btn" @click="playSound('rup')">rap鸡</a-button>
        <a-button class="function-btn" @click="playSound('djj')">DJ鸡</a-button>
        <a-button class="function-btn" @click="playSound('xxj')">谢谢鸡</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('jhj')">惊魂鸡</a-button>
        <a-button class="function-btn" @click="playSound('xjj')">仙剑鸡</a-button>
        <a-button class="function-btn" @click="playSound('xnj')">新年鸡</a-button>
        <a-button class="function-btn" @click="playSound('zdj')">战斗鸡</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('thj')">桃花鸡</a-button>
        <a-button class="function-btn" @click="playSound('mrj')">某人鸡</a-button>
        <a-button class="function-btn" @click="playSound('jnj')">江南鸡</a-button>
        <a-button class="function-btn" @click="playSound('jjj')">尖叫鸡</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('bbj')">baby鸡</a-button>
        <a-button class="function-btn" @click="playSound('hxj')">欢喜鸡</a-button>
        <a-button class="function-btn" @click="playSound('yyj')">耶耶鸡</a-button>
        <a-button class="function-btn" @click="playSound('jtm')">鸡太美</a-button>
      </div>
      <!-- 更新部分 -->
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('白娘鸡')">新鸡娘子</a-button>
        <a-button class="function-btn" @click="playSound('欢乐斗鸡主')">欢乐斗鸡主</a-button>
        <a-button class="function-btn" @click="playSound('鸡鸡鸡太美')">鸡鸡鸡太美</a-button>
        <a-button class="function-btn" @click="playSound('鸡你实在太煤')">鸡你实在太煤</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('鸡你太美')">鸡你太美</a-button>
        <a-button class="function-btn" @click="playSound('鸡年等一回')">鸡年等一回</a-button>
        <a-button class="function-btn" @click="playSound('鸡上学')">鸡上学</a-button>
        <a-button class="function-btn" @click="playSound('鸡塘月色')">鸡塘月色</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('鸡r3')">鸡r3</a-button>
        <a-button class="function-btn" @click="playSound('挤尼太霉')">挤尼太霉</a-button>
        <a-button class="function-btn" @click="playSound('鲲乐净土')">鲲乐净土</a-button>
        <a-button class="function-btn" @click="playSound('鲲物')">鲲物</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('老虎鸡')">老虎鸡</a-button>
        <a-button class="function-btn" @click="playSound('你干嘛手机铃声')">手鸡铃声</a-button>
        <a-button class="function-btn" @click="playSound('天鸡预报')">天鸡预报</a-button>
        <a-button class="function-btn" @click="playSound('猪猪侠(鲲版)')">鸡鸡侠</a-button>
      </div>
      <div class="button-row">
        <a-button class="function-btn" @click="playSound('Baby鸡')">Baby鸡2</a-button>
        <a-button class="function-btn" @click="playSound('学鸡叫')">学鸡叫</a-button>
        <a-button class="function-btn" @click="playSound('新说唱Rap')">说唱Rap鸡</a-button>
        <a-button class="function-btn" @click="playSound('爱坤的回忆')">爱坤的回忆</a-button>
      </div>
    </div>
    <audio ref="audioRef" id="audio" src="/src/res/j.mp3" preload="auto"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const isPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

// 音频文件映射
const audioMap: Record<string, string> = {
  'j': '/src/res/j.mp3',
  'n': '/src/res/n.mp3',
  't': '/src/res/t.mp3',
  'm': '/src/res/m.mp3',
  '唱': '/src/res/唱.mp3',
  '跳': '/src/res/跳.mp3',
  'rp': '/src/res/rp.mp3',
  'lq': '/src/res/lq.mp3',
  'mck': '/src/res/mck.mp3',
  'xs': '/src/res/xs.mp3',
  '哇呵呵': '/src/res/哇呵呵.mp3',
  '喜欢': '/src/res/喜欢.mp3',
  'qm': '/src/res/qm.mp3',
  'djh': '/src/res/djh.mp3',
  'ws': '/src/res/ws.mp3',
  '坤坤': '/src/res/坤坤.mp3',
  'ngm': '/src/res/ngm.mp3',
  'hh': '/src/res/hh.mp3',
  'ay': '/src/res/ay.mp3',
  'nhf': '/src/res/nhf.mp3',
  'jntm': '/src/res/jntm.mp3',
  'ngmhhy': '/src/res/ngmhhy.mp3',
  'yhhmgn': '/src/res/yhhmgn.mp3',
  'esj': '/src/res/esj.mp3',
  'rup': '/src/res/rup.mp3',
  'djj': '/src/res/djj.mp3',
  'xxj': '/src/res/xxj.mp3',
  'jhj': '/src/res/jhj.mp3',
  'xjj': '/src/res/xjj.mp3',
  'xnj': '/src/res/xnj.mp3',
  'zdj': '/src/res/zdj.mp3',
  'thj': '/src/res/thj.mp3',
  'mrj': '/src/res/mrj.mp3',
  'jnj': '/src/res/jnj.mp3',
  'jjj': '/src/res/jjj.mp3',
  'bbj': '/src/res/bbj.mp3',
  'hxj': '/src/res/hxj.mp3',
  'yyj': '/src/res/yyj.mp3',
  'jtm': '/src/res/jtm.mp3',
  '白娘鸡': '/src/res/白娘鸡.mp3',
  '欢乐斗鸡主': '/src/res/欢乐斗鸡主.mp3',
  '鸡鸡鸡太美': '/src/res/鸡鸡鸡太美.mp3',
  '鸡你实在太煤': '/src/res/鸡你实在太煤.mp3',
  '鸡你太美': '/src/res/鸡你太美.mp3',
  '鸡年等一回': '/src/res/鸡年等一回.mp3',
  '鸡上学': '/src/res/鸡上学.mp3',
  '鸡塘月色': '/src/res/鸡塘月色.mp3',
  '鸡r3': '/src/res/鸡r3.mp3',
  '挤尼太霉': '/src/res/挤尼太霉.mp3',
  '鲲乐净土': '/src/res/鲲乐净土.mp3',
  '鲲物': '/src/res/鲲物.mp3',
  '老虎鸡': '/src/res/老虎鸡.mp3',
  '你干嘛手机铃声': '/src/res/你干嘛手机铃声.mp3',
  '天鸡预报': '/src/res/天鸡预报.mp3',
  '猪猪侠(鲲版)': '/src/res/猪猪侠(鲲版).mp3',
  'Baby鸡': '/src/res/Baby鸡.mp3',
  '学鸡叫': '/src/res/学鸡叫.mp3',
  '新说唱Rap': '/src/res/新说唱Rap.mp3',
  '爱坤的回忆': '/src/res/爱坤的回忆.mp3'
}

const startFunction = () => {
  isPlaying.value = true
  message.success('鸡乐盒已开始！')
}

const stopFunction = () => {
  isPlaying.value = false
  // 停止当前播放的音频
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
  message.info('鸡乐盒已停止！')
}

const playSound = (sound: string) => {
  try {
    const audioFile = audioMap[sound]
    if (audioFile && audioRef.value) {
      // 停止当前播放的音频
      audioRef.value.pause()
      audioRef.value.currentTime = 0

      // 设置新的音频源
      audioRef.value.src = audioFile

      audioRef.value.play().then(() => {
        // message.success(`正在播放: ${sound}`)
      }).catch((error) => {
        console.error('音频播放失败:', error)
        message.error(`播放失败: ${sound}`)
      })
    } else {
      message.info(`播放: ${sound} (音频文件未找到)`)
    }
  } catch (error) {
    console.error('播放音频时出错:', error)
    message.error(`播放出错: ${sound}`)
  }
}
</script>

<style scoped>
.chicken-box {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 18px;
  color: #666;
  margin: 0 0 10px 0;
  font-weight: 500;
}

.main-title {
  font-size: 32px;
  color: #333;
  margin: 0 0 20px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.start-btn {
  background: #52c41a;
  border-color: #52c41a;
  color: white;
  font-size: 16px;
  height: 40px;
  padding: 0 25px;
  border-radius: 20px;
  font-weight: 500;
}

.start-btn:hover {
  background: #73d13d;
  border-color: #73d13d;
}

.stop-btn {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: white;
  font-size: 16px;
  height: 40px;
  padding: 0 25px;
  border-radius: 20px;
  font-weight: 500;
}

.stop-btn:hover {
  background: #ff7875;
  border-color: #ff7875;
}

.function-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.function-btn {
  flex: 1;
  max-width: 120px;
  height: 50px;
  background: #1890ff;
  border-color: #1890ff;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.function-btn:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3);
}

.function-btn:active {
  transform: translateY(0);
}

.wide-btn {
  max-width: 150px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chicken-box {
    padding: 15px;
    margin: 10px;
  }

  .main-title {
    font-size: 24px;
  }

  .button-row {
    gap: 8px;
  }

  .function-btn {
    font-size: 12px;
    height: 45px;
    max-width: 80px;
  }

  .wide-btn {
    max-width: 100px;
  }
}

@media (max-width: 480px) {
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }

  .start-btn,
  .stop-btn {
    width: 120px;
  }

  .function-btn {
    font-size: 11px;
    height: 40px;
    max-width: 70px;
  }

  .wide-btn {
    max-width: 80px;
  }
}
</style>
