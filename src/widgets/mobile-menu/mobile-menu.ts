import { LayeredMenu, type MenuConfig } from '@shared/scripts/components/layered-menu'

let menu: LayeredMenu | null

export const mobileMenuInit = () => {
  const menuOptions: MenuConfig = {
    global: {
      animation: {
        type: 'cards',
        duration: 0.6,
        easing: 'power2.out',
        delay: 0
      }
    }
  }

  menu = new LayeredMenu('[data-mobile-menu]', menuOptions)
}

export const mobileMenuReset = () => menu?.reset()
