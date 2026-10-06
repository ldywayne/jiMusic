export type SoundCategory = '经典语录' | '鬼畜音效' | '整活单曲'

export interface Sound {
  id: string
  name: string
  category: SoundCategory
  url: string
  shortcut?: string
}

// Vite emits these files with production-safe, base-aware asset URLs.
const assets = import.meta.glob<string>('../res/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
})

const entries: [string, string, SoundCategory][] = [
  ['j', '鸡', '经典语录'],
  ['n', '你', '经典语录'],
  ['t', '太', '经典语录'],
  ['m', '美', '经典语录'],
  ['唱', '唱', '经典语录'],
  ['跳', '跳', '经典语录'],
  ['rp', 'rap', '经典语录'],
  ['lq', '篮球', '经典语录'],
  ['mck', 'music', '经典语录'],
  ['xs', '笑死', '经典语录'],
  ['哇呵呵', '哇呵呵', '经典语录'],
  ['喜欢', '喜欢', '经典语录'],
  ['qm', '制作人', '经典语录'],
  ['djh', '大家好', '经典语录'],
  ['ws', '我是', '经典语录'],
  ['坤坤', '鲲鲲', '经典语录'],
  ['ngm', '你干嘛~', '经典语录'],
  ['hh', '哈哈', '经典语录'],
  ['ay', '哎哟', '经典语录'],
  ['nhf', '你好烦~', '经典语录'],
  ['jntm', '开始吟唱', '鬼畜音效'],
  ['ngmhhy', '你干嘛哈哈哟', '鬼畜音效'],
  ['yhhmgn', '哟哈哈嘛干你', '鬼畜音效'],
  ['esj', '二手鸡', '鬼畜音效'],
  ['rup', 'rap鸡', '鬼畜音效'],
  ['djj', 'DJ鸡', '鬼畜音效'],
  ['xxj', '谢谢鸡', '鬼畜音效'],
  ['jhj', '惊魂鸡', '鬼畜音效'],
  ['xjj', '仙剑鸡', '鬼畜音效'],
  ['xnj', '新年鸡', '鬼畜音效'],
  ['zdj', '战斗鸡', '鬼畜音效'],
  ['thj', '桃花鸡', '鬼畜音效'],
  ['mrj', '某人鸡', '鬼畜音效'],
  ['jnj', '江南鸡', '鬼畜音效'],
  ['jjj', '尖叫鸡', '鬼畜音效'],
  ['bbj', 'baby鸡', '鬼畜音效'],
  ['hxj', '欢喜鸡', '鬼畜音效'],
  ['yyj', '耶耶鸡', '鬼畜音效'],
  ['jtm', '鸡太美', '鬼畜音效'],
  ['白娘鸡', '新鸡娘子', '整活单曲'],
  ['欢乐斗鸡主', '欢乐斗鸡主', '整活单曲'],
  ['鸡鸡鸡太美', '鸡鸡鸡太美', '整活单曲'],
  ['鸡你实在太煤', '鸡你实在太煤', '整活单曲'],
  ['鸡你太美', '鸡你太美', '整活单曲'],
  ['鸡年等一回', '鸡年等一回', '整活单曲'],
  ['鸡上学', '鸡上学', '整活单曲'],
  ['鸡塘月色', '鸡塘月色', '整活单曲'],
  ['鸡r3', '鸡r3', '整活单曲'],
  ['挤尼太霉', '挤尼太霉', '整活单曲'],
  ['鲲乐净土', '鲲乐净土', '整活单曲'],
  ['鲲物', '鲲物', '整活单曲'],
  ['老虎鸡', '老虎鸡', '整活单曲'],
  ['你干嘛手机铃声', '手鸡铃声', '整活单曲'],
  ['天鸡预报', '天鸡预报', '整活单曲'],
  ['猪猪侠(鲲版)', '鸡鸡侠', '整活单曲'],
  ['Baby鸡', 'Baby鸡2', '整活单曲'],
  ['学鸡叫', '学鸡叫', '整活单曲'],
  ['新说唱Rap', '说唱Rap鸡', '整活单曲'],
  ['爱坤的回忆', '爱坤的回忆', '整活单曲'],
]

export const sounds: readonly Sound[] = entries.map(([id, name, category], index) => {
  const url = assets[`../res/${id}.mp3`]
  if (!url) throw new Error(`Missing sound asset: ${id}`)
  return { id, name, category, url, shortcut: index < 4 ? String(index + 1) : undefined }
})

export const featuredSounds = sounds.slice(0, 4)
export const categories: readonly SoundCategory[] = ['经典语录', '鬼畜音效', '整活单曲']
