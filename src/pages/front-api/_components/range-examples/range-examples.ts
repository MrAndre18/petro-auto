/* range */

/* 1. Инициализация всех range
window.frontApi.range.initAll()

2. Проверка на то что инициализирован или нет. el - селектор элемента или сам элемент range
window.frontApi.range.isInit(el)

3. Отдать атрибут когда инициализирован data-range-init
window.frontApi.range.getInitializedAttribute(el)

4. Отдать эвент об инициализации и какой именно инициализирован. Как подписаться на событие:
element.addEventListener('range:init', function (event) {
  console.log('Слайдер инициализирован с id:', event.detail.id)
  // Доступ к экземпляру:
  const sliderInst = event.detail.instance
})

5. Переинициализация конкретного слайдера
window.frontApi.range.reInit(el)

Переинициализация всех range
window.frontApi.range.reInitAll()

6. Нахождение конкретного слайдера
window.frontApi.range.findElement(el)

7. Установка границы минимального значения
window.frontApi.range.setBorderMinRangeValue(el, value)

8. Установка текущего минимального значения
window.frontApi.range.setCurrentMinRangeValue(el, value)

14. Установка текущего максимального значения
window.frontApi.range.setCurrentMaxRangeValue(el, value)

9. Получение границы минимального значения
window.frontApi.range.getBorderMinRangeValue(el)

10. Установка границы максимального значения
window.frontApi.range.setBorderMaxRangeValue(el, value)

11. Получение границы максимального значения
window.frontApi.range.getBorderMaxRangeValue(el)

12. Событие change от range должно генерировать у инпута событие range:change. Как подписаться на событие:
const lowerInput = document.querySelector('.range__lower');

lowerInput.addEventListener('range:change', function(event) {
  console.log('Событие range:change сработало!', event.detail);
  // event.detail.value – новое значение, event.detail.instance – экземпляр слайдера
});

13. Событие update от range должно генерировать у инпута событие range:update
const lowerInput = document.querySelector('.range__lower');

lowerInput.addEventListener('range:update', function(event) {
  console.log('Событие range:update получено!', event.detail);
  // event.detail.value – новое значение,
  // event.detail.instance – экземпляр слайдера
});




Для одностороннего слайдера не работают функции, связанные с максимальным значением
*/

