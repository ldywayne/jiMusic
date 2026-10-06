import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { compileScript, parse } from '@vue/compiler-sfc'
import * as vue from 'vue'
import ts from 'typescript'

const compile = (source) =>
  ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
const timeExports = {}
runInNewContext(
  compile(readFileSync(new URL('../src/utils/playbackTime.ts', import.meta.url), 'utf8')),
  { exports: timeExports },
)
const source = readFileSync(
  new URL('../src/components/soundboard/PlaybackTimeline.vue', import.meta.url),
  'utf8',
)
const { descriptor } = parse(source)
const componentExports = {}
runInNewContext(compile(compileScript(descriptor, { id: 'timeline-test' }).content), {
  exports: componentExports,
  require: (name) => {
    if (name === 'vue') return vue
    if (name === '@/utils/playbackTime') return timeExports
    throw new Error(`Unexpected import: ${name}`)
  },
})

function setup() {
  const props = vue.reactive({ currentTime: 0, duration: 0.261, disabled: false, soundId: 'n' })
  const emitted = []
  const scope = vue.effectScope()
  // This focused control has no DOM or lifecycle dependencies; use real Vue reactivity.
  const control = scope.run(() =>
    componentExports.default.setup(props, {
      expose: () => {},
      emit: (name, value) => {
        emitted.push({ name, value })
        if (name === 'seek') props.currentTime = value
      },
    }),
  )
  return { props, control, emitted, cleanup: () => scope.stop() }
}

test('drag preview survives incoming clock updates and emits precise sub-second seeks', () => {
  const { props, control, emitted, cleanup } = setup()
  control.previewTime.value = 0.04
  props.currentTime = 0.1
  assert.equal(control.displayedTime.value, 0.04)
  control.seek({ target: { value: '0.075' } })
  assert.equal(emitted[0].value, 0.075)
  assert.equal(control.displayedTime.value, 0.075)
  assert.equal(control.elapsedLabel.value, '0:00.07')
  control.finishPreview()
  assert.equal(control.displayedTime.value, props.currentTime)
  cleanup()
})

test('switching audio or disabling seeking cancels a previous drag preview', async () => {
  const { props, control, cleanup } = setup()
  control.previewTime.value = 0.2
  props.soundId = 'long'
  props.duration = 145.28
  props.currentTime = 0
  await vue.nextTick()
  assert.equal(control.displayedTime.value, 0)
  assert.equal(control.durationLabel.value, '2:25')
  control.previewTime.value = 9
  props.disabled = true
  await vue.nextTick()
  assert.equal(control.previewTime.value, null)
  cleanup()
})

test('the visual fill uses the current duration, clamps its bounds and handles unknown duration', () => {
  const { props, control, cleanup } = setup()
  props.duration = 1
  props.currentTime = 0.25
  assert.equal(control.progressStyle.value['--progress'], '25%')
  props.duration = 2
  assert.equal(control.progressStyle.value['--progress'], '12.5%')
  props.currentTime = 3
  assert.equal(control.progressStyle.value['--progress'], '100%')
  props.duration = 0
  assert.equal(control.progressStyle.value['--progress'], '0%')
  assert.equal(control.durationLabel.value, '—:—')
  cleanup()
})
