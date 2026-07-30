import { oxlintBase } from '@matchory/coding-style/oxlint';

export default {
    ...oxlintBase,
    ignorePatterns: [...oxlintBase.ignorePatterns, 'dist', '.cache'],
};
