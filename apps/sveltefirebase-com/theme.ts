import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const custom: CustomThemeConfig = {
	name: 'custom-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Nunito`,
		'--theme-font-family-heading': `Nunito`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '0 0 0',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #ff3e00
		'--color-primary-50': '255 226 217', // #ffe2d9
		'--color-primary-100': '255 216 204', // #ffd8cc
		'--color-primary-200': '255 207 191', // #ffcfbf
		'--color-primary-300': '255 178 153', // #ffb299
		'--color-primary-400': '255 120 77', // #ff784d
		'--color-primary-500': '255 62 0', // #ff3e00
		'--color-primary-600': '230 56 0', // #e63800
		'--color-primary-700': '191 47 0', // #bf2f00
		'--color-primary-800': '153 37 0', // #992500
		'--color-primary-900': '125 30 0', // #7d1e00
		// secondary | #ffcd36
		'--color-secondary-50': '255 248 225', // #fff8e1
		'--color-secondary-100': '255 245 215', // #fff5d7
		'--color-secondary-200': '255 243 205', // #fff3cd
		'--color-secondary-300': '255 235 175', // #ffebaf
		'--color-secondary-400': '255 220 114', // #ffdc72
		'--color-secondary-500': '255 205 54', // #ffcd36
		'--color-secondary-600': '230 185 49', // #e6b931
		'--color-secondary-700': '191 154 41', // #bf9a29
		'--color-secondary-800': '153 123 32', // #997b20
		'--color-secondary-900': '125 100 26', // #7d641a
		// tertiary | #0EA5E9
		'--color-tertiary-50': '219 242 252', // #dbf2fc
		'--color-tertiary-100': '207 237 251', // #cfedfb
		'--color-tertiary-200': '195 233 250', // #c3e9fa
		'--color-tertiary-300': '159 219 246', // #9fdbf6
		'--color-tertiary-400': '86 192 240', // #56c0f0
		'--color-tertiary-500': '14 165 233', // #0EA5E9
		'--color-tertiary-600': '13 149 210', // #0d95d2
		'--color-tertiary-700': '11 124 175', // #0b7caf
		'--color-tertiary-800': '8 99 140', // #08638c
		'--color-tertiary-900': '7 81 114', // #075172
		// success | #84cc16
		'--color-success-50': '237 247 220', // #edf7dc
		'--color-success-100': '230 245 208', // #e6f5d0
		'--color-success-200': '224 242 197', // #e0f2c5
		'--color-success-300': '206 235 162', // #ceeba2
		'--color-success-400': '169 219 92', // #a9db5c
		'--color-success-500': '132 204 22', // #84cc16
		'--color-success-600': '119 184 20', // #77b814
		'--color-success-700': '99 153 17', // #639911
		'--color-success-800': '79 122 13', // #4f7a0d
		'--color-success-900': '65 100 11', // #41640b
		// warning | #EAB308
		'--color-warning-50': '252 244 218', // #fcf4da
		'--color-warning-100': '251 240 206', // #fbf0ce
		'--color-warning-200': '250 236 193', // #faecc1
		'--color-warning-300': '247 225 156', // #f7e19c
		'--color-warning-400': '240 202 82', // #f0ca52
		'--color-warning-500': '234 179 8', // #EAB308
		'--color-warning-600': '211 161 7', // #d3a107
		'--color-warning-700': '176 134 6', // #b08606
		'--color-warning-800': '140 107 5', // #8c6b05
		'--color-warning-900': '115 88 4', // #735804
		// error | #f80d0d
		'--color-error-50': '254 219 219', // #fedbdb
		'--color-error-100': '254 207 207', // #fecfcf
		'--color-error-200': '253 195 195', // #fdc3c3
		'--color-error-300': '252 158 158', // #fc9e9e
		'--color-error-400': '250 86 86', // #fa5656
		'--color-error-500': '248 13 13', // #f80d0d
		'--color-error-600': '223 12 12', // #df0c0c
		'--color-error-700': '186 10 10', // #ba0a0a
		'--color-error-800': '149 8 8', // #950808
		'--color-error-900': '122 6 6', // #7a0606
		// surface | #495a8f
		'--color-surface-50': '228 230 238', // #e4e6ee
		'--color-surface-100': '219 222 233', // #dbdee9
		'--color-surface-200': '210 214 227', // #d2d6e3
		'--color-surface-300': '182 189 210', // #b6bdd2
		'--color-surface-400': '128 140 177', // #808cb1
		'--color-surface-500': '73 90 143', // #495a8f
		'--color-surface-600': '66 81 129', // #425181
		'--color-surface-700': '55 68 107', // #37446b
		'--color-surface-800': '44 54 86', // #2c3656
		'--color-surface-900': '36 44 70' // #242c46
	}
};
