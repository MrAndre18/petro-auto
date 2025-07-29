import type {
  LayeredMenuConfig,
  LayeredMenuEvent,
  LayeredMenuEventHandler,
  MenuLayerKey,
  LayerChangePayload
} from './types'
import { getAnimation } from './animations'
import { gsap } from 'gsap'

// Минималистичный EventEmitter
class EventEmitter {
  private listeners: Map<LayeredMenuEvent, Set<LayeredMenuEventHandler>> = new Map()

  on(event: LayeredMenuEvent, handler: LayeredMenuEventHandler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(handler)
  }

  off(event: LayeredMenuEvent, handler: LayeredMenuEventHandler) {
    this.listeners.get(event)?.delete(handler)
  }

  emit(event: LayeredMenuEvent, payload: LayerChangePayload) {
    this.listeners.get(event)?.forEach(fn => fn(payload))
  }
}

export class LayeredMenu {
  private root: HTMLElement
  private config: LayeredMenuConfig
  private layers: Map<MenuLayerKey, HTMLElement> = new Map()
  private currentLayerKey: MenuLayerKey | null = null
  private emitter = new EventEmitter()
  private resizeHandler = () => this.handleResize()
  private layerHistory: MenuLayerKey[] = []
  private parentMap: Map<MenuLayerKey, MenuLayerKey | null> = new Map()
  private touchData: { x: number; y: number; time: number } | null = null

  constructor(rootSelector: string | HTMLElement, config: LayeredMenuConfig = {}) {
    this.root = typeof rootSelector === 'string'
      ? document.querySelector(rootSelector) as HTMLElement
      : rootSelector
    if (!this.root) throw new Error('LayeredMenu: root element not found')
    this.config = config
    this.setupGlobalEvents()
  }

  /**
   * Инициализация: собирает слои, проверяет уникальность, показывает первый слой
   */
  init() {
    try {
      this.collectLayers()
      this.currentLayerKey = this.getFirstLayerKey()
      this.showLayer(this.currentLayerKey, null, 'none')
      this.emitter.emit('onInit', this.makePayload(null, this.currentLayerKey, 'none', 'before'))
      this.attachHandlers()
      this.initSwipeHandlers(this.currentLayerKey)
      window.addEventListener('resize', this.resizeHandler)
    } catch (error) {
      this.handleError(error as Error, 'init')
    }
  }

  /**
   * Переинициализация (например, при изменении DOM)
   */
  reinit() {
    try {
      this.detachHandlers()
      this.collectLayers()
      this.currentLayerKey = this.getFirstLayerKey()
      this.showLayer(this.currentLayerKey, null, 'none')
      this.emitter.emit('onReinit', this.makePayload(null, this.currentLayerKey, 'none', 'before'))
      this.attachHandlers()
      this.initSwipeHandlers(this.currentLayerKey)
    } catch (error) {
      this.handleError(error as Error, 'reinit')
    }
  }

  /**
   * Полная очистка
   */
  destroy() {
    try {
      this.detachHandlers()
      if (this.currentLayerKey) this.removeSwipeHandlers(this.currentLayerKey)
      this.layers.clear()
      this.currentLayerKey = null
      this.emitter.emit('onDestroy', this.makePayload(null, null, 'none', 'before'))
      window.removeEventListener('resize', this.resizeHandler)
    } catch (error) {
      this.handleError(error as Error, 'destroy')
    }
  }

