// the v2 config imports the css driver on web and react-native on native
// for reanimated: @tamagui/config/v2-reanimated
// for react-native only: @tamagui/config/v2-native
import { config } from '@tamagui/config/v2'
import { createAnimations } from '@tamagui/animations-css'
import {createTamagui, createTokens} from 'tamagui'

import { createThemeBuilder } from '@tamagui/theme-builder'

import { componentThemeDefinitions } from '@tamagui/themes'
import { masks } from '@tamagui/themes'
import { palettes } from '@tamagui/themes'
import { shadows } from '@tamagui/themes'
import { maskOptions, templates } from '@tamagui/themes'
import { darkColors, lightColors } from '@tamagui/themes'
import {createSoftenMask} from "@tamagui/create-theme";
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
templates.base.background = 1;
templates.colorLight.background = 1;
const themesBuilder = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    .addMasks(masks)
    .addMasks({
        soften4: createSoftenMask({ strength: 4 }),
        soften5: createSoftenMask({ strength: 5 }),
    })
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
        // orange: colorThemeDefinition('orange'),
        // yellow: colorThemeDefinition('yellow'),
        green: colorThemeDefinition('green'),
        // blue: colorThemeDefinition('blue'),
        // purple: colorThemeDefinition('purple'),
        // pink: colorThemeDefinition('pink'),
        red: colorThemeDefinition('red'),
    })
    .addChildThemes({
        alt1: {
            mask: 'soften3',
            ...maskOptions.alt,
        },
        alt2: {
            mask: 'soften4',
            ...maskOptions.alt,
        },
        softButton: {
            mask: 'soften3',
            skip: {
                color: 1,
            },
        },
        button: {
            mask: 'soften4',
            skip: {
                color: 1,
            },
        },
        active: {
            mask: 'soften5',
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

const tokens = createTokens({
    ...config.tokens,
    webHeader: {
        height: 60,
    }
});

const appConfig = createTamagui({
    ...config,
    tokens: tokens,
    themes: themes,
    media: {
        xs: { maxWidth: 320 },
        gtXs: { minWidth: 320 + 1 },
        sm: { maxWidth: 580 },
        gtSm: { minWidth: 580 + 1 },
        md: { maxWidth: 767 },
        gtMd: { minWidth: 767 + 1 },
        lg: { maxWidth: 1024 },
        gtLg: { minWidth: 1024 + 1 },
        short: { maxHeight: 820 },
        tall: { minHeight: 820 },
        hoverNone: { hover: 'none' },
        pointerCoarse: { pointer: 'coarse' },
    }
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
    // or '@tamagui/core'
    // overrides TamaguiCustomConfig so your custom types
    // work everywhere you import `tamagui`
    interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