export function rangeExamples(): void {
  const ranges: NodeListOf<HTMLElement> = document.querySelectorAll('.range')
  if (ranges.length === 0) return

  // 1. Инициализация всех range
  const initButton = document.querySelector<HTMLElement>('[data-range-init]')
  if (initButton) {
    initButton.addEventListener('click', () => {
      console.info('Результат смотреть в верстке на атрибуте data-range-init')
      window.frontApi.range.initAll()
      console.info(`window.frontApi.range.initAll()`)
    })
  }

  // 2. Проверка на то, что слайдер инициализирован
  const rangeIsInit = document.querySelector<HTMLElement>('[data-range-isinit]')
  if (rangeIsInit) {
    rangeIsInit.addEventListener('click', () => {
      console.info('Результат: ', window.frontApi.range.isInit('#range1'))
      console.info('Функция:')
      console.info(`window.frontApi.range.isInit('#range1')`)
    })
  }

  // 3. Получение атрибута инициализации
  const initAllAttr = document.querySelector<HTMLElement>('[data-range-initialized-attribute]')
  if (initAllAttr) {
    initAllAttr.addEventListener('click', () => {
      console.info('Результат: ', window.frontApi.range.getInitializedAttribute('#range1'))
      console.info('Функция:')
      console.info(`window.frontApi.range.getInitializedAttribute('#range1')`)
    })
  }

  // 5. Переинициализация конкретного слайдера
  const reInit = document.querySelector<HTMLElement>('[data-range-reinit]')
  if (reInit) {
    reInit.addEventListener('click', () => {
      console.info('Результат смотреть в верстке на атрибуте data-range-init')
      window.frontApi.range.reInit('#range1')
      console.info('Функция:')
      console.info(`window.frontApi.range.reInit('#range1')`)
    })
  }

  // Переинициализация всех range
  const reInitAll = document.querySelector<HTMLElement>('[data-range-reinit-all]')
  if (reInitAll) {
    reInitAll.addEventListener('click', () => {
      console.info('Результат смотреть в верстке на атрибуте data-range-init')
      window.frontApi.range.reInitAll()
      console.info('Функция:')
      console.info(`window.frontApi.range.reInitAll()`)
    })
  }

  // 6. Нахождение конкретного слайдера
  const rangeFind = document.querySelector<HTMLElement>('[data-range-find]')
  if (rangeFind) {
    rangeFind.addEventListener('click', () => {
      console.info('Результат: ', window.frontApi.range.findElement('#range1'))
      console.info('Функция:')
      console.info(`window.frontApi.range.findElement('#range1')`)
    })
  }

  // 7. Установка границы минимального значения
  const setBorderMin = document.querySelector<HTMLElement>('[data-range-set-border-min]')
  if (setBorderMin) {
    setBorderMin.addEventListener('click', () => {
      window.frontApi.range.setBorderMinRangeValue('#range1', 120)
      console.info('Результат: смотреть на самом элементе или в верстке')
      console.info('Функция:')
      console.info(`window.frontApi.range.setBorderMinRangeValue('#range1', 120)`)
    })
  }

  // 8. Установка текущего минимального значения
  const setCurMin = document.querySelectorAll<HTMLElement>('[data-range-set-current-min]')
  if (setCurMin.length > 0) {
    setCurMin.forEach(elem => {
      elem.addEventListener('click', e => {
        if (elem.getAttribute('data-range-set-current-min') === '1') {
          window.frontApi.range.setCurrentMinRangeValue('#range1', 3000)
          console.info('Результат: смотреть на самом элементе или в верстке')
          console.info('Функция:')
          console.info(`window.frontApi.range.setCurrentMinRangeValue('#range1', 3000)`)
        } else {
          window.frontApi.range.setCurrentMinRangeValue('#range2', 3000)
          console.info('Результат: смотреть на самом элементе или в верстке')
          console.info('Функция:')
          console.info(`window.frontApi.range.setCurrentMinRangeValue('#range2', 3000)`)
        }
      })
    })
  }

  // 14. Установка текущего максимального значения
  const setCurMax = document.querySelector<HTMLElement>('[data-range-set-current-max]')
  if (setCurMax) {
    setCurMax.addEventListener('click', () => {
      window.frontApi.range.setCurrentMaxRangeValue('#range1', 4000)
      console.info('Результат: смотреть на самом элементе или в верстке')
      console.info('Функция:')
      console.info(`window.frontApi.range.setCurrentMaxRangeValue('#range1', 4000)`)
    })
  }

  // 9. Получение границы минимального значения
  const getBorderMin = document.querySelector<HTMLElement>('[data-range-get-border-min]')
  if (getBorderMin) {
    getBorderMin.addEventListener('click', () => {
      console.info('Результат: ', window.frontApi.range.getBorderMinRangeValue('#range1'))
      console.info('Функция:')
      console.info(`window.frontApi.range.getBorderMinRangeValue('#range1')`)
    })
  }

  // 10. Установка границы максимального значения
  const setBorderMax = document.querySelector<HTMLElement>('[data-range-set-border-max]')
  if (setBorderMax) {
    setBorderMax.addEventListener('click', () => {
      console.info('Результат: смотреть на самом элементе или в верстке')
      window.frontApi.range.setBorderMaxRangeValue('#range1', 8000)
      console.info('Функция:')
      console.info(`window.frontApi.range.setBorderMaxRangeValue('#range1', 8000)`)
    })
  }

  // 11. Получение границы максимального значения
  const getBorderMax = document.querySelector<HTMLElement>('[data-range-get-border-max]')
  if (getBorderMax) {
    getBorderMax.addEventListener('click', () => {
      console.info('Результат: ', window.frontApi.range.getBorderMaxRangeValue('#range1'))
      console.info('Функция:')
      console.info(`window.frontApi.range.getBorderMaxRangeValue('#range1')`)
    })
  }
}