  /**
   * Переход к слою по ключу или относительному смещению
   */
  setLayer(layer: MenuLayerKey | number, isBack = false) {
    try {
      const prevKey = this.currentLayerKey
      let nextKey: MenuLayerKey | null = null
      if (typeof layer === 'number') {
        const keys = Array.from(this.layers.keys())
        const idx = prevKey ? keys.indexOf(prevKey) : 0
        const nextIdx = Math.max(0, Math.min(keys.length - 1, idx + layer))
        nextKey = keys[nextIdx]
      } else {
        nextKey = layer
      }
      if (!nextKey || !this.layers.has(nextKey)) throw new Error(`LayeredMenu: layer '${nextKey}' not found`)
      if (nextKey === prevKey) return

      // Проверка allowDirectAccess
      const layerConfig = this.config.layers?.[nextKey]
      if (layerConfig?.allowDirectAccess === false && !isBack) {
        throw new Error(`LayeredMenu: direct access to layer '${nextKey}' is not allowed`)
      }

      const direction = this.getDirection(prevKey, nextKey)
      this.emitter.emit('onBeforeLayerChange', this.makePayload(prevKey, nextKey, direction, 'before'))
      this.showLayer(nextKey, prevKey, direction)
      // Перевешиваем свайп-обработчики
      if (prevKey) this.removeSwipeHandlers(prevKey)
      this.initSwipeHandlers(nextKey)
      // История переходов
      if (!isBack && prevKey) {
        this.layerHistory.push(prevKey)
      } else if (isBack) {
        // При возврате назад pop-аем
        this.layerHistory.pop()
      }
      this.currentLayerKey = nextKey
      this.emitter.emit('onLayerChange', this.makePayload(prevKey, nextKey, direction, 'after'))
      this.emitter.emit('onAfterLayerChange', this.makePayload(prevKey, nextKey, direction, 'after'))
    } catch (error) {
      this.handleError(error as Error, 'setLayer')
    }
  }

  /**
   * Возврат к первому слою
   */
  reset() {
    try {
      const firstKey = this.getFirstLayerKey()
      if (firstKey && firstKey !== this.currentLayerKey) {
        if (this.currentLayerKey) this.removeSwipeHandlers(this.currentLayerKey)
        this.setLayer(firstKey)
      }
    } catch (error) {
      this.handleError(error as Error, 'reset')
    }
  }

  /**
   * Подписка на события
   */
  on(event: LayeredMenuEvent, handler: LayeredMenuEventHandler) {
    this.emitter.on(event, handler)
  }
  off(event: LayeredMenuEvent, handler: LayeredMenuEventHandler) {
    this.emitter.off(event, handler)
  }

  private handleResize() {
    // Обработка изменения размера окна
  }

  private setupGlobalEvents() {
    // Настройка глобальных событий из конфига
    if (this.config.events) {
      Object.entries(this.config.events).forEach(([event, handler]) => {
        this.on(event as LayeredMenuEvent, handler)
      })
    }
  }

  private handleError(error: Error, context: string) {
    if (this.config.onError) {
      this.config.onError(error, { context, currentLayerKey: this.currentLayerKey })
    } else {
      console.error(`LayeredMenu error in ${context}:`, error)
    }
  }

  // --- Внутренние методы ---

  /**
   * Собирает все слои по data-menu-layer, проверяет уникальность
   */
  private collectLayers() {
    this.layers.clear()
    this.parentMap.clear()
    const nodes = this.root.querySelectorAll<HTMLElement>('[data-menu-layer]')
    nodes.forEach(node => {
      const key = node.getAttribute('data-menu-layer')
      if (!key) throw new Error('LayeredMenu: data-menu-layer is required')
      if (this.layers.has(key)) throw new Error(`LayeredMenu: duplicate data-menu-layer '${key}'`)
      this.layers.set(key, node)
      const parent = node.getAttribute('data-menu-parent')
      this.parentMap.set(key, parent && parent !== '' ? parent : null)

      // Применяем конфиг слоя (className, style)
      const layerConfig = this.config.layers?.[key]
      if (layerConfig) {
        if (layerConfig.className) {
          node.classList.add(layerConfig.className)
        }
        if (layerConfig.style) {
          Object.assign(node.style, layerConfig.style)
        }
      }
    })
  }

  /**
   * Возвращает ключ первого слоя (первый найденный)
   */
  private getFirstLayerKey(): MenuLayerKey | null {
    return this.layers.size ? Array.from(this.layers.keys())[0] : null
  }

  private getParentKey(key: MenuLayerKey | null): MenuLayerKey | null {
    if (!key) return null
    return this.parentMap.get(key) ?? null
  }

