// Тип для уникального ключа слоя
/**
 * Уникальный ключ слоя меню
 */
export type MenuLayerKey = string;

// Типы встроенных анимаций
/**
 * Типы встроенных анимаций
 */
export type AnimationType = 'slide' | 'fade' | 'cards';

/**
 * Настройки анимации для меню
 * @property type Тип анимации ('slide', 'fade', 'cards')
 * @property duration Длительность анимации (сек)
 * @property easing Имя функции плавности (например, 'power2.out')
 * @property delay Задержка перед анимацией (сек)
 */
export interface AnimationSettings {
  type: AnimationType | string; // string — для кастомных анимаций
  duration?: number;
  easing?: string;
  delay?: number;
  // Можно расширять для кастомных анимаций
}

// Payload для событий перехода между слоями
/**
 * Payload для событий перехода между слоями
 */
export interface LayerChangePayload {
  currentLayer: HTMLElement | null;
  prevLayer: HTMLElement | null;
  currentLayerKey: MenuLayerKey | null;
  prevLayerKey: MenuLayerKey | null;
  direction: 'forward' | 'backward' | 'none';
  currentLayerIndex: number;
  prevLayerIndex: number;
  // Можно добавить доп. инфо (например, triggerElement, customData)
  [key: string]: any;
}

// Список событий
/**
 * Список событий LayeredMenu
 */
export type LayeredMenuEvent =
  | 'onInit'
  | 'onReinit'
  | 'onDestroy'
  | 'onBeforeLayerChange'
  | 'onLayerChange'
  | 'onAfterLayerChange';

// Подпись обработчика событий
/**
 * Обработчик событий LayeredMenu
 */
export type LayeredMenuEventHandler = (payload: LayerChangePayload) => void;

// Конфиг для одного слоя (по ключу)
/**
 * Конфиг для одного слоя меню
 * @property swipeEnabled Включить/отключить свайпы для слоя
 * @property events Обработчики событий только для этого слоя
 * @property meta Любые пользовательские данные для слоя
 * @property allowDirectAccess Запретить прямой переход на слой (по умолчанию true)
 * @property className Кастомный CSS-класс для слоя
 * @property style Кастомные стили для слоя
 */
export interface MenuLayerConfig {
  /** Включить/отключить свайпы для слоя */
  swipeEnabled?: boolean;
  /** Обработчики событий только для этого слоя */
  events?: Partial<Record<LayeredMenuEvent, LayeredMenuEventHandler>>;
  /** Любые пользовательские данные для слоя */
  meta?: Record<string, any>;
  /** Запретить прямой переход на слой (по умолчанию true) */
  allowDirectAccess?: boolean;
  /** Кастомный CSS-класс для слоя */
  className?: string;
  /** Кастомные стили для слоя */
  style?: Partial<CSSStyleDeclaration>;
}

// Глобальный конфиг
/**
 * Глобальный конфиг LayeredMenu
 * @property animation Глобальные настройки анимации
 * @property swipeEnabled Включить/отключить свайпы глобально
 * @property events Глобальные обработчики событий
 * @property onError Глобальный обработчик ошибок
 * @property layers Настройки для отдельных слоёв
 */
export interface LayeredMenuGlobalConfig {
  animation?: Partial<AnimationSettings> | ((from: HTMLElement, to: HTMLElement, direction: string, done: () => void) => void);
  swipeEnabled?: boolean;
  closeOnFirstLayerSwipe?: boolean;
  // ...доп. настройки
}

// Общий конфиг
/**
 * Общий конфиг
 */
export interface LayeredMenuConfig {
  /** Глобальные настройки анимации */
  animation?: Partial<AnimationSettings>;
  /** Включить/отключить свайпы глобально */
  swipeEnabled?: boolean;
  /** Глобальные обработчики событий */
  events?: Partial<Record<LayeredMenuEvent, LayeredMenuEventHandler>>;
  /** Глобальный обработчик ошибок */
  onError?: (error: Error, context: any) => void;
  /** Настройки для отдельных слоёв */
  layers?: Record<MenuLayerKey, MenuLayerConfig>;
} 