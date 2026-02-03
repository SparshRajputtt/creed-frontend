//@ts-nocheck
import { atomWithStorage } from 'jotai/utils';

export const AccessToken = atomWithStorage<string>('AccessToken', '', undefined, { getOnInit: true });
