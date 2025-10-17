import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: { '@typescript-eslint/restrict-template-expressions': 'off' },
  },
  {
    // Disallow non-canonical imports
    name: 'app/only-canonical-imports',
    files: ['src/**/*.{ts,vue}', 'server/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message:
                'Relative imports are not allowed. Use an absolute import starting with "@" or "#server".',
            },
            {
              group: ['*.js', '*.ts'],
              message:
                'JavaScript and TypeScript imports should be extensionless. Remove the extension.',
            },
            {
              group: ['**/index'],
              message:
                'Redundant index in folder import. Remove the trailing /index.',
            },
          ],
        },
      ],
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  pluginVue.configs['flat/strongly-recommended'],
  pluginVue.configs['flat/recommended'],

  vueTsConfigs.strictTypeChecked,
  vueTsConfigs.stylisticTypeChecked,
  skipFormatting,

  {
    name: 'app/warn-unused',
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
    },
  },
);