  // --- Slide/cards/fade анимации ---
  private showLayer(nextKey: MenuLayerKey | null, prevKey: MenuLayerKey | null, direction: 'forward' | 'backward' | 'none') {
    if (!nextKey) return
    const nextLayer = this.layers.get(nextKey)
    const prevLayer = prevKey ? this.layers.get(prevKey) : null
    const animType = this.getAnimationTypeForLayer(nextKey)
    if ((animType === 'slide' || animType === 'cards' || animType === 'fade') && prevLayer && nextLayer && direction !== 'none') {
      const anim = getAnimation(animType as any)
      anim.animateTransition(prevLayer, nextLayer, direction)
    } else {
      // Без анимации (init/reset)
      this.layers.forEach((el, key) => {
        gsap.set(el, { clearProps: 'x,opacity' })
        el.style.opacity = key === nextKey ? '1' : '0'
        el.style.pointerEvents = key === nextKey ? 'auto' : 'none'
        el.style.visibility = key === nextKey ? 'visible' : 'hidden'
        el.style.zIndex = ''
      })
    }
  }

  private getAnimationTypeForLayer(key: MenuLayerKey): string {
    // Анимация теперь только глобальная
    return this.config.animation?.type || 'slide'
  }

  /**
   * Определяет направление перехода
   */
  private getDirection(prevKey: MenuLayerKey | null, nextKey: MenuLayerKey | null): 'forward' | 'backward' | 'none' {
    if (!prevKey || !nextKey) return 'none'
    const keys = Array.from(this.layers.keys())
    const prevIdx = keys.indexOf(prevKey)
    const nextIdx = keys.indexOf(nextKey)
    if (nextIdx > prevIdx) return 'forward'
    if (nextIdx < prevIdx) return 'backward'
    return 'none'
  }

  /**
   * Формирует payload для событий
   */
  private makePayload(
    prevKey: MenuLayerKey | null,
    currentKey: MenuLayerKey | null,
    direction: 'forward' | 'backward' | 'none',
    context: 'before' | 'after' | 'change'
  ): LayerChangePayload {
    const keys = Array.from(this.layers.keys())
    const prevLayerIndex = prevKey ? keys.indexOf(prevKey) : -1
    const currentLayerIndex = currentKey ? keys.indexOf(currentKey) : -1
    return {
      prevLayer: prevKey ? this.layers.get(prevKey) ?? null : null,
      currentLayer: currentKey ? this.layers.get(currentKey) ?? null : null,
      prevLayerKey: prevKey,
      currentLayerKey: currentKey,
      direction,
      prevLayerIndex,
      currentLayerIndex,
    }
  }

  /**
   * Навешивает обработчики на data-menu-next/data-menu-prev
   */
  private attachHandlers() {
    this.root.addEventListener('click', this.handleClick)
  }
  private detachHandlers() {
    this.root.removeEventListener('click', this.handleClick)
  }
  private handleClick = (e: Event) => {
    const target = e.target as HTMLElement
    const next = target.closest('[data-menu-next]') as HTMLElement | null
    const prev = target.closest('[data-menu-prev]') as HTMLElement | null
    if (next) {
      e.preventDefault()
      const key = next.getAttribute('data-menu-next')
      if (key) this.setLayer(key)
    } else if (prev) {
      e.preventDefault()
      const key = prev.getAttribute('data-menu-prev')
      if (key) this.setLayer(key)
    }
  }

  private initSwipeHandlers(layerKey?: MenuLayerKey | null) {
    if (window.innerWidth > 1200) return;
    const key = layerKey ?? this.currentLayerKey;
    if (!key) return;
    const layer = this.layers.get(key);
    if (!layer) return;

    // Проверяем, разрешены ли свайпы для этого слоя
    const layerConfig = this.config.layers?.[key];
    const globalSwipeEnabled = this.config.swipeEnabled ?? true;
    const layerSwipeEnabled = layerConfig?.swipeEnabled ?? globalSwipeEnabled;

    if (!layerSwipeEnabled) return;

    layer.addEventListener('touchstart', this.onTouchStart);
    layer.addEventListener('touchmove', this.onTouchMove);
    layer.addEventListener('touchend', this.onTouchEnd);
  }

  private removeSwipeHandlers(layerKey?: MenuLayerKey | null) {
    const key = layerKey ?? this.currentLayerKey;
    if (!key) return;
    const layer = this.layers.get(key);
    if (!layer) return;
    layer.removeEventListener('touchstart', this.onTouchStart);
    layer.removeEventListener('touchmove', this.onTouchMove);
    layer.removeEventListener('touchend', this.onTouchEnd);
  }

