// the v2 config imports the css driver on web and react-native on native
// for reanimated: @tamagui/config/v2-reanimated
// for react-native only: @tamagui/config/v2-native
import { config } from '@tamagui/config/v2'
import { createTamagui } from 'tamagui'

import { createThemeBuilder } from '@tamagui/theme-builder'

import { componentThemeDefinitions } from '@tamagui/themes'
import { masks } from '@tamagui/themes'
import { palettes } from '@tamagui/themes'
import { shadows } from '@tamagui/themes'
import { maskOptions, templates } from '@tamagui/themes'
import { darkColors, lightColors } from '@tamagui/themes'

const colorThemeDefinition = (colorName: string) => [
    {
        parent: 'light',
        palette: colorName,
        template: 'colorLight',
    },
    {
        parent: 'dark',
        palette: colorName,
        template: 'base',
    },
]

const themesBuilder = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    .addMasks(masks)
    .addThemes({
        light: {
            template: 'base',
            palette: 'light',
            nonInheritedValues: {
                ...lightColors,
                ...shadows.light,
            },
        },
        dark: {
            template: 'base',
            palette: 'dark',
            nonInheritedValues: {
                ...darkColors,
                ...shadows.dark,
            },
        },
    })
    .addChildThemes({
        orange: colorThemeDefinition('orange'),
        yellow: colorThemeDefinition('yellow'),
        green: colorThemeDefinition('green'),
        blue: colorThemeDefinition('blue'),
        purple: colorThemeDefinition('purple'),
        pink: colorThemeDefinition('pink'),
        red: colorThemeDefinition('red'),
    })
    .addChildThemes({
        alt1: {
            mask: 'soften',
            ...maskOptions.alt,
        },
        alt2: {
            mask: 'soften2',
            ...maskOptions.alt,
        },
        active: {
            mask: 'soften3',
            skip: {
                color: 1,
            },
        },
    })
    .addChildThemes(componentThemeDefinitions, {
        // to save bundle size but make alt themes not work on components
        // avoidNestingWithin: ['alt1', 'alt2'],
    })

export const themes = themesBuilder.build()

const appConfig = createTamagui({
    ...config,
    themes: themes,
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
    // or '@tamagui/core'
    // overrides TamaguiCustomConfig so your custom types
    // work everywhere you import `tamagui`
    interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig