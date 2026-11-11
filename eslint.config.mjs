import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const restrict = (selector, message) => ({ selector, message });

const SHARED_SYNTAX = [
  restrict('IfStatement', 'Branch with match from ts-pattern (rule 4).'),
  restrict('SwitchStatement', 'Branch with match from ts-pattern (rule 4).'),
  restrict(
    'ConditionalExpression',
    'Branch with match from ts-pattern (rule 4).',
  ),
  restrict(
    "BinaryExpression[operator='instanceof']",
    'Use instanceOf from P (rule 4).',
  ),
  restrict(
    "UnaryExpression[operator='typeof']",
    'Use a lodash type guard (rule 14).',
  ),
  restrict('ForStatement', 'No loops (rule 7).'),
  restrict('ForInStatement', 'No loops (rule 7).'),
  restrict('ForOfStatement', 'No loops (rule 7).'),
  restrict('WhileStatement', 'No loops (rule 7).'),
  restrict('DoWhileStatement', 'No loops (rule 7).'),
  restrict(
    "CallExpression[callee.property.name='forEach']",
    'No forEach (rule 7).',
  ),
  restrict('TryStatement', 'Use tryCatch from ramda (rule 5).'),
  restrict('ThrowStatement', 'Return the fallback from tryCatch (rule 5).'),
  restrict('FunctionDeclaration', 'Arrow functions only (rule 3).'),
  restrict('FunctionExpression', 'Arrow functions only (rule 3).'),
  restrict('ClassDeclaration', 'No classes (rule 3).'),
  restrict('ClassExpression', 'No classes (rule 3).'),
  restrict('ThisExpression', 'No this (rule 3).'),
  restrict("VariableDeclaration[kind!='const']", 'const only (rule 9).'),
  restrict('TSEnumDeclaration', 'Use a string union (rule 50).'),
  restrict('ExportDefaultDeclaration', 'Named exports only (rule 40).'),
  restrict('ExportAllDeclaration', 'Never re-export (rules 36, 40).'),
  restrict('TSNonNullExpression', 'Never ! (rule 49).'),
  restrict("MemberExpression[property.name='length']", 'Use size() (rule 13).'),
  restrict(
    'CallExpression[callee.property.name=/^(map|filter|reduce|reduceRight|find|findIndex|some|every|includes|flatMap|sort|concat|join|slice|reverse|indexOf|trim|split)$/]',
    'Call the lodash-es helper, not the native method (rules 13, 14).',
  ),
  restrict(
    "CallExpression[callee.object.name='Object'][callee.property.name=/^(keys|values|entries|assign)$/]",
    'Use the lodash-es helper (rule 14).',
  ),
  restrict(
    "CallExpression[callee.object.name='Array'][callee.property.name='isArray']",
    'Use isArray (rule 14).',
  ),
  restrict(
    "CallExpression[callee.object.name='Math'][callee.property.name=/^(round|floor|ceil|random)$/]",
    'Use lodash arithmetic, and never Math.random (rules 20, 55).',
  ),
  restrict(
    "CallExpression[callee.object.name='Date'][callee.property.name='now']",
    'Inject the clock (rule 55).',
  ),
  restrict("NewExpression[callee.name='Date']", 'Inject the clock (rule 55).'),
  restrict(
    "CallExpression[callee.name='pipe'][arguments.length<3]",
    'pipe(x, f) is only f(x) (rule 1).',
  ),
  restrict(
    "MemberExpression[object.name='P']",
    'Destructure the pattern helpers off P (rule 11).',
  ),
  restrict(
    "MemberExpression[object.name='_']",
    'Import lodash-es helpers by name (rule 15).',
  ),
  restrict(
    "ImportDeclaration[source.value='lodash-es'] > ImportDefaultSpecifier",
    'Import lodash-es helpers by name (rule 15).',
  ),
  restrict(
    'ImportNamespaceSpecifier',
    'Import library functions by name (rule 15).',
  ),
];

const SOURCE_SYNTAX = [
  ...SHARED_SYNTAX,
  restrict(
    'ExportNamedDeclaration[source!=null]',
    'Never re-export (rule 40).',
  ),
  restrict('AssignmentExpression', 'Never reassign or mutate (rule 6).'),
  restrict('UpdateExpression', 'Never reassign or mutate (rule 6).'),
  restrict('TSAsExpression', 'Never as (rule 49).'),
  restrict('TSTypeAssertion', 'Never as (rule 49).'),
];

const SPEC_SYNTAX = [
  ...SHARED_SYNTAX,
  restrict('ExportNamedDeclaration', 'Specs export nothing.'),
  restrict(
    "TSAsExpression[typeAnnotation.type!='TSUnknownKeyword'][expression.type!='TSAsExpression']",
    'Specs may only cast with as unknown as (rule 78).',
  ),
];

const BARREL_SYNTAX = [
  ...SHARED_SYNTAX,
  restrict(
    'VariableDeclaration',
    'The barrel holds re-exports only (rule 36).',
  ),
  restrict(
    'ExportNamedDeclaration[source=null]',
    'The barrel holds re-exports only (rule 36).',
  ),
];

const RESTRICTED_IMPORTS = {
  paths: [
    { name: 'lodash', message: 'Use named imports from lodash-es (rule 15).' },
    { name: 'lodash/fp', message: 'Data first, always (rule 8).' },
    {
      name: 'remeda',
      allowImportNames: ['pipe'],
      message: 'Only pipe comes from remeda (rule 16).',
    },
    {
      name: 'ramda',
      allowImportNames: ['tryCatch'],
      message: 'Only tryCatch comes from ramda (rule 12).',
    },
    {
      name: 'lodash-es',
      importNames: [
        'chain',
        'flow',
        'flowRight',
        'thru',
        'forEach',
        'forEachRight',
      ],
      message: 'Compose with pipe, and never forEach (rules 7, 16).',
    },
  ],
};

export default defineConfig(
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', '**/*.mjs'] },
  js.configs.recommended,
  tseslint.configs.strict,
  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', RESTRICTED_IMPORTS],
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'func-style': ['error', 'expression'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', 'libs/*/src/index.ts'],
    rules: {
      'no-restricted-syntax': ['error', ...SOURCE_SYNTAX],
      'no-param-reassign': ['error', { props: true }],
      'no-console': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
    },
  },
  {
    files: ['libs/*/src/index.ts'],
    rules: { 'no-restricted-syntax': ['error', ...BARREL_SYNTAX] },
  },
  {
    files: ['**/*.spec.ts'],
    rules: { 'no-restricted-syntax': ['error', ...SPEC_SYNTAX] },
  },
);