  private onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    this.touchData = { x: t.clientX, y: t.clientY, time: Date.now() };
  }

  private onTouchMove = (e: TouchEvent) => { }

  private onTouchEnd = (e: TouchEvent) => {
    if (!this.touchData) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - this.touchData.x;
    const dt = Date.now() - this.touchData.time;
    const absDx = Math.abs(dx);
    const velocity = absDx / dt;
    const threshold = 50;
    const minVelocity = 0.3;
    if (absDx > threshold && velocity > minVelocity) {
      if (dx > 0) {
        // swipe right (назад)
        const parentKey = this.getParentKey(this.currentLayerKey);
        if (parentKey) this.setLayer(parentKey, true);
      } else if (dx < 0) {
        // swipe left (вперёд)
        // ищем все data-menu-next на текущем слое
        const currentLayer = this.currentLayerKey ? this.layers.get(this.currentLayerKey) : null;
        if (currentLayer) {
          const nextBtns = currentLayer.querySelectorAll('[data-menu-next]');
          if (nextBtns.length === 1) {
            const key = nextBtns[0].getAttribute('data-menu-next');
            if (key) this.setLayer(key);
          }
        }
      }
    }
    this.touchData = null;
  }
}

// --- LayeredMenu API для frontApi ---

// Хранилище всех инстансов LayeredMenu
const layeredMenuInstances: LayeredMenu[] = [];

/**
 * API для управления LayeredMenu через frontApi
 */
export const layeredMenuApi = {
  /**
   * Инициализация нового LayeredMenu и добавление в пул
   */
  init(rootSelector: string | HTMLElement, config: LayeredMenuConfig = {}): LayeredMenu {
    const instance = new LayeredMenu(rootSelector, config);
    layeredMenuInstances.push(instance);
    return instance;
  },
  /**
   * Удалить конкретный LayeredMenu (и убрать из пула) по rootSelector
   */
  destroy(rootSelector: string | HTMLElement): void {
    const instance = layeredMenuApi.getInstance(rootSelector);
    if (!instance) return;
    const idx = layeredMenuInstances.indexOf(instance);
    if (idx !== -1) {
      instance.destroy();
      layeredMenuInstances.splice(idx, 1);
    }
  },
  /**
   * Переинициализация конкретного LayeredMenu по rootSelector
   */
  reinit(rootSelector: string | HTMLElement): void {
    const instance = layeredMenuApi.getInstance(rootSelector);
    if (instance) instance.reinit();
  },
  /**
   * Получить инстанс по root элементу (или селектору)
   */
  getInstance(rootSelector: string | HTMLElement): LayeredMenu | undefined {
    const el = typeof rootSelector === 'string'
      ? document.querySelector(rootSelector) as HTMLElement
      : rootSelector;
    return layeredMenuInstances.find(inst => inst['root'] === el);
  },
  /**
   * Подписка на onInit для конкретного инстанса по rootSelector
   */
  onInit(rootSelector: string | HTMLElement, handler: LayeredMenuEventHandler): void {
    const instance = layeredMenuApi.getInstance(rootSelector);
    if (instance) instance.on('onInit', handler);
  },
  /**
   * Подписка на onLayerChange для конкретного инстанса по rootSelector
   */
  onChange(rootSelector: string | HTMLElement, handler: LayeredMenuEventHandler): void {
    const instance = layeredMenuApi.getInstance(rootSelector);
    if (instance) instance.on('onLayerChange', handler);
  },
  /**
   * Подписка на onInit для всех инстансов
   */
  onAnyInit(handler: LayeredMenuEventHandler): void {
    layeredMenuInstances.forEach(inst => inst.on('onInit', handler));
  },
  /**
   * Подписка на onLayerChange для всех инстансов
   */
  onAnyChange(handler: LayeredMenuEventHandler): void {
    layeredMenuInstances.forEach(inst => inst.on('onLayerChange', handler));
  },
  /**
   * Получить массив инстансов
   */
  getInstances(): LayeredMenu[] {
    return layeredMenuInstances;
  },
  /**
   * Удалить все LayeredMenu (destroy + очистка пула)
   */
  destroyAll(): void {
    layeredMenuInstances.forEach(inst => inst.destroy());
    layeredMenuInstances.length = 0;
  },
};

export type LayeredMenuApi = typeof layeredMenuApi; 