# Многоуровневое меню LayeredMenu

## Назначение
`LayeredMenu` — это JS-класс для управления многоуровневыми меню с анимациями, поддержкой свайпов и событий. Позволяет создавать сложные вложенные меню с плавными переходами между слоями.

---

## Быстрый старт

### 1. HTML-структура
```html
<div id="menu-root">
  <div data-menu-layer="main">
    <button data-menu-next="catalog">В каталог</button>
  </div>
  <div data-menu-layer="catalog" data-menu-parent="main">
    <button data-menu-prev="main">Назад</button>
    <button data-menu-next="item">К товару</button>
  </div>
  <div data-menu-layer="item" data-menu-parent="catalog">
    <button data-menu-prev="catalog">Назад</button>
    <span>Карточка товара</span>
  </div>
</div>
```

### 2. JS-инициализация
```js
import { LayeredMenu } from './layeredMenu'

const menu = new LayeredMenu('#menu-root', {
  animation: { type: 'slide' },
  swipeEnabled: true,
  layers: {
    catalog: { allowDirectAccess: false },
    item: { className: 'item-layer', style: { background: '#fff' } }
  },
  events: {
    onLayerChange: payload => console.log('Слой изменён', payload),
    onError: (err, ctx) => alert(err.message)
  }
})
menu.init()
```

---

## Атрибуты слоёв
- `data-menu-layer="key"` — уникальный ключ слоя (обязателен)
- `data-menu-parent="parentKey"` — ключ родительского слоя (для возврата назад)
- `data-menu-next="key"` — переход к другому слою
- `data-menu-prev="key"` — возврат к другому слою

---

## Конфигурация LayeredMenu

| Параметр         | Тип        | Описание |
|------------------|------------|----------|
| animation        | `{ type: 'slide'\|'cards'\|'fade' }` | Тип анимации переходов |
| swipeEnabled     | `boolean`  | Включить свайпы (по умолчанию true) |
| layers           | `Record<key, LayerConfig>` | Индивидуальные настройки слоёв |
| events           | `Record<event, handler>` | Обработчики событий |
| onError          | `(err, ctx) => void` | Глобальный обработчик ошибок |

### LayerConfig
- `className` — добавить CSS-класс к слою
- `style` — применить inline-стили
- `allowDirectAccess` — запретить прямой переход к слою (например, только через prev/next)
- `swipeEnabled` — включить/выключить свайпы для слоя

---

## Основные методы
- `init()` — инициализация меню
- `reinit()` — повторная инициализация (например, после изменения DOM)
- `destroy()` — полная очистка
- `setLayer(key|offset, isBack?)` — перейти к слою по ключу или смещению
- `reset()` — вернуться к первому слою
- `on(event, handler)` — подписка на событие
- `off(event, handler)` — отписка

---

## События
- `onInit` — при инициализации
- `onReinit` — при повторной инициализации
- `onDestroy` — при удалении
- `onBeforeLayerChange` — до смены слоя
- `onLayerChange` — после смены слоя
- `onAfterLayerChange` — после завершения анимации

**Payload события:**
- `prevLayer`, `currentLayer` — DOM-элементы
- `prevLayerKey`, `currentLayerKey` — ключи
- `direction` — 'forward' | 'backward' | 'none'
- `prevLayerIndex`, `currentLayerIndex` — индексы

---

## Анимации
- `slide` — сдвиг слоёв влево/вправо
- `cards` — эффект карточек
- `fade` — плавное появление/исчезновение

Можно реализовать собственные анимации через файл `animations.ts`.

---

## Свайпы
- Свайпы работают на мобильных (ширина < 1200px)
- Свайп вправо — назад (к родителю)
- Свайп влево — вперёд (если есть один data-menu-next)
- Можно отключить глобально или для конкретного слоя

---

## Рекомендации по интеграции
- Используйте уникальные ключи для каждого слоя
- Для вложенных меню указывайте `data-menu-parent`
- Для сложных переходов используйте события и историю переходов
- Для кастомизации — стилизуйте слои через CSS-классы и inline-стили

---

## Пример расширенной инициализации
```js
const menu = new LayeredMenu('#menu-root', {
  animation: { type: 'cards' },
  swipeEnabled: false,
  layers: {
    main: { className: 'main-layer' },
    catalog: { allowDirectAccess: false, swipeEnabled: true },
    item: { style: { background: '#eee' } }
  },
  events: {
    onLayerChange: payload => {
      // аналитика, логирование, кастомные действия
    }
  },
  onError: (err, ctx) => {
    // обработка ошибок
  }
})
```

---

## Связанные файлы
- `layeredMenu.ts` — основной класс
- `animations.ts` — анимации переходов
- `types.ts` — типы и интерфейсы
- `LayeredMenu.astro` — пример интеграции с Astro 