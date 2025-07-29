import { LayeredMenu } from "@shared/ui/layered-menu/layeredMenu"
import type { LayeredMenuConfig } from "@shared/ui/layered-menu/types"

let menu: LayeredMenu | null

/**
 * Полный конфиг для каталог-меню с примерами всех возможных настроек
 */
const catalogMenuConfig: LayeredMenuConfig = {
  // Глобальные настройки анимации
  animation: {
    type: 'slide',
    duration: 0.8,
    easing: 'power2.out',
    delay: 0
  },

  // Включить свайпы глобально
  swipeEnabled: true,

  // Глобальные обработчики событий
  events: {
    onInit: (payload) => {
      console.log('Catalog menu initialized:', payload)
    },
    onLayerChange: (payload) => {
      console.log('Catalog layer changed:', payload)
    },
    onDestroy: (payload) => {
      console.log('Catalog menu destroyed:', payload)
    }
  },

  // Глобальный обработчик ошибок
  onError: (error, context) => {
    console.error('Catalog menu error:', error, context)
  },

  // Настройки для отдельных слоёв
  layers: {
    // Слой фильтров
    filters: {
      // Включить/отключить свайпы для слоя
      swipeEnabled: true,

      // Обработчики событий только для этого слоя
      events: {
        onLayerChange: (payload) => {
          if (payload.currentLayerKey === 'filters') {
            console.log('Filters layer activated')
          }
        }
      },

      // Любые пользовательские данные для слоя
      meta: {
        title: 'Фильтры',
        requiresAuth: false,
        category: 'navigation'
      },

      // Запретить прямой переход на слой (по умолчанию true)
      allowDirectAccess: true,

      // Кастомный CSS-класс для слоя
      className: 'catalog-filters-layer',

      // Кастомные стили для слоя
      style: {
        background: '#f8f9fa'
      }
    },

    // Слой фильтров-2
    'filters-2': {
      swipeEnabled: false,
      events: {
        onBeforeLayerChange: (payload) => {
          if (payload.currentLayerKey === 'filters-2') {
            console.log('Preparing filters-2 layer')
          }
        }
      },
      meta: {
        title: 'Дополнительные фильтры',
        requiresAuth: false
      },
      allowDirectAccess: true,
      className: 'catalog-filters-2-layer',
      style: {}
    },

    // Пример слоя с ограниченным доступом
    'restricted': {
      swipeEnabled: true,
      events: {},
      meta: {
        title: 'Ограниченный доступ',
        requiresAuth: true
      },
      allowDirectAccess: false, // Запретить прямой переход
      className: 'restricted-layer',
      style: {}
    }
  }
}

export const catalogMenuInit = () => {
  const menuRoot = document.querySelector('[data-catalog-menu]') as HTMLElement
  if (!menuRoot) return
  menu = new LayeredMenu(menuRoot, catalogMenuConfig)
  menu.init()

  // Дополнительная подписка на события (если нужно)
  menu.on('onLayerChange', (payload) => {
    console.log('Layer changed:', payload)
  })
}

export const catalogMenuReset = () => menu?.reset()

// Экспорт конфига для возможного переиспользования
export { catalogMenuConfig }
